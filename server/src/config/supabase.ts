import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { Car, WashService, Booking, BusinessSettings, AdminUser } from '../types/index.js';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = 
  process.env.SUPABASE_SECRET_KEY || 
  process.env.SUPABASE_SERVICE_ROLE_KEY || 
  process.env.SUPABASE_PUBLISHABLE_KEY || 
  process.env.SUPABASE_ANON_KEY || 
  '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseKey && 
  !supabaseUrl.includes('your-supabase-project-id')
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseKey)
  : null;

// ====================================================================
// IN-MEMORY / HYBRID DATA STORE (FALLBACK FOR LOCAL RUNTIME TESTING)
// ====================================================================

export const memoryStore = {
  businessSettings: {
    id: 'b0000000-0000-0000-0000-000000000000',
    business_name: 'Anti Gravity',
    tagline: 'Drive Better. Travel Further. Stay Spotless.',
    phone_number: '+91 9363115217',
    whatsapp_number: '+919363115217',
    email: 'contact@antigravitycars.com',
    address: '100 Anti Gravity Way, Suite 500, New York, NY 10001',
    currency: 'USD',
    tax_rate: 8.50,
    opening_time: '08:00',
    closing_time: '20:00',
    slot_duration_minutes: 60,
    max_wash_bookings_per_slot: 3,
  } as BusinessSettings,

  adminUsers: [
    {
      id: 'a1111111-1111-1111-1111-111111111111',
      email: '23ec034@drngpit.ac.in',
      // bcrypt hash for Hari@2005
      password_hash: '$2a$10$v9cgbb2T8Hse/PAwO41r9.Bzx9Gt/bA1z42R/m/Oz0nVBp2WvcWA2',
      full_name: 'HARI',
      role: 'admin',
    }
  ] as (AdminUser & { password_hash: string })[],

  cars: [
    {
      id: 'c1111111-1111-1111-1111-111111111111',
      name: 'Porsche 911 Carrera S',
      brand: 'Porsche',
      model: '911 Carrera S',
      year: 2024,
      registration_number: 'AG-P911-24',
      fuel_type: 'Petrol',
      transmission: 'Automatic',
      seating_capacity: 4,
      price_per_day: 450.00,
      price_per_hour: 55.00,
      description: 'Experience pure automotive perfection with the Porsche 911 Carrera S. Twin-turbocharged flat-six power, razor-sharp handling, dynamic adaptive suspension, and a cockpit tailored for ultimate thrill.',
      features: ['Sport Chrono Package', 'Bose Surround Sound', 'Adaptive Cruise Control', 'Ventilated Leather Seats', 'Launch Control', 'Apple CarPlay & Android Auto'],
      status: 'Available',
      images: [
        { id: 'img-1', car_id: 'c1111111-1111-1111-1111-111111111111', image_url: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1200&q=80', is_primary: true },
        { id: 'img-2', car_id: 'c1111111-1111-1111-1111-111111111111', image_url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80', is_primary: false }
      ]
    },
    {
      id: 'c2222222-2222-2222-2222-222222222222',
      name: 'Mercedes-AMG G 63',
      brand: 'Mercedes-Benz',
      model: 'AMG G 63',
      year: 2024,
      registration_number: 'AG-G63-AMG',
      fuel_type: 'Petrol',
      transmission: 'Automatic',
      seating_capacity: 5,
      price_per_day: 650.00,
      price_per_hour: 75.00,
      description: 'Command the road with the iconic Mercedes-AMG G 63. Hand-crafted V8 biturbo power meets unparalleled luxury, futuristic dual displays, diamond-stitched Nappa leather, and unmistakable presence.',
      features: ['Handcrafted AMG V8', 'Burmester 3D Surround', 'Massaging Seats', '360 Camera', 'Active Multicontour Seats', 'Panoramadach'],
      status: 'Available',
      images: [
        { id: 'img-3', car_id: 'c2222222-2222-2222-2222-222222222222', image_url: 'https://images.unsplash.com/photo-1520031441872-265e4ff70366?auto=format&fit=crop&w=1200&q=80', is_primary: true },
        { id: 'img-4', car_id: 'c2222222-2222-2222-2222-222222222222', image_url: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80', is_primary: false }
      ]
    },
    {
      id: 'c3333333-3333-3333-3333-333333333333',
      name: 'Tesla Model S Plaid',
      brand: 'Tesla',
      model: 'Model S Plaid',
      year: 2024,
      registration_number: 'AG-TSLA-EV',
      fuel_type: 'Electric',
      transmission: 'Automatic',
      seating_capacity: 5,
      price_per_day: 380.00,
      price_per_hour: 45.00,
      description: 'Hypercar acceleration in a silent luxury sedan. 1,020 hp tri-motor electric powertrain propels you from 0 to 60 mph in 1.99 seconds with Full Self-Driving capability and 390 miles range.',
      features: ['Tri-Motor All-Wheel Drive', 'Yoke Steering', 'Full Self-Driving', 'Gaming Computer (10 teraflops)', '22-Speaker Audio', 'Wireless Phone Charging'],
      status: 'Available',
      images: [
        { id: 'img-5', car_id: 'c3333333-3333-3333-3333-333333333333', image_url: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1200&q=80', is_primary: true },
        { id: 'img-6', car_id: 'c3333333-3333-3333-3333-333333333333', image_url: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=1200&q=80', is_primary: false }
      ]
    },
    {
      id: 'c4444444-4444-4444-4444-444444444444',
      name: 'BMW M5 Competition',
      brand: 'BMW',
      model: 'M5 Competition',
      year: 2023,
      registration_number: 'AG-BMWM5-01',
      fuel_type: 'Petrol',
      transmission: 'Automatic',
      seating_capacity: 5,
      price_per_day: 320.00,
      price_per_hour: 40.00,
      description: 'The quintessential high-performance sports sedan. 617 horsepower M TwinPower Turbo V8 engine combined with M xDrive intelligent all-wheel drive for blistering speed and luxury.',
      features: ['M Dynamic Mode', 'Harman Kardon Audio', 'Carbon Fiber Roof', 'Head-Up Display', 'Wireless Charging', 'M Carbon Ceramic Brakes'],
      status: 'Available',
      images: [
        { id: 'img-7', car_id: 'c4444444-4444-4444-4444-444444444444', image_url: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80', is_primary: true }
      ]
    },
    {
      id: 'c5555555-5555-5555-5555-555555555555',
      name: 'Range Rover Autobiography',
      brand: 'Land Rover',
      model: 'Range Rover Autobiography',
      year: 2024,
      registration_number: 'AG-RR-AUTO',
      fuel_type: 'Hybrid',
      transmission: 'Automatic',
      seating_capacity: 5,
      price_per_day: 490.00,
      price_per_hour: 60.00,
      description: 'Unmatched refinement and all-terrain capability. Executive Class rear seating, active noise cancellation, Meridian Signature Sound System, and whisper-quiet hybrid technology.',
      features: ['Executive Rear Seating', 'Meridian Signature Sound', 'All-Wheel Steering', 'Air Suspension', 'Soft Door Close', 'Cooler Compartment'],
      status: 'Available',
      images: [
        { id: 'img-8', car_id: 'c5555555-5555-5555-5555-555555555555', image_url: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1200&q=80', is_primary: true }
      ]
    },
    {
      id: 'c6666666-6666-6666-6666-666666666666',
      name: 'Audi RS e-tron GT',
      brand: 'Audi',
      model: 'RS e-tron GT',
      year: 2024,
      registration_number: 'AG-AUDI-RS',
      fuel_type: 'Electric',
      transmission: 'Automatic',
      seating_capacity: 4,
      price_per_day: 350.00,
      price_per_hour: 42.00,
      description: 'Breathtaking electric gran turismo performance. Dual synchronous motors produce 637 hp in boost mode with quattro all-wheel drive and head-turning aerodynamic design.',
      features: ['800V Architecture', 'Bang & Olufsen 3D Sound', 'All-Wheel Steering', 'Matrix LED Headlights', 'Panoramic Glass Roof', 'Audi Virtual Cockpit Plus'],
      status: 'Maintenance',
      images: [
        { id: 'img-9', car_id: 'c6666666-6666-6666-6666-666666666666', image_url: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80', is_primary: true }
      ]
    }
  ] as Car[],

  washServices: [
    {
      id: 'd1111111-1111-1111-1111-111111111111',
      name: 'Express Touchless Wash',
      description: 'Fast eco-friendly exterior foam wash, high-pressure rinse, tire shine, and spot-free air drying.',
      price: 35.00,
      duration_minutes: 30,
      image_url: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&w=800&q=80',
      category: 'Basic Washing',
      is_active: true
    },
    {
      id: 'd2222222-2222-2222-2222-222222222222',
      name: 'Anti Gravity Signature Wash & Polish',
      description: 'Hand snow foam bath, wheel & brake dust removal, clay bar paint decontamination, interior vacuuming, micro-fiber hand dry, and synthetic wax sealant.',
      price: 85.00,
      duration_minutes: 60,
      image_url: 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?auto=format&fit=crop&w=800&q=80',
      category: 'Premium Washing',
      is_active: true
    },
    {
      id: 'd3333333-3333-3333-3333-333333333333',
      name: 'Deep Interior Spa Detailing',
      description: 'Deep steam extraction for seats & carpet, leather conditioning, dashboard UV protection, door jamb cleaning, air vent sanitation, and odor elimination.',
      price: 140.00,
      duration_minutes: 90,
      image_url: 'https://images.unsplash.com/photo-1507136566006-cfc505b114fc?auto=format&fit=crop&w=800&q=80',
      category: 'Detailing',
      is_active: true
    },
    {
      id: 'd4444444-4444-4444-4444-444444444444',
      name: '9H Nano Ceramic Coating Package',
      description: 'Multi-stage paint correction to remove swirl marks & scratches, followed by professional 9H hydrophobic ceramic coating application for 3-year paint protection.',
      price: 499.00,
      duration_minutes: 240,
      image_url: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=800&q=80',
      category: 'Ceramic & Polish',
      is_active: true
    },
    {
      id: 'd5555555-5555-5555-5555-555555555555',
      name: 'Engine Bay Detailing & Dressing',
      description: 'Safe steam wash of engine bay compartment, degreasing, hydrophobic sealant, and plastic element restoration.',
      price: 65.00,
      duration_minutes: 45,
      image_url: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=800&q=80',
      category: 'Add-on Services',
      is_active: true
    }
  ] as WashService[],

  bookings: [
    {
      id: 'b1111111-1111-1111-1111-111111111111',
      booking_number: 'AG-2026-00001',
      booking_type: 'Rental',
      customer_name: 'Alexander Wright',
      customer_phone: '+1 (555) 234-5678',
      customer_email: 'alex.wright@example.com',
      customer_address: '450 Park Avenue, NY 10022',
      status: 'Confirmed',
      subtotal: 900.00,
      tax_amount: 76.50,
      discount_amount: 0.00,
      total_amount: 976.50,
      additional_notes: 'Airport pickup requested at JFK Terminal 4.',
      created_at: new Date().toISOString(),
      rental_item: {
        car_id: 'c1111111-1111-1111-1111-111111111111',
        pickup_date: '2026-08-20',
        pickup_time: '10:00',
        return_date: '2026-08-22',
        return_time: '10:00',
        rental_days: 2,
        rental_price_per_day: 450.00,
        item_total: 900.00,
      }
    },
    {
      id: 'b2222222-2222-2222-2222-222222222222',
      booking_number: 'AG-2026-00002',
      booking_type: 'Wash',
      customer_name: 'Sophia Martinez',
      customer_phone: '+1 (555) 876-5432',
      customer_email: 'sophia.m@example.com',
      customer_address: '780 5th Ave, NY 10019',
      status: 'Pending',
      subtotal: 85.00,
      tax_amount: 7.23,
      discount_amount: 0.00,
      total_amount: 92.23,
      additional_notes: 'Please focus on front bumper bug removal.',
      created_at: new Date().toISOString(),
      wash_item: {
        service_id: 'd2222222-2222-2222-2222-222222222222',
        vehicle_type: 'SUV',
        vehicle_registration: 'NY-SPH-88',
        wash_date: '2026-08-18',
        wash_time_slot: '14:00',
        service_price: 85.00,
        item_total: 85.00
      }
    }
  ] as Booking[]
};
