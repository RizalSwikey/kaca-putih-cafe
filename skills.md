---

name: frontend-design

description: Create distinctive, production-grade frontend interfaces with high design quality. Use this skill when the user asks to build web components, pages, artifacts, posters, or applications (examples include websites, landing pages, dashboards, React components, HTML/CSS layouts, or when styling/beautifying any web UI). Generates creative, polished code and UI design that avoids generic AI aesthetics.

license: Complete terms in LICENSE.txt

---
This skill guides creation of distinctive, production-grade frontend interfaces that avoid generic "AI slop" aesthetics. Implement real working code with exceptional attention to aesthetic details and creative choices.

The user provides frontend requirements: a component, page, application, or interface to build. They may include context about the purpose, audience, or technical constraints.

## Design Thinking

Before coding, understand the context and commit to a BOLD aesthetic direction:

- **Purpose**: What problem does this interface solve? Who uses it?
- **Tone**: Pick an extreme: brutally minimal, maximalist chaos, retro-futuristic, organic/natural, luxury/refined, playful/toy-like, editorial/magazine, brutalist/raw, art deco/geometric, soft/pastel, industrial/utilitarian, etc. There are so many flavors to choose from. Use these for inspiration but design one that is true to the aesthetic direction.
- **Constraints**: Technical requirements (framework, performance, accessibility).
- **Differentiation**: What makes this UNFORGETTABLE? What's the one thing someone will remember?

**CRITICAL**: Choose a clear conceptual direction and execute it with precision. Bold maximalism and refined minimalism both work - the key is intentionality, not intensity.

Then implement working code (HTML/CSS/JS, React, Vue, etc.) that is:

- Production-grade and functional
- Visually striking and memorable
- Cohesive with a clear aesthetic point-of-view
- Meticulously refined in every detail

## Frontend Aesthetics Guidelines

Focus on:

- **Typography**: Choose fonts that are beautiful, unique, and interesting. Avoid generic fonts like Arial and Inter; opt instead for distinctive choices that elevate the frontend's aesthetics; unexpected, characterful font choices. Pair a distinctive display font with a refined body font.
- **Color &amp; Theme**: Commit to a cohesive aesthetic. Use CSS variables for consistency. Dominant colors with sharp accents outperform timid, evenly-distributed palettes.
- **Motion**: Use animations for effects and micro-interactions. Prioritize CSS-only solutions for HTML. Use Motion library for React when available. Focus on high-impact moments: one well-orchestrated page load with staggered reveals (animation-delay) creates more delight than scattered micro-interactions. Use scroll-triggering and hover states that surprise.
- **Spatial Composition**: Unexpected layouts. Asymmetry. Overlap. Diagonal flow. Grid-breaking elements. Generous negative space OR controlled density.
- **Backgrounds &amp; Visual Details**: Create atmosphere and depth rather than defaulting to solid colors. Add contextual effects and textures that match the overall aesthetic. Apply creative forms like gradient meshes, noise textures, geometric patterns, layered transparencies, dramatic shadows, decorative borders, custom cursors, and grain overlays.

NEVER use generic AI-generated aesthetics like overused font families (Inter, Roboto, Arial, system fonts), cliched color schemes (particularly purple gradients on white backgrounds), predictable layouts and component patterns, and cookie-cutter design that lacks context-specific character.

Interpret creatively and make unexpected choices that feel genuinely designed for the context. No design should be the same. Vary between light and dark themes, different fonts, different aesthetics. NEVER converge on common choices (Space Grotesk, for example) across generations.

**IMPORTANT**: Match implementation complexity to the aesthetic vision. Maximalist designs need elaborate code with extensive animations and effects. Minimalist or refined designs need restraint, precision, and careful attention to spacing, typography, and subtle details. Elegance comes from executing the vision well.

Remember: Claude is capable of extraordinary creative work. Don't hold back, show what can truly be created when thinking outside the box and committing fully to a distinctive vision.

---

name: web-artifacts-builder

