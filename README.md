# Anti Gravity - Complete Full-Stack Car Rental & Car Washing Platform

**Anti Gravity** is a production-ready, full-stack web application designed for luxury car rentals and high-end automotive washing & detailing services. 

Featuring a React + Vite + TypeScript + Tailwind CSS frontend, a Node.js + Express + TypeScript REST API backend, Supabase / PostgreSQL database, authentication, admin management panel, unified booking engine, automated PDF receipts, and SMS/WhatsApp notifications.

---

## 🌟 Key Features

### Public Website & Customer Experience
- **Luxury Automotive Aesthetics**: Obsidian dark mode UI with carbon fiber panels, glassmorphic cards, neon cyan/gold accents, and micro-interactions.
- **Home Landing Page**: Hero section with concept tagline *"Drive Better. Travel Further. Stay Spotless."*, service overview cards, featured fleet slider, and customer guarantees.
- **Car Rental Fleet Catalog**: Full inventory grid with brand, fuel type, transmission, seating capacity, price per day/hour, and real-time search & filters.
- **Car Specifications & Image Carousel**: Multi-photo responsive carousel with fullscreen viewer, specifications matrix, and feature checklists.
- **Car Washing & Detailing Catalog**: Categorized detailing packages (Basic Wash, Premium Polish, Interior Steam Extraction, 9H Ceramic Coating, Engine Bay Detailing).
- **Unified Booking Engine**: Book a Car Rental, a Car Wash, or **Both** (with an automatic 5% bundle discount). Supports real-time price calculations, double-booking prevention, and instant booking ID generation (`AG-2026-XXXXX`).
- **Booking Confirmation & PDF Receipts**: Confetti celebration, detailed itemized summary, and instant browser **PDF Receipt download** powered by jsPDF.
- **Information & Legal Pages**: About Us, Contact Us with interactive map mockup & direct WhatsApp button, Terms & Conditions, and Privacy Policy.

### Admin Dashboard & Management Console
- **Admin Authentication**: Protected routes with JWT session security (`admin@antigravity.com` / `Admin@123456`).
- **Executive KPI Dashboard**: Real-time metrics for total revenue ($), total bookings, pending/confirmed/completed counts, fleet availability, maintenance statuses, and today's wash appointments.
- **Car Fleet Inventory Manager**: Add new cars, upload image URLs, edit specifications, update rental rates, or mark vehicles under maintenance.
- **Car Wash Service Manager**: Create, edit, enable/disable washing packages, update pricing, and set duration minutes.
- **Reservation & Booking Manager**: Search and filter all unified bookings by status/ID, change booking statuses, and generate PDF receipts.
- **Business Settings Configurator**: Update business contact details, address, WhatsApp number, tax rates %, and time slot capacities.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend Framework** | React 18, Vite 5, TypeScript 5 |
| **Styling & UI** | Tailwind CSS 3, Lucide Icons, Canvas Confetti |
| **Backend API** | Node.js 24, Express.js 4, TypeScript 5, tsx |
| **Database & Auth** | Supabase, PostgreSQL 15, JWT, bcryptjs |
| **PDF Receipt Engine** | jsPDF, jsPDF-AutoTable |
| **Notifications** | Twilio SMS API, WhatsApp Business Cloud API |

---

## 📁 Project Structure

```
anti-gravity-app/
├── package.json                # Root script orchestrator
├── README.md                   # Complete documentation
├── .env.example                # Environment variable template
├── database/
│   ├── schema.sql              # Complete PostgreSQL / Supabase SQL schema
│   ├── seed.sql                # Realistic demo data (cars, services, bookings, admin)
│   └── supabase-setup.md       # Step-by-step Supabase integration guide
├── server/
│   ├── src/
│   │   ├── config/             # Supabase client & in-memory fallback store
│   │   ├── controllers/        # Cars, Services, Bookings, Admin, Settings
│   │   ├── middleware/         # Admin JWT verification middleware
│   │   ├── routes/             # Express API router
│   │   ├── services/           # Booking calculation, PDF generator, Notifications
│   │   ├── types/              # TypeScript data interfaces
│   │   └── index.ts            # Main Express server entry point
│   ├── package.json
│   └── tsconfig.json
└── client/
    ├── index.html
    ├── vite.config.ts
    ├── tailwind.config.js
    ├── src/
    │   ├── components/         # Navbar, Footer, CarCard, ServiceCard, CarCarousel
    │   ├── context/            # AuthContext for admin session
    │   ├── pages/
    │   │   ├── public/         # Home, Fleet, CarDetail, WashServices, Booking, Confirmation, etc.
    │   │   └── admin/          # AdminLogin, AdminDashboard, AdminCars, AdminServices, AdminBookings, AdminSettings
    │   ├── services/           # REST API client
    │   ├── types/              # Client TypeScript interfaces
    │   └── utils/              # Client-side PDF receipt generator
    └── package.json
```

---

## 🚀 Quick Start & Installation

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### 1. Clone & Install Dependencies

```bash
# Navigate to project folder
cd anti-gravity-app

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` in both `server/` and `client/`:

```env
PORT=5000
NODE_ENV=development
APP_URL=http://localhost:5173
JWT_SECRET=super_secret_anti_gravity_jwt_key_2026

# SUPABASE (Optional - falls back to preloaded memory store if keys are pending)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# SMS / WHATSAPP NOTIFICATIONS
TWILIO_ACCOUNT_SID=AC_your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=+18005554728
WHATSAPP_API_TOKEN=your_whatsapp_token
WHATSAPP_PHONE_NUMBER_ID=100200300400500
```

### 3. Run Development Servers

Run the backend API server and frontend client simultaneously:

```bash
# Start Backend API Server (Port 5000)
cd server
npm run dev

# In a separate terminal, start Frontend Vite App (Port 5173)
cd client
npm run dev
```

Open your browser at `http://localhost:5173` to explore the website.

---

## 🔐 Admin Account Credentials

Access the Admin Portal at `/admin/login`:
- **Email**: `admin@antigravity.com`
- **Password**: `Admin@123456`

---

## 🗄️ Supabase Database & Storage Setup

1. Create a project in [Supabase](https://app.supabase.com).
2. Go to **SQL Editor** and execute `database/schema.sql`.
3. Execute `database/seed.sql` to load demo vehicles, car wash packages, and admin credentials.
4. Create 3 public storage buckets in Supabase Storage: `cars`, `services`, and `business`.

---

## 📄 PDF Receipt Generation & Notifications

- **PDF Receipts**: Automated PDF generation creates official branded receipts with customer info, line items, breakdown, and tax details.
- **SMS / WhatsApp**: When `TWILIO_ACCOUNT_SID` or `WHATSAPP_API_TOKEN` is set in `.env`, confirmation messages are dispatched to customer phones. If credentials are unset, formatted trace logs are written to the server console.

---

## 📦 Production Deployment

### Deploying Frontend (Vite React)
Deploy `client/` to Vercel, Netlify, or Cloudflare Pages:
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

### Deploying Backend (Node Express)
Deploy `server/` to Render, Railway, AWS ECS, or DigitalOcean App Platform:
- **Build Command**: `npm run build`
- **Start Command**: `npm start`
- **Port**: `5000` (or `process.env.PORT`)
