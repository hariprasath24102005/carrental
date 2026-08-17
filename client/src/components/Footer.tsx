import React from 'react';
import { Link } from 'react-router-dom';
import { Car, Phone, Mail, MapPin, Clock, ShieldCheck, Instagram, Facebook, Twitter } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-b from-ag-dark to-slate-950 border-t border-ag-border text-slate-400 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* BRAND COLUMN */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-ag-cyan to-blue-600 flex items-center justify-center cyan-glow">
                <Car className="w-6 h-6 text-slate-950 stroke-[2.5]" />
              </div>
              <span className="font-heading text-2xl font-black tracking-wider text-white uppercase">
                ANTI<span className="text-ag-cyan">GRAVITY</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              Premium automotive excellence. Offering exotic & luxury car rentals alongside high-end professional washing and ceramic detailing.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a href="#" className="w-9 h-9 rounded-lg bg-ag-surface flex items-center justify-center text-slate-300 hover:text-ag-cyan hover:bg-ag-border transition-all">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-ag-surface flex items-center justify-center text-slate-300 hover:text-ag-cyan hover:bg-ag-border transition-all">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-ag-surface flex items-center justify-center text-slate-300 hover:text-ag-cyan hover:bg-ag-border transition-all">
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* QUICK LINKS */}
          <div>
            <h4 className="font-heading text-lg font-bold text-white mb-4 flex items-center gap-2">
              Quick Navigation
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/cars" className="hover:text-ag-cyan transition-colors">Our Rental Fleet</Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-ag-cyan transition-colors">Car Wash & Detailing Catalog</Link>
              </li>
              <li>
                <Link to="/booking" className="hover:text-ag-cyan transition-colors">Online Booking Engine</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-ag-cyan transition-colors">About Anti Gravity</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-ag-cyan transition-colors">Customer Support</Link>
              </li>
            </ul>
          </div>

          {/* SERVICES */}
          <div>
            <h4 className="font-heading text-lg font-bold text-white mb-4">
              Featured Services
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li className="text-slate-300">Exotic Sports Car Rental</li>
              <li className="text-slate-300">Luxury SUV & Sedan Rental</li>
              <li className="text-slate-300">Signature Snow Foam Wash</li>
              <li className="text-slate-300">Deep Interior Steam Extraction</li>
              <li className="text-slate-300">9H Nano Ceramic Coating</li>
            </ul>
          </div>

          {/* CONTACT INFO */}
          <div className="space-y-3.5 text-sm">
            <h4 className="font-heading text-lg font-bold text-white mb-4">
              Get In Touch
            </h4>
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-ag-cyan shrink-0 mt-0.5" />
              <span>100 Anti Gravity Way, Suite 500, New York, NY 10001</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-ag-cyan shrink-0" />
              <span>+91 9363115217</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-ag-cyan shrink-0" />
              <span>contact@antigravitycars.com</span>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-4 h-4 text-ag-gold shrink-0" />
              <span>Mon - Sun: 8:00 AM - 8:00 PM</span>
            </div>
          </div>

        </div>

        {/* BOTTOM LEGAL BAR */}
        <div className="pt-8 border-t border-ag-border/60 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Anti Gravity Automotive Services. All Rights Reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="hover:text-slate-300 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-slate-300 transition-colors">Terms of Service</Link>
            <Link to="/admin/login" className="hover:text-ag-cyan transition-colors">Admin Portal</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};