description: Suite of tools for creating elaborate, multi-component [claude.ai](http://claude.ai) HTML artifacts using modern frontend web technologies (React, Tailwind CSS, shadcn/ui). Use for complex artifacts requiring state management, routing, or shadcn/ui components - not for simple single-file HTML/JSX artifacts.

license: Complete terms in LICENSE.txt

---

# Web Artifacts Builder

To build powerful frontend [claude.ai](http://claude.ai) artifacts, follow these steps:

1. Initialize the frontend repo using `scripts/[init-artifact.sh](http://init-artifact.sh)`
2. Develop your artifact by editing the generated code
3. Bundle all code into a single HTML file using `scripts/[bundle-artifact.sh](http://bundle-artifact.sh)`
4. Display artifact to user
5. (Optional) Test the artifact

**Stack**: React 18 + TypeScript + Vite + Parcel (bundling) + Tailwind CSS + shadcn/ui

## Design &amp; Style Guidelines

VERY IMPORTANT: To avoid what is often referred to as "AI slop", avoid using excessive centered layouts, purple gradients, uniform rounded corners, and Inter font.

## Quick Start

### Step 1: Initialize Project

Run the initialization script to create a new React project:

```bash

bash scripts/[init-artifact.sh](http://init-artifact.sh) &lt;project-name&gt;

cd &lt;project-name&gt;

```

This creates a fully configured project with:

- ✅ React + TypeScript (via Vite)
- ✅ Tailwind CSS 3.4.1 with shadcn/ui theming system
- ✅ Path aliases `@/`) configured
- ✅ 40+ shadcn/ui components pre-installed
- ✅ All Radix UI dependencies included
- ✅ Parcel configured for bundling (via .parcelrc)
- ✅ Node 18+ compatibility (auto-detects and pins Vite version)

### Step 2: Develop Your Artifact

To build the artifact, edit the generated files. See **Common Development Tasks** below for guidance.

### Step 3: Bundle to Single HTML File

To bundle the React app into a single HTML artifact:

```bash

bash scripts/[bundle-artifact.sh](http://bundle-artifact.sh)

```

This creates `bundle.html` - a self-contained artifact with all JavaScript, CSS, and dependencies inlined. This file can be directly shared in Claude conversations as an artifact.

**Requirements**: Your project must have an `index.html` in the root directory.

**What the script does**:

- Installs bundling dependencies (parcel, @parcel/config-default, parcel-resolver-tspaths, html-inline)
- Creates `.parcelrc` config with path alias support
- Builds with Parcel (no source maps)
- Inlines all assets into single HTML using html-inline

### Step 4: Share Artifact with User

Finally, share the bundled HTML file in conversation with the user so they can view it as an artifact.

### Step 5: Testing/Visualizing the Artifact (Optional)

Note: This is a completely optional step. Only perform if necessary or requested.

To test/visualize the artifact, use available tools (including other Skills or built-in tools like Playwright or Puppeteer). In general, avoid testing the artifact upfront as it adds latency between the request and when the finished artifact can be seen. Test later, after presenting the artifact, if requested or if issues arise.

## Reference

- **shadcn/ui components**: [https://ui.shadcn.com/docs/components](https://ui.shadcn.com/docs/components)

  
  
---

name: webapp-testing

description: Toolkit for interacting with and testing local web applications using Playwright. Supports verifying frontend functionality, debugging UI behavior, capturing browser screenshots, and viewing browser logs.

license: Complete terms in LICENSE.txt

---

# Web Application Testing

To test local web applications, write native Python Playwright scripts.

**Helper Scripts Available**:

- `scripts/with_[server.py](http://server.py)` - Manages server lifecycle (supports multiple servers)

**Always run scripts with `--help` first** to see usage. DO NOT read the source until you try running the script first and find that a customized solution is abslutely necessary. These scripts can be very large and thus pollute your context window. They exist to be called directly as black-box scripts rather than ingested into your context window.

## Decision Tree: Choosing Your Approach

```

User task → Is it static HTML?

    ├─ Yes → Read HTML file directly to identify selectors

    │         ├─ Success → Write Playwright script using selectors

    │         └─ Fails/Incomplete → Treat as dynamic (below)

    │

    └─ No (dynamic webapp) → Is the server already running?

        ├─ No → Run: python scripts/with_[server.py](http://server.py) --help

        │        Then use the helper + write simplified Playwright script

        │

        └─ Yes → Reconnaissance-then-action:

            1. Navigate and wait for networkidle

            2. Take screenshot or inspect DOM

            3. Identify selectors from rendered state

            4. Execute actions with discovered selectors

```

## Example: Using with_[server.py](http://server.py)

To start a server, run `--help` first, then use the helper:

**Single server:**

```bash

python scripts/with_[server.py](http://server.py) --server "npm run dev" --port 5173 -- python your_[automation.py](http://automation.py)

```

**Multiple servers (e.g., backend + frontend):**

```bash

python scripts/with_[server.py](http://server.py) \

  --server "cd backend &amp;&amp; python [server.py](http://server.py)" --port 3000 \

  --server "cd frontend &amp;&amp; npm run dev" --port 5173 \

  -- python your_[automation.py](http://automation.py)

```

To create an automation script, include only Playwright logic (servers are managed automatically):

```python

from playwright.sync_api import sync_playwright

with sync_playwright() as p:

    browser = p.chromium.launch(headless=True) # Always launch chromium in headless mode

    page = [browser.new](http://browser.new)_page()

    page.goto('[http://localhost:5173](http://localhost:5173)') # Server already running and ready

    page.wait_for_load_state('networkidle') # CRITICAL: Wait for JS to execute

    # ... your automation logic

    browser.close()

```

## Reconnaissance-Then-Action Pattern

1. **Inspect rendered DOM**:

   ```python

   page.screenshot(path='/tmp/inspect.png', full_page=True)

   content = page.content()

   page.locator('button').all()

   ```

2. **Identify selectors** from inspection results

3. **Execute actions** using discovered selectors

## Common Pitfall

❌ **Don't** inspect the DOM before waiting for `networkidle` on dynamic apps

✅ **Do** wait for `page.wait_for_load_state('networkidle')` before inspection

## Best Practices

- **Use bundled scripts as black boxes** - To accomplish a task, consider whether one of the scripts available in `scripts/` can help. These scripts handle common, complex workflows reliably without cluttering the context window. Use `--help` to see usage, then invoke directly. 

- Use `sync_playwright()` for synchronous scripts

- Always close the browser when done

- Use descriptive selectors: `text=`, `role=`, CSS selectors, or IDs

- Add appropriate waits: `page.wait_for_selector()` or `page.wait_for_timeout()`

## Reference Files

- **examples/** - Examples showing common patterns:

  - `element_[discovery.py](http://discovery.py)` - Discovering buttons, links, and inputs on a page

  - `static_html_[automation.py](http://automation.py)` - Using file:// URLs for local HTML

  - `console_[logging.py](http://logging.py)` - Capturing console logs during automation