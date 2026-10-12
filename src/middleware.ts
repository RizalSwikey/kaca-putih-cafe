import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Public accessible paths
const PUBLIC_PREFIXES = ["/login", "/menu", "/story", "/location", "/track", "/api/public"];

// Role route permissions mapping
const ROLE_ROUTE_PERMISSIONS: Record<string, string[]> = {
  admin: ["/admin", "/pos", "/kitchen", "/account", "/loyalty"],
  cashier: ["/pos"],
  kitchen: ["/kitchen"],
  customer: ["/account", "/loyalty"],
};

export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // 1. Bypass static assets & Next internals
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.startsWith("/icons") ||
    pathname.startsWith("/images") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // 2. Initialize response & Supabase client via @supabase/ssr
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // 3. Sandbox Mode Bypass Check (accepts "x-sandbox-mode" cookie, header, or legacy "sandbox_mode")
  const sandboxCookie =
    request.cookies.get("x-sandbox-mode")?.value === "true" ||
    request.cookies.get("sandbox_mode")?.value === "true" ||
    request.headers.get("x-sandbox-mode") === "true";

  let activeRole: string | null = null;

  if (sandboxCookie) {
    activeRole =
      request.headers.get("x-simulated-role") ||
      request.cookies.get("simulated_role")?.value ||
      "admin"; // Default sandbox elevation
  }

  // 4. Authenticate via Supabase when credentials exist and not in sandbox
  if (!activeRole && supabaseUrl && supabaseAnonKey) {
    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: "", ...options });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({ name, value: "", ...options });
        },
      },
    });

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        // Fast path: read custom claims / metadata
        const metaRole = (user.app_metadata?.role || user.user_metadata?.role) as string | undefined;
        if (metaRole) {
          activeRole = metaRole;
        } else {
          // Fallback: query profile role
          const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", user.id)
            .single();
          activeRole = profile?.role || "customer";
        }
      }
    } catch {
      // Supabase connection error fallback
    }
  }

  // If root route "/" or public paths, allow direct access
  const isRoot = pathname === "/";
  const isPublic = isRoot || PUBLIC_PREFIXES.some((prefix) => pathname.startsWith(prefix));

  // If user is already on login page and authenticated, redirect appropriately
  if (pathname === "/login" && activeRole) {
    const redirectUrl = searchParams.get("redirect");
    if (redirectUrl && redirectUrl.startsWith("/")) {
      return NextResponse.redirect(new URL(redirectUrl, request.url));
    }
    const target =
      activeRole === "admin"
        ? "/admin"
        : activeRole === "cashier"
        ? "/pos"
        : activeRole === "kitchen"
        ? "/kitchen"
        : "/";
    return NextResponse.redirect(new URL(target, request.url));
  }

  // Allow public routes
  if (isPublic) {
    return response;
  }

  // 5. Protected route enforcement
  const isStaffRoute = ["/admin", "/pos", "/kitchen"].some((prefix) => pathname.startsWith(prefix));

  // Not logged in -> redirect to login with encoded callback
  if (!activeRole) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Customer attempting staff/operational route -> block and redirect to home with error flag
  if (activeRole === "customer" && isStaffRoute) {
    const homeUrl = new URL("/", request.url);
    homeUrl.searchParams.set("error", "unauthorized_staff_only");
    return NextResponse.redirect(homeUrl);
  }

  // Check role-specific permissions
  const allowedPrefixes = ROLE_ROUTE_PERMISSIONS[activeRole] || [];
  const hasAccess = allowedPrefixes.some((prefix) => pathname.startsWith(prefix));

  if (!hasAccess) {
    // Staff attempting unauthorized sibling staff route (e.g. kitchen accessing /admin)
    const fallbackTarget =
      activeRole === "kitchen" ? "/kitchen" : activeRole === "cashier" ? "/pos" : "/";
    const redirectUrl = new URL(fallbackTarget, request.url);
    redirectUrl.searchParams.set("error", "forbidden");
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images/ (public images)
     * - icons/ (public icons)
     */
    "/((?!_next/static|_next/image|favicon.ico|images|icons).*)",
  ],
};
