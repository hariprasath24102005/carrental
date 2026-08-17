-- ====================================================================
-- ANTI GRAVITY CAR RENTAL & CAR WASHING DATABASE SCHEMA
-- PostgreSQL / Supabase Schema
-- ====================================================================

-- Enable UUID extension if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. BUSINESS SETTINGS TABLE
CREATE TABLE IF NOT EXISTS business_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_name VARCHAR(255) NOT NULL DEFAULT 'Anti Gravity',
  tagline VARCHAR(255) DEFAULT 'Drive Better. Travel Further. Stay Spotless.',
  phone_number VARCHAR(50) DEFAULT '+1 (800) 555-4728',
  whatsapp_number VARCHAR(50) DEFAULT '+1 (800) 555-4728',
  email VARCHAR(255) DEFAULT 'contact@antigravitycars.com',
  address TEXT DEFAULT '100 Gravity Blvd, Suite 500, Metro City, NY 10001',
  currency VARCHAR(10) DEFAULT 'USD',
  tax_rate DECIMAL(5, 2) DEFAULT 8.50,
  opening_time TIME DEFAULT '08:00:00',
  closing_time TIME DEFAULT '20:00:00',
  slot_duration_minutes INT DEFAULT 60,
  max_wash_bookings_per_slot INT DEFAULT 3,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. ADMIN USERS TABLE
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. CARS TABLE (RENTAL INVENTORY)
CREATE TABLE IF NOT EXISTS cars (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  brand VARCHAR(100) NOT NULL,
  model VARCHAR(100) NOT NULL,
  year INT NOT NULL,
  registration_number VARCHAR(50) UNIQUE NOT NULL,
  fuel_type VARCHAR(50) NOT NULL CHECK (fuel_type IN ('Petrol', 'Diesel', 'Electric', 'Hybrid')),
  transmission VARCHAR(50) NOT NULL CHECK (transmission IN ('Automatic', 'Manual')),
  seating_capacity INT NOT NULL,
  price_per_day DECIMAL(10, 2) NOT NULL,
  price_per_hour DECIMAL(10, 2),
  description TEXT,
  features TEXT[] DEFAULT '{}',
  status VARCHAR(50) NOT NULL DEFAULT 'Available' CHECK (status IN ('Available', 'Booked', 'Maintenance', 'Temporarily Unavailable')),
  maintenance_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. CAR IMAGES TABLE
CREATE TABLE IF NOT EXISTS car_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  car_id UUID NOT NULL REFERENCES cars(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT FALSE,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. WASH SERVICES TABLE
CREATE TABLE IF NOT EXISTS wash_services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  duration_minutes INT NOT NULL DEFAULT 45,
  image_url TEXT,
  category VARCHAR(100) NOT NULL DEFAULT 'Washing' CHECK (category IN ('Basic Washing', 'Premium Washing', 'Detailing', 'Ceramic & Polish', 'Add-on Services')),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. UNIFIED BOOKINGS TABLE
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_number VARCHAR(50) UNIQUE NOT NULL, -- e.g. AG-2026-00001
  booking_type VARCHAR(50) NOT NULL CHECK (booking_type IN ('Rental', 'Wash', 'Both')),
  customer_name VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(50) NOT NULL,
  customer_email VARCHAR(255),
  customer_address TEXT,
  status VARCHAR(50) NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Confirmed', 'In Progress', 'Completed', 'Cancelled')),
  subtotal DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  tax_amount DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  discount_amount DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  total_amount DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  additional_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. BOOKING ITEMS TABLE (LINE ITEMS FOR RENTAL AND/OR WASH)
CREATE TABLE IF NOT EXISTS booking_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  item_type VARCHAR(50) NOT NULL CHECK (item_type IN ('Rental', 'Wash')),
  
  -- Fields for Rental Item
  car_id UUID REFERENCES cars(id) ON DELETE SET NULL,
  pickup_date DATE,
  pickup_time TIME,
  return_date DATE,
  return_time TIME,
  rental_days INT,
  rental_price_per_day DECIMAL(10, 2),
  
  -- Fields for Wash Item
  service_id UUID REFERENCES wash_services(id) ON DELETE SET NULL,
  vehicle_type VARCHAR(100),
  vehicle_registration VARCHAR(50),
  wash_date DATE,
  wash_time_slot TIME,
  service_price DECIMAL(10, 2),
  
  item_total DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. TIME SLOTS / BLOCKED DATES TABLE
CREATE TABLE IF NOT EXISTS time_slots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slot_date DATE NOT NULL,
  slot_time TIME NOT NULL,
  max_capacity INT NOT NULL DEFAULT 3,
  booked_count INT NOT NULL DEFAULT 0,
  is_blocked BOOLEAN DEFAULT FALSE,
  notes VARCHAR(255),
  UNIQUE(slot_date, slot_time)
);

-- INDEXES FOR FAST SEARCHING AND OVERLAP CHECKS
CREATE INDEX IF NOT EXISTS idx_cars_status ON cars(status);
CREATE INDEX IF NOT EXISTS idx_cars_brand ON cars(brand);
CREATE INDEX IF NOT EXISTS idx_bookings_number ON bookings(booking_number);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_booking_items_rental ON booking_items(car_id, pickup_date, return_date);
CREATE INDEX IF NOT EXISTS idx_booking_items_wash ON booking_items(service_id, wash_date, wash_time_slot);
