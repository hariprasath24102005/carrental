import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Car, Sparkles, ShieldCheck, Menu, X, UserCheck, Calendar } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Rental Fleet', path: '/cars' },
    { name: 'Car Wash Services', path: '/services' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname !== '/') return false;
    return location.pathname.startsWith(path);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-ag-dark/90 backdrop-blur-md border-b border-ag-border/80 py-3 shadow-2xl'
          : 'bg-gradient-to-b from-ag-dark/95 to-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* BRAND LOGO */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-ag-cyan to-blue-600 flex items-center justify-center cyan-glow transition-transform duration-300 group-hover:scale-105">
              <Car className="w-6 h-6 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <span className="font-heading text-xl font-black tracking-wider text-white uppercase block leading-none">
                ANTI<span className="text-ag-cyan">GRAVITY</span>
              </span>
              <span className="text-[10px] text-slate-400 font-medium tracking-widest block uppercase mt-0.5">
                Rental & Detailing
              </span>
            </div>
          </Link>

          {/* DESKTOP NAV LINKS */}
          <div className="hidden md:flex items-center gap-1 bg-ag-card/60 border border-ag-border/50 rounded-full px-4 py-1.5 backdrop-blur-sm">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  isActive(link.path)
                    ? 'bg-ag-cyan text-slate-950 font-semibold shadow-md'
                    : 'text-slate-300 hover:text-white hover:bg-ag-surface/50'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* ACTION BUTTONS */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/admin"
                  className="flex items-center gap-2 bg-ag-surface hover:bg-ag-border border border-ag-cyan/40 text-ag-cyan px-4 py-2 rounded-xl text-sm font-semibold transition-all"
                >
                  <UserCheck className="w-4 h-4" />
                  Admin Dashboard
                </Link>
                <button
                  onClick={() => logout()}
                  className="text-xs text-slate-400 hover:text-red-400 px-2 py-1"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/admin/login"
                className="text-slate-400 hover:text-white text-xs font-medium px-3 py-2 transition-colors"
              >
                Admin Login
              </Link>
            )}

            <Link
              to="/booking"
              className="flex items-center gap-2 bg-gradient-to-r from-ag-cyan to-blue-500 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-sm cyan-glow hover:opacity-90 hover:scale-[1.02] transition-all"
            >
              <Calendar className="w-4 h-4" />
              Book Now
            </Link>
          </div>

          {/* MOBILE MENU TOGGLE */}
          <div className="md:hidden flex items-center gap-2">
            <Link
              to="/booking"
              className="bg-ag-cyan text-slate-950 p-2 rounded-lg font-bold text-xs flex items-center gap-1"
            >
              <Calendar className="w-4 h-4" />
              Book
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-ag-surface text-slate-300 hover:text-white border border-ag-border"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* MOBILE DRAWER */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-ag-dark/98 border-b border-ag-border px-4 pt-4 pb-6 space-y-3 mt-3 backdrop-blur-xl animate-in slide-in-from-top duration-200">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-3 rounded-xl font-medium ${
                isActive(link.path)
                  ? 'bg-ag-cyan text-slate-950 font-bold'
                  : 'text-slate-200 hover:bg-ag-surface'
              }`}
            >
              {link.name}
            </Link>
          ))}

          <div className="pt-3 border-t border-ag-border/60 flex flex-col gap-2">
            {isAuthenticated ? (
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center bg-ag-surface text-ag-cyan font-semibold py-3 rounded-xl border border-ag-cyan/40"
              >
                Admin Dashboard
              </Link>
            ) : (
              <Link
                to="/admin/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center text-slate-300 py-2 text-sm"
              >
                Admin Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
