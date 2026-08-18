-- ====================================================================
-- ANTI GRAVITY CAR RENTAL & CAR WASHING SEED DATA
-- ====================================================================

-- 1. BUSINESS SETTINGS
INSERT INTO business_settings (
  business_name, tagline, phone_number, whatsapp_number, email, address, currency, tax_rate, opening_time, closing_time, slot_duration_minutes, max_wash_bookings_per_slot
) VALUES (
  'Anti Gravity',
  'Drive Better. Travel Further. Stay Spotless.',
  '+91 9363115217',
  '+919363115217',
  'contact@antigravitycars.com',
  '100 Anti Gravity Way, Suite 500, New York, NY 10001',
  'USD',
  8.50,
  '08:00:00',
  '20:00:00',
  60,
  3
) ON CONFLICT DO NOTHING;

-- 2. ADMIN USER (Username/Email: HARI / hari@antigravity.com, Password: Hari@2005)
INSERT INTO admin_users (
  email, password_hash, full_name, role
) VALUES (
  'hari@antigravity.com',
  '$2a$10$v9cgbb2T8Hse/PAwO41r9.Bzx9Gt/bA1z42R/m/Oz0nVBp2WvcWA2', -- bcrypt hash of Hari@2005
  'HARI',
  'admin'
) ON CONFLICT (email) DO NOTHING;

-- 3. CAR RENTAL FLEET SEED DATA
INSERT INTO cars (id, name, brand, model, year, registration_number, fuel_type, transmission, seating_capacity, price_per_day, price_per_hour, description, features, status)
VALUES 
(
  'c1111111-1111-1111-1111-111111111111',
  'Porsche 911 Carrera S',
  'Porsche',
  '911 Carrera S',
  2024,
  'AG-P911-24',
  'Petrol',
  'Automatic',
  4,
  450.00,
  55.00,
  'Experience pure automotive perfection with the Porsche 911 Carrera S. Featuring twin-turbocharged flat-six power, razor-sharp handling, dynamic adaptive suspension, and a cockpit tailored for ultimate thrill.',
  ARRAY['Sport Chrono Package', 'Bose Surround Sound', 'Adaptive Cruise Control', 'Ventilated Leather Seats', 'Launch Control', 'Apple CarPlay & Android Auto'],
  'Available'
),
(
  'c2222222-2222-2222-2222-222222222222',
  'Mercedes-AMG G 63',
  'Mercedes-Benz',
  'AMG G 63',
  2024,
  'AG-G63-AMG',
  'Petrol',
  'Automatic',
  5,
  650.00,
  75.00,
  'Command the road with the iconic Mercedes-AMG G 63. Hand-crafted V8 biturbo power meets unparalleled luxury, futuristic dual displays, diamond-stitched Nappa leather, and unmistakable presence.',
  ARRAY['Handcrafted AMG V8', 'Burmester 3D Surround', 'Massaging Seats', '360 Camera', 'Active Multicontour Seats', 'Panoramadach'],
  'Available'
),
(
  'c3333333-3333-3333-3333-333333333333',
  'Tesla Model S Plaid',
  'Tesla',
  'Model S Plaid',
  2024,
  'AG-TSLA-EV',
  'Electric',
  'Automatic',
  5,
  380.00,
  45.00,
  'Hypercar acceleration in a silent luxury sedan. 1,020 hp tri-motor electric powertrain propels you from 0 to 60 mph in 1.99 seconds with Full Self-Driving capability and 390 miles range.',
  ARRAY['Tri-Motor All-Wheel Drive', 'Yoke Steering', 'Full Self-Driving', 'Gaming Computer (10 teraflops)', '22-Speaker Audio', 'Wireless Phone Charging'],
  'Available'
),
(
  'c4444444-4444-4444-4444-444444444444',
  'BMW M5 Competition',
  'BMW',
  'M5 Competition',
  2023,
  'AG-BMWM5-01',
  'Petrol',
  'Automatic',
  5,
  320.00,
  40.00,
  'The quintessential high-performance sports sedan. 617 horsepower M TwinPower Turbo V8 engine combined with M xDrive intelligent all-wheel drive for blistering speed and luxury.',
  ARRAY['M Dynamic Mode', 'Harman Kardon Audio', 'Carbon Fiber Roof', 'Head-Up Display', 'Wireless Charging', 'M Carbon Ceramic Brakes'],
  'Available'
),
(
  'c5555555-5555-5555-5555-555555555555',
  'Range Rover Autobiography',
  'Land Rover',
  'Range Rover Autobiography',
  2024,
  'AG-RR-AUTO',
  'Hybrid',
  'Automatic',
  5,
  490.00,
  60.00,
  'Unmatched refinement and all-terrain capability. Executive Class rear seating, active noise cancellation, Meridian Signature Sound System, and whisper-quiet hybrid technology.',
  ARRAY['Executive Rear Seating', 'Meridian Signature Sound', 'All-Wheel Steering', 'Air Suspension', 'Soft Door Close', 'Cooler Compartment'],
  'Available'
),
(
  'c6666666-6666-6666-6666-666666666666',
  'Audi RS e-tron GT',
  'Audi',
  'RS e-tron GT',
  2024,
  'AG-AUDI-RS',
  'Electric',
  'Automatic',
  4,
  350.00,
  42.00,
  'Breathtaking electric gran turismo performance. Dual synchronous motors produce 637 hp in boost mode with quattro all-wheel drive and head-turning aerodynamic design.',
  ARRAY['800V Architecture', 'Bang & Olufsen 3D Sound', 'All-Wheel Steering', 'Matrix LED Headlights', 'Panoramic Glass Roof', 'Audi Virtual Cockpit Plus'],
  'Maintenance'
) ON CONFLICT (id) DO NOTHING;

