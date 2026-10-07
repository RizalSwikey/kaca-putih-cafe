-- ==============================================================================
-- Kaca Putih Cafe & Kitchen - Seed Data Script (seed.sql)
-- Derived strictly from MenuKacaputih.pdf
-- ==============================================================================

TRUNCATE TABLE public.order_items CASCADE;
TRUNCATE TABLE public.orders CASCADE;
TRUNCATE TABLE public.product_variants CASCADE;
TRUNCATE TABLE public.products CASCADE;
TRUNCATE TABLE public.categories CASCADE;
TRUNCATE TABLE public.store_settings CASCADE;

-- 1. STORE SETTINGS
INSERT INTO public.store_settings (is_ramadan_mode, open_time, close_time, whatsapp_number, demo_mode_enabled)
VALUES (false, '09:00:00', '22:00:00', '+6282245406501', true);

-- 2. CATEGORIES
INSERT INTO public.categories (id, name, slug, sort_order) VALUES
('10000000-0000-0000-0000-000000000001', 'Our Signature', 'our-signature', 1),
('10000000-0000-0000-0000-000000000002', 'Coffee Based', 'coffee-based', 2),
('10000000-0000-0000-0000-000000000003', 'Manual Brew', 'manual-brew', 3),
('10000000-0000-0000-0000-000000000004', 'Milk Based', 'milk-based', 4),
('10000000-0000-0000-0000-000000000005', 'Mocktail', 'mocktail', 5),
('10000000-0000-0000-0000-000000000006', 'Yakult Series', 'yakult-series', 6),
('10000000-0000-0000-0000-000000000007', 'Tea Based', 'tea-based', 7),
('10000000-0000-0000-0000-000000000008', 'Main Foods', 'main-foods', 8),
('10000000-0000-0000-0000-000000000009', 'Snacks', 'snacks', 9),
('10000000-0000-0000-0000-000000000010', 'Daily Bakery', 'daily-bakery', 10),
('10000000-0000-0000-0000-000000000011', 'Add-Ons', 'add-ons', 11);

-- 3. PRODUCTS & VARIANTS

