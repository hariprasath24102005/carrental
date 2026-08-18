import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CarCard } from '../../components/CarCard';
import { InteractiveCarShowcase } from '../../components/InteractiveCarShowcase';
import { api } from '../../services/api';
import { Car } from '../../types';
import {
  Car as CarIcon,
  Sparkles,
  ShieldCheck,
  Zap,
  ArrowRight,
  Award,
  Layers,
  ChevronRight,
  Flame,
  Droplets
} from 'lucide-react';

export const Home: React.FC = () => {
  const [featuredCars, setFeaturedCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<string>('All');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const carsData = await api.getCars();
        setFeaturedCars(carsData.slice(0, 3));
      } catch (err) {
        console.error('Failed to load home page data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredCars = selectedFilter === 'All'
    ? featuredCars
    : featuredCars.filter(c => c.fuel_type.toLowerCase() === selectedFilter.toLowerCase() || c.brand.toLowerCase().includes(selectedFilter.toLowerCase()));

  return (
    <div className="bg-slate-50 text-slate-900 font-sans selection:bg-red-600 selection:text-white pb-20 space-y-24 sm:space-y-32 overflow-x-hidden">
      
      {/* ==================================================================== */}
      {/* 1. CINEMATIC HERO SECTION */}
      {/* ==================================================================== */}
      <section className="relative min-h-[92vh] flex items-center pt-28 pb-16 overflow-hidden">
        {/* Background Editorial Glow & Architecture Grid */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[1100px] h-[550px] bg-gradient-to-tr from-red-500/10 via-slate-200/40 to-transparent rounded-full blur-[140px]" />
          <div
            className="absolute inset-0 opacity-25"
            style={{
              backgroundImage: `radial-gradient(circle at 50% 50%, rgba(15, 23, 42, 0.08) 1px, transparent 1px)`,
              backgroundSize: '40px 40px'
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* HERO TYPOGRAPHY & COPY (LEFT 6 COLS) */}
            <div className="lg:col-span-6 space-y-6 sm:space-y-8 text-left">
              
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 text-red-600 text-xs font-mono uppercase tracking-widest shadow-sm">
                <Flame className="w-3.5 h-3.5 text-red-600" />
                THE PREMIER AUTOMOTIVE BRAND
              </div>

              <h1 className="font-heading text-5xl sm:text-7xl lg:text-8xl font-black text-slate-950 tracking-tighter uppercase leading-[0.95]">
                SMOOTH.{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-orange-500 to-amber-600 block">
                  POWERFUL.
                </span>
                YOURS.
              </h1>

              <p className="text-slate-600 text-base sm:text-lg max-w-lg leading-relaxed font-normal">
                Welcome to <strong className="text-slate-950 font-bold">Anti Gravity</strong> — where luxury detailing meets high-performance car rentals. Experience touchless foam detailing or take the wheel of an exotic supercar.
              </p>

              {/* ACTION BUTTONS */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                <Link
                  to="/booking?type=wash"
                  className="px-8 py-4 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black text-sm uppercase tracking-wider shadow-xl shadow-red-600/20 hover:scale-105 transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  Book a Wash
                </Link>

                <Link
                  to="/booking?type=rental"
                  className="px-8 py-4 rounded-2xl bg-slate-950 hover:bg-slate-800 text-white font-black text-sm uppercase tracking-wider hover:scale-105 transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-950/20"
                >
                  <CarIcon className="w-4 h-4 text-red-500" />
                  Rent a Car
                </Link>

                <Link
                  to="/cars"
                  className="px-6 py-4 text-slate-600 hover:text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
                >
                  Explore Fleet
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* HERO STATS BAR */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200 max-w-md">
                <div>
                  <span className="font-heading text-2xl font-black text-slate-950 block">100%</span>
                  <span className="text-[11px] text-slate-500 font-mono uppercase font-semibold">Inspected Fleet</span>
                </div>
                <div>
                  <span className="font-heading text-2xl font-black text-red-600 block">24/7</span>
                  <span className="text-[11px] text-slate-500 font-mono uppercase font-semibold">Concierge</span>
                </div>
                <div>
                  <span className="font-heading text-2xl font-black text-sky-600 block">4.9 ★</span>
                  <span className="text-[11px] text-slate-500 font-mono uppercase font-semibold">Rating</span>
                </div>
              </div>

            </div>

            {/* HUGE HERO VEHICLE VISUAL (RIGHT 6 COLS — OCCUPIES 55-65% VISUAL AREA) */}
            <div className="lg:col-span-6 relative w-full flex items-center justify-center">
              
              {/* Soft Ambient Background Geometry */}
              <div className="absolute inset-0 bg-gradient-to-tr from-red-500/10 via-slate-100 to-transparent rounded-[3rem] blur-2xl transform rotate-3 scale-95" />

              {/* Main Container */}
              <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] max-h-[500px] rounded-[2.5rem] bg-white border border-slate-200/90 shadow-2xl shadow-slate-200/80 p-6 sm:p-10 flex flex-col justify-between overflow-hidden">
                
                {/* Floor Shadow */}
                <div className="absolute bottom-6 left-[10%] right-[10%] h-12 rounded-[100%] bg-slate-900/25 blur-md pointer-events-none" />

                {/* Floor Reflection */}
                <div
                  className="absolute bottom-0 left-4 right-4 h-28 pointer-events-none opacity-20 blur-[3px] overflow-hidden"
                  style={{ transform: 'scaleY(-1) translateY(-85%)' }}
                >
                  <img
                    src="/car_rental_3d.jpg"
                    alt=""
                    aria-hidden="true"
                    className="w-full h-full object-contain filter brightness-95"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent" />
                </div>

                {/* Hero Vehicle Image */}
                <div className="relative z-10 w-full h-full flex items-center justify-center">
                  <img
                    src="/car_rental_3d.jpg"
                    alt="Anti Gravity Hero Vehicle"
                    className="w-full max-h-[380px] object-contain filter drop-shadow-[0_25px_35px_rgba(15,23,42,0.2)] transform hover:scale-105 transition-transform duration-700"
                  />
                </div>

                {/* Subtle Overlay Label */}
                <div className="relative z-20 flex items-center justify-between text-[11px] font-mono text-slate-500 pt-2 border-t border-slate-200/80 font-semibold">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
                    ANTI GRAVITY ARISE GT
                  </span>
                  <span>SERIES 2026</span>
                </div>

              </div>

            </div>

          </div>
        </div>
      </section>


      {/* ==================================================================== */}
      {/* 2. SECTION A — CAR WASH INTERACTIVE SHOWCASE */}
      {/* ==================================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <InteractiveCarShowcase
          title="CAR WASH"
          eyebrow="PRECISION CARE FOR EVERY JOURNEY"
          description="A cleaner car. A better drive. High-pressure snow foam baths, interior steam extraction, hand microfiber dry, and 9H hydrophobic ceramic paint coating."
          image="/car_wash_3d.jpg"
          buttonText="BOOK A WASH"
          buttonLink="/services"
          variant="wash"
        />
      </section>


      {/* ==================================================================== */}
      {/* 3. SECTION B — CAR RENTAL INTERACTIVE SHOWCASE */}
      {/* ==================================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <InteractiveCarShowcase
          title="CAR RENTAL"
          eyebrow="YOUR NEXT JOURNEY STARTS HERE"
          description="Choose your drive. Exotic supercars, luxury SUVs, and high-performance electric GTs. Flexible daily and hourly flex rentals with doorstep delivery."
          image="/car_rental_3d.jpg"
          buttonText="EXPLORE CARS"
          buttonLink="/cars"
          variant="rental"
        />
      </section>


      {/* ==================================================================== */}
      {/* 4. COMPACT OUR SERVICES STRIP */}
      {/* ==================================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs text-red-600 font-mono uppercase tracking-widest block font-bold">Comprehensive Care</span>
          <h2 className="font-heading text-3xl sm:text-5xl font-black text-slate-950 uppercase tracking-tight">
            OUR SERVICES
          </h2>
          <p className="text-slate-600 text-sm font-normal">
            Engineered precision for personal vehicles and luxury fleet maintenance.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* SERVICE ITEM 01 */}
          <div className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-xl shadow-slate-200/50 hover:border-red-500/50 transition-all space-y-4 group">
            <div className="flex items-center justify-between">
              <span className="font-mono text-2xl font-black text-red-600">01</span>
              <Droplets className="w-6 h-6 text-slate-400 group-hover:text-red-600 transition-colors" />
            </div>
            <h3 className="font-heading text-xl font-bold text-slate-950">Exterior Wash</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              Touchless high-pressure foam pre-rinse, two-bucket microfiber hand wash, and tire shine.
            </p>
            <Link to="/services" className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 hover:underline pt-2">
              Inspect Package <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* SERVICE ITEM 02 */}
          <div className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-xl shadow-slate-200/50 hover:border-red-500/50 transition-all space-y-4 group">
            <div className="flex items-center justify-between">
              <span className="font-mono text-2xl font-black text-red-600">02</span>
              <Sparkles className="w-6 h-6 text-slate-400 group-hover:text-red-600 transition-colors" />
            </div>
            <h3 className="font-heading text-xl font-bold text-slate-950">Interior Care</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              Deep steam seat & carpet extraction, leather conditioning, and air vent sanitization.
            </p>
            <Link to="/services" className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 hover:underline pt-2">
              Inspect Package <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* SERVICE ITEM 03 */}
          <div className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-xl shadow-slate-200/50 hover:border-red-500/50 transition-all space-y-4 group">
            <div className="flex items-center justify-between">
              <span className="font-mono text-2xl font-black text-red-600">03</span>
              <Layers className="w-6 h-6 text-slate-400 group-hover:text-red-600 transition-colors" />
            </div>
            <h3 className="font-heading text-xl font-bold text-slate-950">Full Detailing</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              Paint swirl correction, engine bay steam restoration, and 9H hydrophobic ceramic coating.
            </p>
            <Link to="/services" className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 hover:underline pt-2">
              Inspect Package <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* SERVICE ITEM 04 */}
          <div className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-xl shadow-slate-200/50 hover:border-red-500/50 transition-all space-y-4 group">
            <div className="flex items-center justify-between">
              <span className="font-mono text-2xl font-black text-red-600">04</span>
              <CarIcon className="w-6 h-6 text-slate-400 group-hover:text-red-600 transition-colors" />
            </div>
            <h3 className="font-heading text-xl font-bold text-slate-950">Premium Rental</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              Hourly and daily flex vehicle rentals featuring Porsche, AMG, Tesla Plaid, and Range Rover.
            </p>
            <Link to="/cars" className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 hover:underline pt-2">
              View catalog <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>
      </section>


      {/* ==================================================================== */}
      {/* 5. BRAND VALUES — WHY DISCERNING DRIVERS CHOOSE US */}
      {/* ==================================================================== */}
      <section className="relative py-20 bg-slate-100/70 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs text-red-600 font-mono uppercase tracking-widest block font-bold">The Anti Gravity Standard</span>
            <h2 className="font-heading text-3xl sm:text-5xl font-black text-slate-950 uppercase tracking-tight">
              ENGINEERED FOR EXCELLENCE
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-start gap-4 p-6 rounded-3xl bg-white border border-slate-200/90 shadow-lg shadow-slate-200/50">
              <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 border border-red-200 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="font-heading text-lg font-bold text-slate-950">50-Point Safety Inspection</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Every rental car and detailed vehicle undergoes a rigorous multi-point check before key handover.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 rounded-3xl bg-white border border-slate-200/90 shadow-lg shadow-slate-200/50">
              <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 border border-red-200 flex items-center justify-center shrink-0">
                <Zap className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="font-heading text-lg font-bold text-slate-950">Instant Reservation Engine</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Book a car or wash slot in less than 60 seconds with instant booking ID generation and receipts.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 rounded-3xl bg-white border border-slate-200/90 shadow-lg shadow-slate-200/50">
              <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 border border-red-200 flex items-center justify-center shrink-0">
                <Award className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="font-heading text-lg font-bold text-slate-950">Transparent Pricing</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  No hidden fees or surprise insurance surcharges. The price calculated at checkout is exact.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* ==================================================================== */}
      {/* 6. FEATURED RENTAL FLEET CATALOG (LOCATED LOWER DOWN THE PAGE) */}
      {/* ==================================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <span className="text-xs text-red-600 font-mono uppercase tracking-widest block font-bold">Available Now</span>
            <h2 className="font-heading text-3xl sm:text-5xl font-black text-slate-950 uppercase tracking-tight">
              EXPLORE OUR FLEET
            </h2>
          </div>

          {/* CATEGORY TAGS */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {['All', 'Porsche', 'Mercedes-Benz', 'Tesla'].map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedFilter(tag)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  selectedFilter === tag
                    ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                    : 'bg-white text-slate-700 hover:text-slate-950 border border-slate-200/90 shadow-sm'
                }`}
              >
                {tag}
              </button>
            ))}
            <Link
              to="/cars"
              className="px-4 py-2 text-xs font-bold text-red-600 hover:underline whitespace-nowrap flex items-center gap-1 ml-2"
            >
              All Vehicles ({featuredCars.length}+) <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-96 rounded-3xl bg-slate-200/60 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {filteredCars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        )}
      </section>


      {/* ==================================================================== */}
      {/* 7. CALL TO ACTION BANNER */}
      {/* ==================================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-[2.5rem] overflow-hidden p-10 sm:p-16 bg-gradient-to-r from-slate-950 via-slate-900 to-zinc-950 text-white shadow-2xl space-y-6">
          <div className="absolute inset-0 bg-radial-gradient from-red-600/20 to-transparent blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl space-y-4">
            <h2 className="font-heading text-4xl sm:text-6xl font-black text-white uppercase tracking-tighter leading-none">
              READY TO ELEVATE YOUR DRIVE?
            </h2>
            <p className="text-slate-300 text-sm sm:text-base font-light">
              Reserve your dream rental car or schedule a high-pressure snow foam detailing appointment online.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link
                to="/booking"
                className="px-8 py-4 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black text-sm uppercase tracking-wider shadow-xl shadow-red-600/30 hover:scale-105 transition-all text-center"
              >
                Start Online Booking
              </Link>
              <Link
                to="/contact"
                className="px-8 py-4 rounded-2xl bg-slate-800 border border-slate-700 text-white font-bold text-sm uppercase tracking-wider hover:bg-slate-700 transition-all text-center"
              >
                Contact Concierge
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