-- 4. CAR IMAGES SEED DATA
INSERT INTO car_images (car_id, image_url, is_primary, display_order) VALUES
('c1111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1200&q=80', true, 1),
('c1111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80', false, 2),
('c2222222-2222-2222-2222-222222222222', 'https://images.unsplash.com/photo-1520031441872-265e4ff70366?auto=format&fit=crop&w=1200&q=80', true, 1),
('c2222222-2222-2222-2222-222222222222', 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80', false, 2),
('c3333333-3333-3333-3333-333333333333', 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1200&q=80', true, 1),
('c3333333-3333-3333-3333-333333333333', 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=1200&q=80', false, 2),
('c4444444-4444-4444-4444-444444444444', 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80', true, 1),
('c5555555-5555-5555-5555-555555555555', 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1200&q=80', true, 1),
('c6666666-6666-6666-6666-666666666666', 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80', true, 1);

-- 5. CAR WASH SERVICES SEED DATA
INSERT INTO wash_services (id, name, description, price, duration_minutes, image_url, category, is_active) VALUES
(
  'd1111111-1111-1111-1111-111111111111',
  'Express Touchless Wash',
  'Fast eco-friendly exterior foam wash, high-pressure rinse, tire shine, and spot-free air drying.',
  35.00,
  30,
  'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&w=800&q=80',
  'Basic Washing',
  true
),
(
  'd2222222-2222-2222-2222-222222222222',
  'Anti Gravity Signature Wash & Polish',
  'Hand snow foam bath, wheel & brake dust removal, clay bar paint decontamination, interior vacuuming, micro-fiber hand dry, and synthetic wax sealant.',
  85.00,
  60,
  'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?auto=format&fit=crop&w=800&q=80',
  'Premium Washing',
  true
),
(
  'd3333333-3333-3333-3333-333333333333',
  'Deep Interior Spa Detailing',
  'Deep steam extraction for seats & carpet, leather conditioning, dashboard UV protection, door jamb cleaning, air vent sanitation, and odor elimination.',
  140.00,
  90,
  'https://images.unsplash.com/photo-1507136566006-cfc505b114fc?auto=format&fit=crop&w=800&q=80',
  'Detailing',
  true
),
(
  'd4444444-4444-4444-4444-444444444444',
  '9H Nano Ceramic Coating Package',
  'Multi-stage paint correction to remove swirl marks & scratches, followed by professional 9H hydrophobic ceramic coating application for 3-year paint protection.',
  499.00,
  240,
  'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=800&q=80',
  'Ceramic & Polish',
  true
),
(
  'd5555555-5555-5555-5555-555555555555',
  'Engine Bay Detailing & Dressing',
  'Safe steam wash of engine bay compartment, degreasing, hydrophobic sealant, and plastic element restoration.',
  65.00,
  45,
  'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=800&q=80',
  'Add-on Services',
  true
) ON CONFLICT (id) DO NOTHING;

-- 6. DEMO BOOKINGS
INSERT INTO bookings (id, booking_number, booking_type, customer_name, customer_phone, customer_email, customer_address, status, subtotal, tax_amount, discount_amount, total_amount, additional_notes)
VALUES 
(
  'b1111111-1111-1111-1111-111111111111',
  'AG-2026-00001',
  'Rental',
  'Alexander Wright',
  '+1 (555) 234-5678',
  'alex.wright@example.com',
  '450 Park Avenue, NY 10022',
  'Confirmed',
  900.00,
  76.50,
  0.00,
  976.50,
  'Airport pickup requested at JFK Terminal 4.'
),
(
  'b2222222-2222-2222-2222-222222222222',
  'AG-2026-00002',
  'Wash',
  'Sophia Martinez',
  '+1 (555) 876-5432',
  'sophia.m@example.com',
  '780 5th Ave, NY 10019',
  'Pending',
  85.00,
  7.23,
  0.00,
  92.23,
  'Please focus on front bumper bug removal.'
) ON CONFLICT (id) DO NOTHING;

-- 7. DEMO BOOKING ITEMS
INSERT INTO booking_items (booking_id, item_type, car_id, pickup_date, pickup_time, return_date, return_time, rental_days, rental_price_per_day, item_total)
VALUES (
  'b1111111-1111-1111-1111-111111111111',
  'Rental',
  'c1111111-1111-1111-1111-111111111111',
  '2026-08-20',
  '10:00:00',
  '2026-08-22',
  '10:00:00',
  2,
  450.00,
  900.00
) ON CONFLICT (id) DO NOTHING;

INSERT INTO booking_items (booking_id, item_type, service_id, vehicle_type, vehicle_registration, wash_date, wash_time_slot, service_price, item_total)
VALUES (
  'b2222222-2222-2222-2222-222222222222',
  'Wash',
  'd2222222-2222-2222-2222-222222222222',
  'SUV',
  'NY-SPH-88',
  '2026-08-18',
  '14:00:00',
  85.00,
  85.00
) ON CONFLICT (id) DO NOTHING;