-- Category 1: Our Signature
INSERT INTO public.products (id, category_id, name, slug, description, base_price, is_signature, is_available, is_daily_bakery) VALUES
('20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'Mont Blanc', 'mont-blanc', 'Signature layered iced coffee with velvety cream crown.', 30000, true, true, false),
('20000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', 'Dirty Latte', 'dirty-latte', 'Rich hot espresso poured directly over cold dense milk.', 32000, true, true, false),
('20000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000001', 'Butterscotch', 'butterscotch', 'Smooth espresso infused with rich buttery caramelized sweetness.', 28000, true, true, false),
('20000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000001', 'Blossom', 'blossom', 'Aromatic floral infused espresso mocktail with subtle citrus finish.', 27000, true, true, false);

-- Category 2: Coffee Based
INSERT INTO public.products (id, category_id, name, slug, description, base_price, is_signature, is_available, is_daily_bakery) VALUES
('20000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000002', 'Black Coffee', 'black-coffee', 'A bold coffee made from espresso diluted with water. Simple, strong, and perfect for true coffee lovers.', 20000, false, true, false),
('20000000-0000-0000-0000-000000000006', '10000000-0000-0000-0000-000000000002', 'Cappuccino', 'cappuccino', 'A classic coffee with a rich espresso base, topped with steamed milk and a thick layer of creamy foam. Smooth, bold, and perfectly balanced.', 24000, false, true, false),
('20000000-0000-0000-0000-000000000007', '10000000-0000-0000-0000-000000000002', 'Caffe Latte', 'caffe-latte', 'A smooth and mellow blend of rich espresso and steamed milk, finished with a light layer of foam. Creamy, comforting, and perfect any time of day.', 26000, false, true, false),
('20000000-0000-0000-0000-000000000008', '10000000-0000-0000-0000-000000000002', 'Caramel Latte', 'caramel-latte', 'Espresso and steamed milk blended with smooth caramel, finished with a caramel drizzle. Sweet and comforting in every sip.', 27000, false, true, false),
('20000000-0000-0000-0000-000000000009', '10000000-0000-0000-0000-000000000002', 'Brown Sugar Latte', 'brown-sugar-latte', 'Espresso, milk, and sweet brown sugar come together in this cozy, creamy favorite. Simple, sweet, and so good!', 25000, false, true, false),
('20000000-0000-0000-0000-000000000010', '10000000-0000-0000-0000-000000000002', 'Vanilla Latte', 'vanilla-latte', 'Espresso, milk, and vanilla syrup come together in this cozy, creamy treat. Sweet, smooth, and totally satisfying!', 27000, false, true, false),
('20000000-0000-0000-0000-000000000011', '10000000-0000-0000-0000-000000000002', 'Hazelnut Latte', 'hazelnut-latte', 'A smooth blend of espresso and steamed milk infused with sweet, nutty hazelnut syrup. Warm, creamy, and comforting.', 27000, false, true, false);

-- Variants for Coffee Based
INSERT INTO public.product_variants (product_id, name, price_delta) VALUES
('20000000-0000-0000-0000-000000000005', 'Hot', 0),
('20000000-0000-0000-0000-000000000005', 'Ice', 2000),
('20000000-0000-0000-0000-000000000006', 'Hot', 0),
('20000000-0000-0000-0000-000000000007', 'Hot', 0),
('20000000-0000-0000-0000-000000000007', 'Cold', 0),
('20000000-0000-0000-0000-000000000008', 'Hot', 0),
('20000000-0000-0000-0000-000000000008', 'Cold', 0),
('20000000-0000-0000-0000-000000000010', 'Hot', 0),
('20000000-0000-0000-0000-000000000010', 'Cold', 0),
('20000000-0000-0000-0000-000000000011', 'Hot', 0),
('20000000-0000-0000-0000-000000000011', 'Cold', 0);

-- Category 3: Manual Brew
INSERT INTO public.products (id, category_id, name, slug, description, base_price, is_signature, is_available, is_daily_bakery) VALUES
('20000000-0000-0000-0000-000000000012', '10000000-0000-0000-0000-000000000003', 'V60 Pour Over', 'v60', 'Clean and nuanced pour-over extraction highlighting origin coffee notes.', 28000, false, true, false),
('20000000-0000-0000-0000-000000000013', '10000000-0000-0000-0000-000000000003', 'Vietnam Drip', 'vietnam-drip', 'Slow-dripped dark roast coffee served with sweet condensed milk.', 25000, false, true, false),
('20000000-0000-0000-0000-000000000014', '10000000-0000-0000-0000-000000000003', 'Kopi Tubruk', 'tubruk', 'Traditional unfiltered Indonesian brew with bold body and rich aroma.', 10000, false, true, false),
('20000000-0000-0000-0000-000000000015', '10000000-0000-0000-0000-000000000003', 'Kopi Tubruk Susu', 'tubruk-susu', 'Traditional Indonesian tubruk coffee smoothed with sweet condensed milk.', 15000, false, true, false);

-- Category 4: Milk Based
INSERT INTO public.products (id, category_id, name, slug, description, base_price, is_signature, is_available, is_daily_bakery) VALUES
('20000000-0000-0000-0000-000000000016', '10000000-0000-0000-0000-000000000004', 'Cookies & Cream', 'cookies-and-cream', 'A creamy blend of crushed cookies and rich vanilla milk, topped with cookie crumbles. Cold, sweet, smooth and perfect for cookie lovers!', 26000, false, true, false),
('20000000-0000-0000-0000-000000000017', '10000000-0000-0000-0000-000000000004', 'Red Velvet', 'red-velvet', 'A smooth and velvety flavour blend with creamy milk. Served cold or hot, makes you want to have some more!', 26000, false, true, false),
('20000000-0000-0000-0000-000000000018', '10000000-0000-0000-0000-000000000004', 'Matcha Latte', 'matcha-latte', 'A smooth and earthy blend of premium matcha and creamy milk. Refreshing, calming, and full of enjoyments!', 28000, false, true, false),
('20000000-0000-0000-0000-000000000019', '10000000-0000-0000-0000-000000000004', 'Chocolatey', 'chocolatey', 'A rich and indulgent blend of creamy milk and smooth chocolate, served hot or iced. Comforting, classic, and loved by all ages.', 26000, false, true, false),
('20000000-0000-0000-0000-000000000020', '10000000-0000-0000-0000-000000000004', 'Ice Choco Hazelnut / Vanilla', 'ice-choco-hazelnut-vanilla', 'Rich iced chocolate blended with nutty hazelnut or fragrant vanilla notes.', 26000, false, true, false);

-- Variants for Milk Based
INSERT INTO public.product_variants (product_id, name, price_delta) VALUES
('20000000-0000-0000-0000-000000000017', 'Hot', 0),
('20000000-0000-0000-0000-000000000017', 'Cold', 0),
('20000000-0000-0000-0000-000000000018', 'Hot', 0),
('20000000-0000-0000-0000-000000000018', 'Cold', 2000),
('20000000-0000-0000-0000-000000000019', 'Hot', 0),
('20000000-0000-0000-0000-000000000019', 'Cold', 0),
('20000000-0000-0000-0000-000000000020', 'Hazelnut', 0),
('20000000-0000-0000-0000-000000000020', 'Vanilla', 0);

-- Category 5: Mocktails
INSERT INTO public.products (id, category_id, name, slug, description, base_price, is_signature, is_available, is_daily_bakery) VALUES
('20000000-0000-0000-0000-000000000021', '10000000-0000-0000-0000-000000000005', 'Midnight Blush', 'midnight-blush', 'A refreshing soda water blend with blue curracao and strawberry syrup. Makes it looks like beautiful night sky with a hint of pink from your hearts.', 25000, false, true, false),
('20000000-0000-0000-0000-000000000022', '10000000-0000-0000-0000-000000000005', 'Pomoleo', 'pomoleo', 'A revitalizing blend of zesty lemon, pomegranate and orange juice that will leave you feeling refreshed and rejuvenated!', 25000, false, true, false);

-- Category 6: Yakult Series
INSERT INTO public.products (id, category_id, name, slug, description, base_price, is_signature, is_available, is_daily_bakery) VALUES
('20000000-0000-0000-0000-000000000023', '10000000-0000-0000-0000-000000000006', 'Lychee Yakult', 'lychee-yakult', 'Tangy probiotic Yakult layered with sweet fragrant lychee puree.', 25000, false, true, false),
('20000000-0000-0000-0000-000000000024', '10000000-0000-0000-0000-000000000006', 'Strawberry Yakult', 'strawberry-yakult', 'Fresh vibrant strawberry syrup shaken with chilled probiotic Yakult.', 25000, false, true, false);

-- Category 7: Tea Based
INSERT INTO public.products (id, category_id, name, slug, description, base_price, is_signature, is_available, is_daily_bakery) VALUES
('20000000-0000-0000-0000-000000000025', '10000000-0000-0000-0000-000000000007', 'Strawberry Tea', 'strawberry-tea', 'A refreshing blend of tea and sweet strawberry flavor. Light, fruity, and perfect for any time of day.', 23000, false, true, false),
('20000000-0000-0000-0000-000000000026', '10000000-0000-0000-0000-000000000007', 'Lemon Tea', 'lemon-tea', 'A zesty blend of black tea and fresh lemon, served hot or iced. Bright, tangy, and perfectly refreshing.', 20000, false, true, false),
('20000000-0000-0000-0000-000000000027', '10000000-0000-0000-0000-000000000007', 'Lychee Tea', 'lychee-tea', 'Delicate tea infused with the exotic sweetness of fresh lychee. A perfect balance of floral and fruity notes.', 23000, false, true, false),
('20000000-0000-0000-0000-000000000028', '10000000-0000-0000-0000-000000000007', 'Thai Tea', 'thai-tea', 'A bold and creamy Thai tea mixed with sweetened condensed milk. Rich, sweet, and full of character.', 25000, false, true, false),
('20000000-0000-0000-0000-000000000029', '10000000-0000-0000-0000-000000000007', 'Teh Tubruk Spesial', 'teh-tubruk-spesial', 'New sensational ways to drink your tea. Teh Tubruk Gula Batu for original taste and Teh Tubruk Gula Merah Jahe for warm spicy note.', 23000, false, true, false),
('20000000-0000-0000-0000-000000000030', '10000000-0000-0000-0000-000000000007', 'Java Tea', 'java-tea', 'A bold and aromatic black tea with a rich, earthy flavor. Smooth and refreshing, perfect served hot or iced.', 12000, false, true, false);

-- Variants for Tea Based
INSERT INTO public.product_variants (product_id, name, price_delta) VALUES
('20000000-0000-0000-0000-000000000026', 'Hot', 0),
('20000000-0000-0000-0000-000000000026', 'Cold', 1000),
('20000000-0000-0000-0000-000000000029', 'Gula Batu', 0),
('20000000-0000-0000-0000-000000000029', 'Gula Merah Jahe', 0),
('20000000-0000-0000-0000-000000000030', 'Hot', 0),
('20000000-0000-0000-0000-000000000030', 'Cold', 3000);

-- Category 8: Main Foods
INSERT INTO public.products (id, category_id, name, slug, description, base_price, is_signature, is_available, is_daily_bakery) VALUES
('20000000-0000-0000-0000-000000000031', '10000000-0000-0000-0000-000000000008', 'Nasi Goreng Rendang', 'nasi-goreng-rendang', 'Fragrant wok-fried rice spiced with rich authentic Minang beef rendang flavors.', 29000, true, true, false),
('20000000-0000-0000-0000-000000000032', '10000000-0000-0000-0000-000000000008', 'Nasi Lodeh Telor Kribo', 'nasi-lodeh-telor-kribo', 'Comforting savory vegetable coconut stew with crispy golden fried egg kribo.', 24000, true, true, false),
('20000000-0000-0000-0000-000000000033', '10000000-0000-0000-0000-000000000008', 'Nasi Ayam Goreng Kremes', 'nasi-ayam-goreng-kremes', 'Ayam goreng kremes with rice, vegetables urap, and our homemade sambal terasi.', 26000, false, true, false),
('20000000-0000-0000-0000-000000000034', '10000000-0000-0000-0000-000000000008', 'Nasi Goreng Teri', 'nasi-goreng-teri', 'Indonesian-style fried rice mixed with crispy anchovies, garlic, chili, and fragrant spices.', 25000, false, true, false),
('20000000-0000-0000-0000-000000000035', '10000000-0000-0000-0000-000000000008', 'Mie Godok Kaca Putih', 'mie-godok-kaca-putih', 'Noodle with our flavoury soup, vegetables, eggs and chicken.', 23000, false, true, false),
('20000000-0000-0000-0000-000000000036', '10000000-0000-0000-0000-000000000008', 'Mie Goreng Spesial Kaca Putih', 'mie-goreng-spesial-kaca-putih', 'Indonesian-style stir-fried noodles with a special mix of vegetables, chicken, and egg. Savory, satisfying, and full of flavor.', 23000, false, true, false),
('20000000-0000-0000-0000-000000000037', '10000000-0000-0000-0000-000000000008', 'Ricebowl Tuna Sambal Matah', 'ricebowl-tuna-sambal-matah', 'Ricebowl with spicy tuna, egg, vegetables and our homemade sambal matah.', 28000, false, true, false),
('20000000-0000-0000-0000-000000000038', '10000000-0000-0000-0000-000000000008', 'Ricebowl Ayam Manis', 'ricebowl-ayam-manis', 'Ricebowl with sweet sauce chicken, scrambled egg and vegetables.', 28000, false, true, false),
('20000000-0000-0000-0000-000000000039', '10000000-0000-0000-0000-000000000008', 'Fettucine Carbonara', 'fettucine-carbonara', 'Creamy pasta made with fettuccine noodles, smoky beef, and cheese in a classic carbonara sauce.', 30000, false, true, false),
('20000000-0000-0000-0000-000000000040', '10000000-0000-0000-0000-000000000008', 'Vegetables Omelette', 'vegetables-omelette', 'Vegetables omelette with french fries.', 24000, false, true, false),
('20000000-0000-0000-0000-000000000041', '10000000-0000-0000-0000-000000000008', 'Masitta Hot Korean Chicken Wings', 'masitta-hot-korean-chicken-wings', 'Crispy juicy chicken wings glazed with authentic fiery Korean Masitta sauce.', 30000, true, true, false);

-- Category 9: Snacks
INSERT INTO public.products (id, category_id, name, slug, description, base_price, is_signature, is_available, is_daily_bakery) VALUES
('20000000-0000-0000-0000-000000000042', '10000000-0000-0000-0000-000000000009', 'French Fries', 'french-fries', 'Classic fried fries with pepper and salt.', 21000, false, true, false),
('20000000-0000-0000-0000-000000000043', '10000000-0000-0000-0000-000000000009', 'Mix Platter', 'mix-platter', 'Have a delicious snack with fries, nuggets, chicken tenders strip and onion rings!', 28000, false, true, false),
('20000000-0000-0000-0000-000000000044', '10000000-0000-0000-0000-000000000009', 'Tahu Cabe Garam', 'tahu-cabe-garam', 'Delicious fried tofu with chili and salt.', 20000, false, true, false),
('20000000-0000-0000-0000-000000000045', '10000000-0000-0000-0000-000000000009', 'Quesadilla', 'quesadilla', 'A mexican snacks made with tortilla, grilled chicken, capsicum, and mozarella.', 26000, false, true, false),
('20000000-0000-0000-0000-000000000046', '10000000-0000-0000-0000-000000000009', 'Enoki Fries', 'enoki-fries', 'Fried enoki with barbeque/balado flavor.', 20000, false, true, false),
('20000000-0000-0000-0000-000000000047', '10000000-0000-0000-0000-000000000009', 'Roti Bakar', 'roti-bakar', 'Crispy grilled bread filled with melted chocolate/shredded cheese.', 18000, false, true, false),
('20000000-0000-0000-0000-000000000048', '10000000-0000-0000-0000-000000000009', 'Donat', 'donat', 'Fried Donut coated with delicious icing sugar/brown sugar.', 18000, false, true, false);

-- Variants for Snacks
INSERT INTO public.product_variants (product_id, name, price_delta) VALUES
('20000000-0000-0000-0000-000000000046', 'Barbeque', 0),
('20000000-0000-0000-0000-000000000046', 'Balado', 0),
('20000000-0000-0000-0000-000000000047', 'Melted Chocolate', 0),
('20000000-0000-0000-0000-000000000047', 'Shredded Cheese', 0),
('20000000-0000-0000-0000-000000000048', 'Icing Sugar', 0),
('20000000-0000-0000-0000-000000000048', 'Brown Sugar', 0);

-- Category 10: Daily Bakery
INSERT INTO public.products (id, category_id, name, slug, description, base_price, is_signature, is_available, is_daily_bakery) VALUES
('20000000-0000-0000-0000-000000000049', '10000000-0000-0000-0000-000000000010', 'Japanese Salt Bread (Shio Pan)', 'salt-bread', 'Freshly baked artisanal shio pan with crisp bottom crust and buttery fluffy core.', 18000, true, true, true),
('20000000-0000-0000-0000-000000000050', '10000000-0000-0000-0000-000000000010', 'Cinnamon Roll', 'cinnamon-roll', 'Freshly baked spiral roll infused with aromatic cinnamon sugar and silky glaze.', 22000, false, true, true);

-- Variants for Daily Bakery
INSERT INTO public.product_variants (product_id, name, price_delta) VALUES
('20000000-0000-0000-0000-000000000049', 'Original Butter', 0),
('20000000-0000-0000-0000-000000000049', 'Chocolate', 0),
('20000000-0000-0000-0000-000000000049', 'Garlic Butter', 2000),
('20000000-0000-0000-0000-000000000049', 'Sausage Savory', 3000),
('20000000-0000-0000-0000-000000000049', 'Smoked Beef Mozarella', 4000),
('20000000-0000-0000-0000-000000000050', 'Classic Glaze', 0),
('20000000-0000-0000-0000-000000000050', 'Cream Cheese Frosting', 3000);

-- Category 11: Add-Ons
INSERT INTO public.products (id, category_id, name, slug, description, base_price, is_signature, is_available, is_daily_bakery) VALUES
('20000000-0000-0000-0000-000000000051', '10000000-0000-0000-0000-000000000011', 'Extra Espresso Shot', 'extra-shot', 'Additional single extraction espresso shot.', 8000, false, true, false);

-- 4. SAMPLE PRODUCTION / BENCHMARK ORDERS
INSERT INTO public.orders (id, code, order_type, table_number, customer_name, customer_phone, notes, status, payment_method, total_amount, is_demo, created_at)
VALUES 
('30000000-0000-0000-0000-000000000001', '#KP-1001', 'dine_in', 4, 'Budi Santoso', '+6281234567890', 'Less ice on Mont Blanc', 'completed', 'qris', 59000, false, now() - INTERVAL '2 hours'),
('30000000-0000-0000-0000-000000000002', '#KP-1002', 'takeaway', NULL, 'Siti Rahma', '+6285712345678', 'Pack bakery separately', 'preparing', 'cash', 40000, false, now() - INTERVAL '20 minutes'),
('30000000-0000-0000-0000-000000000003', '#KP-DEMO-99', 'dine_in', 12, 'Portfolio Reviewer', '+6289999999999', 'Demo test order', 'new', 'qris', 54000, true, now() - INTERVAL '5 minutes');

-- Order Items for Sample Orders
INSERT INTO public.order_items (order_id, product_id, variant_id, quantity, unit_price, notes) VALUES
-- Order 1: Mont Blanc (30k) + Nasi Goreng Rendang (29k) = 59k
('30000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', NULL, 1, 30000, 'Less ice'),
('30000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000031', NULL, 1, 29000, 'Medium spicy'),

-- Order 2: Salt Bread Smoked Beef Moza (22k) + Donat Icing Sugar (18k) = 40k
('30000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000049', (SELECT id FROM public.product_variants WHERE product_id = '20000000-0000-0000-0000-000000000049' AND name = 'Smoked Beef Mozarella'), 1, 22000, NULL),
('30000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000048', (SELECT id FROM public.product_variants WHERE product_id = '20000000-0000-0000-0000-000000000048' AND name = 'Icing Sugar'), 1, 18000, NULL),

-- Order 3 (Demo): Dirty Latte (32k) + Cinnamon Roll Classic (22k) = 54k
('30000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000002', NULL, 1, 32000, NULL),
('30000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000050', (SELECT id FROM public.product_variants WHERE product_id = '20000000-0000-0000-0000-000000000050' AND name = 'Classic Glaze'), 1, 22000, NULL);
