# Supabase Setup Guide for Anti Gravity

Follow these instructions to set up Supabase for the Anti Gravity Car Rental & Car Washing application.

---

## 1. Create Supabase Project
1. Log in to [Supabase Console](https://app.supabase.com/).
2. Click **New Project** and select your organization.
3. Enter Project Name: `anti-gravity-app`.
4. Generate a strong Database Password and select a region close to your users.

---

## 2. Execute Database Schema & Seed Data
1. Navigate to the **SQL Editor** in your Supabase Dashboard.
2. Open `database/schema.sql` from this codebase, copy its contents, and run it in the SQL Editor.
3. Open `database/seed.sql`, copy its contents, and execute it to populate initial cars, car wash packages, business settings, and demo admin account (`admin@antigravity.com` / `Admin@123456`).

---

## 3. Create Storage Buckets
Navigate to **Storage** in the Supabase Dashboard and create three public storage buckets:
1. `cars` - Public (for vehicle rental photos)
2. `services` - Public (for car detailing & washing package photos)
3. `business` - Public (for company logos and branding assets)

Make sure to set public access permissions or configure a storage policy permitting read access to `anon` and write access to `authenticated` users.

---

## 4. Get API Keys
Navigate to **Project Settings** -> **API**:
- Copy **Project URL** -> `SUPABASE_URL`
- Copy **anon / public key** -> `SUPABASE_ANON_KEY`
- Copy **service_role secret** -> `SUPABASE_SERVICE_ROLE_KEY` (Keep secure on server-side only!)

Add these credentials to your `.env` file in both `server/.env` and `client/.env`.
