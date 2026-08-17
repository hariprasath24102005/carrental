import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CarCard } from '../../components/CarCard';
import { ServiceCard } from '../../components/ServiceCard';
import { api } from '../../services/api';
import { Car, WashService } from '../../types';
import {
  Car as CarIcon,
  Sparkles,
  ShieldCheck,
  Zap,
  ArrowRight,
  CheckCircle2,
  Clock,
  Award,
  Calendar,
  Layers,
  PhoneCall
} from 'lucide-react';

export const Home: React.FC = () => {
  const [featuredCars, setFeaturedCars] = useState<Car[]>([]);
  const [washServices, setWashServices] = useState<WashService[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [carsData, servicesData] = await Promise.all([
          api.getCars(),
          api.getWashServices()
        ]);
        setFeaturedCars(carsData.slice(0, 3));
        setWashServices(servicesData.slice(0, 3));
      } catch (err) {
        console.error('Failed to load home page data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-24 pb-20">
      
      {/* ==================================================================== */}
      {/* 1. HERO SECTION */}
      {/* ==================================================================== */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-24 pb-16 overflow-hidden">
        {/* Background Automotive Image */}
        <div className="absolute inset-0 bg-ag-dark">
          <img
            src="https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=2000&q=80"
            alt="Anti Gravity Hero Car"
            className="w-full h-full object-cover opacity-35 filter brightness-90 saturate-125"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ag-dark via-ag-dark/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-ag-dark/95 via-transparent to-ag-dark/95" />
        </div>

        {/* Hero Content Box */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 z-10">
          
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-ag-card/80 border border-ag-cyan/40 backdrop-blur-md text-ag-cyan text-xs font-bold uppercase tracking-widest cyan-glow">
            <Sparkles className="w-4 h-4" />
            Premium Car Rental & Detailing Platform
          </div>

          <h1 className="font-heading text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight max-w-4xl mx-auto leading-none">
            DRIVE BETTER. TRAVEL FURTHER.{' '}
            <span className="text-gradient-cyan block mt-2">STAY SPOTLESS.</span>
          </h1>

          <p className="max-w-2xl mx-auto text-slate-300 text-base sm:text-lg leading-relaxed font-normal">
            Welcome to <strong className="text-white">Anti Gravity</strong> — the premier automotive experience. 
            Rent luxury sports cars & SUVs, or pamper your vehicle with high-pressure snow foam washing, interior steam detailing, and 9H ceramic coating.
          </p>

          {/* THREE HERO ACTION BUTTONS */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/booking?type=rental"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-ag-cyan to-blue-500 text-slate-950 font-black text-base shadow-lg cyan-glow hover:scale-105 transition-all flex items-center justify-center gap-2"
            >
              <CarIcon className="w-5 h-5 stroke-[2.5]" />
              Book a Car
            </Link>

            <Link
              to="/booking?type=wash"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-ag-gold to-amber-500 text-slate-950 font-black text-base shadow-lg gold-glow hover:scale-105 transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5 stroke-[2.5]" />
              Book a Car Wash
            </Link>

            <Link
              to="/cars"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-ag-surface/80 hover:bg-ag-border border border-ag-border text-white font-bold text-base backdrop-blur-md hover:scale-105 transition-all flex items-center justify-center gap-2"
            >
              View Fleet
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          {/* KEY METRICS BAR */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-12 max-w-4xl mx-auto">
            <div className="glass-panel p-4 rounded-2xl text-center">
              <span className="font-heading text-3xl font-black text-ag-cyan block">100%</span>
              <span className="text-xs text-slate-400 font-medium">Inspected Fleet</span>
            </div>
            <div className="glass-panel p-4 rounded-2xl text-center">
              <span className="font-heading text-3xl font-black text-ag-gold block">24/7</span>
              <span className="text-xs text-slate-400 font-medium">Concierge Support</span>
            </div>
            <div className="glass-panel p-4 rounded-2xl text-center">
              <span className="font-heading text-3xl font-black text-white block">15 Min</span>
              <span className="text-xs text-slate-400 font-medium">Fast Express Wash</span>
            </div>
            <div className="glass-panel p-4 rounded-2xl text-center">
              <span className="font-heading text-3xl font-black text-ag-cyan block">4.9 ★</span>
              <span className="text-xs text-slate-400 font-medium">Customer Rating</span>
            </div>
          </div>

        </div>
      </section>


      {/* ==================================================================== */}
      {/* 2. SERVICES OVERVIEW SECTION */}
      {/* ==================================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
          <span className="text-xs text-ag-cyan font-bold uppercase tracking-widest block">Comprehensive Care</span>
          <h2 className="font-heading text-3xl sm:text-5xl font-extrabold text-white">
            UNMATCHED AUTOMOTIVE SERVICES
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Whether you need an exotic ride for the weekend or ultra-clean detailing for your personal vehicle, Anti Gravity delivers world-class service.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* RENTAL CARD */}
          <div className="glass-card p-8 rounded-3xl space-y-6 relative overflow-hidden group">
            <div className="w-14 h-14 rounded-2xl bg-ag-cyan/10 border border-ag-cyan/40 flex items-center justify-center text-ag-cyan cyan-glow">
              <CarIcon className="w-8 h-8 stroke-[2.5]" />
            </div>
            <h3 className="font-heading text-2xl font-bold text-white">Car Rental Fleet</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Drive top-tier vehicles including Porsche, AMG, Tesla Plaid, BMW M, and Range Rover. Daily & hourly flex rentals with full insurance coverage.
            </p>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-ag-cyan" />
                Zero hidden charges & transparent pricing
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-ag-cyan" />
                Flexible doorstep delivery or airport pickup
              </li>
            </ul>
            <Link
              to="/cars"
              className="inline-flex items-center gap-2 text-ag-cyan font-bold text-sm hover:underline pt-2"
            >
              Explore Fleet Catalog <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* WASHING CARD */}
          <div className="glass-card p-8 rounded-3xl space-y-6 relative overflow-hidden group border-ag-gold/30">
            <div className="w-14 h-14 rounded-2xl bg-ag-gold/10 border border-ag-gold/40 flex items-center justify-center text-ag-gold gold-glow">
              <Sparkles className="w-8 h-8 stroke-[2.5]" />
            </div>
            <h3 className="font-heading text-2xl font-bold text-white">Car Washing & Polish</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Touchless high-pressure foam baths, hand microfiber drying, synthetic wax sealant, and scratch-free wheel decontamination.
            </p>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-ag-gold" />
                Eco-friendly pH-balanced snow foam
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-ag-gold" />
                Guaranteed scratch-free microfiber technique
              </li>
            </ul>
            <Link
              to="/services"
              className="inline-flex items-center gap-2 text-ag-gold font-bold text-sm hover:underline pt-2"
            >
              View Wash Packages <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* DETAILING CARD */}
          <div className="glass-card p-8 rounded-3xl space-y-6 relative overflow-hidden group">
            <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/40 flex items-center justify-center text-purple-400">
              <Layers className="w-8 h-8 stroke-[2.5]" />
            </div>
            <h3 className="font-heading text-2xl font-bold text-white">Full Detailing & Ceramic</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Deep steam carpet extraction, leather conditioning, paint correction, engine bay restoration, and 9H hydrophobic ceramic coating.
            </p>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-400" />
                3-Year Paint Protection Warranty
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-400" />
                Deep Steam Interior Sanitization
              </li>
            </ul>
            <Link
              to="/services"
              className="inline-flex items-center gap-2 text-purple-400 font-bold text-sm hover:underline pt-2"
            >
              Learn About Detailing <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </section>


      {/* ==================================================================== */}
      {/* 3. FEATURED RENTAL CARS */}
      {/* ==================================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs text-ag-cyan font-bold uppercase tracking-widest block">Available Now</span>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-white">
              FEATURED RENTAL FLEET
            </h2>
          </div>
          <Link
            to="/cars"
            className="inline-flex items-center gap-2 text-ag-cyan hover:text-white font-bold text-sm transition-colors"
          >
            View Entire Fleet ({featuredCars.length}+ Vehicles) <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-96 rounded-2xl bg-ag-surface/50 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredCars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        )}
      </section>


      {/* ==================================================================== */}
      {/* 4. WHY CHOOSE US SECTION */}
      {/* ==================================================================== */}
      <section className="relative py-16 bg-ag-card/60 border-y border-ag-border/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs text-ag-gold font-bold uppercase tracking-widest block">The Anti Gravity Standard</span>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-white">
              WHY DISCERNING DRIVERS CHOOSE US
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-ag-surface/40 border border-ag-border/50">
              <div className="w-12 h-12 rounded-xl bg-ag-cyan/10 text-ag-cyan flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-heading text-lg font-bold text-white mb-1">Meticulously Maintained</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Every vehicle undergoes a 50-point safety inspection and full detailing before handing over keys.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-2xl bg-ag-surface/40 border border-ag-border/50">
              <div className="w-12 h-12 rounded-xl bg-ag-gold/10 text-ag-gold flex items-center justify-center shrink-0">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-heading text-lg font-bold text-white mb-1">Instant Online Booking</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Book a car or wash slot in less than 60 seconds with instant booking ID generation and instant PDF receipts.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-2xl bg-ag-surface/40 border border-ag-border/50">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-heading text-lg font-bold text-white mb-1">Transparent Pricing</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  No hidden fees or surprise insurance surcharges. The price calculated at checkout is the price you pay.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* ==================================================================== */}
      {/* 5. CALL TO ACTION BANNER */}
      {/* ==================================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden p-8 sm:p-14 bg-gradient-to-r from-ag-surface via-ag-card to-ag-dark border border-ag-cyan/30 cyan-glow">
          <div className="relative z-10 max-w-2xl space-y-6">
            <h2 className="font-heading text-3xl sm:text-5xl font-black text-white leading-tight">
              READY TO ELEVATE YOUR DRIVING EXPERIENCE?
            </h2>
            <p className="text-slate-300 text-sm sm:text-base">
              Book your dream rental car or reserve a premium detailing slot today. Instant confirmation and instant SMS notification.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link
                to="/booking"
                className="px-8 py-4 rounded-xl bg-ag-cyan text-slate-950 font-black text-base text-center shadow-lg hover:scale-105 transition-all"
              >
                Start Online Booking
              </Link>
              <Link
                to="/contact"
                className="px-8 py-4 rounded-xl bg-ag-surface border border-ag-border text-white font-bold text-base text-center hover:bg-ag-border transition-all"
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
