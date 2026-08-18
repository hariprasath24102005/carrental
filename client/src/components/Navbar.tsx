import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Car, Menu, X, UserCheck, Calendar, Shield, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks: { name: string; path: string }[] = [
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
          ? 'bg-white/95 backdrop-blur-md border-b border-slate-200/90 py-3 shadow-lg shadow-slate-200/50'
          : 'bg-white/80 backdrop-blur-sm border-b border-slate-200/50 py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* TOP-LEFT COMPANY LOGO BADGE */}
          <Link to="/" className="flex items-center gap-3.5 group">
            {/* Metallic Shield Emblem Logo */}
            <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-tr from-slate-950 via-slate-900 to-red-600 p-0.5 shadow-md shadow-red-600/20 transition-transform duration-300 group-hover:scale-105">
              <div className="w-full h-full rounded-[14px] bg-slate-950 flex items-center justify-center relative overflow-hidden">
                <Shield className="w-6 h-6 text-red-500 stroke-[2] absolute" />
                <Car className="w-5 h-5 text-white stroke-[2.5] z-10 transform group-hover:translate-x-0.5 transition-transform" />
                <div className="absolute top-0 right-0 w-4 h-4 bg-red-500/20 rounded-full blur-sm" />
              </div>
            </div>

            {/* Typography Brand Name */}
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 leading-none">
                <span className="font-heading text-xl font-black tracking-tighter text-slate-950 uppercase">
                  ANTI<span className="text-red-600">GRAVITY</span>
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
              </div>
              <span className="text-[10px] font-mono text-slate-500 tracking-widest block uppercase font-bold mt-1">
                AUTOMOTIVE • RENTAL & WASH
              </span>
            </div>
          </Link>

          {/* DESKTOP NAV LINKS (NEW SLEEK PILL STYLE) */}
          <div className="hidden md:flex items-center gap-1 bg-slate-100/90 border border-slate-200/90 rounded-full p-1.5 shadow-inner">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 flex items-center gap-1.5 uppercase tracking-wider ${
                    active
                      ? 'bg-slate-900 text-white shadow-md shadow-slate-900/20'
                      : 'text-slate-700 hover:text-red-600 hover:bg-white/80'
                  }`}
                >
                  {active && <Sparkles className="w-3 h-3 text-red-500 animate-spin" style={{ animationDuration: '6s' }} />}
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </div>

          {/* RIGHT ACTION BUTTONS */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/admin"
                  className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-900 px-4 py-2 rounded-xl text-xs font-bold transition-all"
                >
                  <UserCheck className="w-4 h-4 text-red-600" />
                  Admin Dashboard
                </Link>
                <button
                  onClick={() => logout()}
                  className="text-xs text-slate-500 hover:text-red-600 px-2 py-1 font-semibold"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/admin/login"
                className="text-slate-600 hover:text-slate-950 text-xs font-bold px-3 py-2 transition-colors uppercase tracking-wider"
              >
                Admin Login
              </Link>
            )}

            <Link
              to="/booking"
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-black px-5 py-2.5 rounded-xl text-xs shadow-md shadow-red-600/25 hover:scale-[1.03] transition-all uppercase tracking-widest"
            >
              <Calendar className="w-4 h-4" />
              Book Now
            </Link>
          </div>

          {/* MOBILE MENU TOGGLE */}
          <div className="md:hidden flex items-center gap-2">
            <Link
              to="/booking"
              className="bg-red-600 text-white p-2.5 rounded-xl font-bold text-xs flex items-center gap-1 shadow-md"
            >
              <Calendar className="w-4 h-4" />
              Book
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-200"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* MOBILE MENU DRAWER */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/98 border-b border-slate-200 px-4 pt-4 pb-6 space-y-3 mt-3 shadow-2xl backdrop-blur-xl">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center justify-between px-4 py-3 rounded-xl font-bold text-sm ${
                isActive(link.path)
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-800 hover:bg-slate-100'
              }`}
            >
              <span>{link.name}</span>
            </Link>
          ))}

          <div className="pt-3 border-t border-slate-200 flex flex-col gap-2">
            {isAuthenticated ? (
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center bg-slate-100 text-slate-900 font-bold py-3 rounded-xl border border-slate-300 text-xs"
              >
                Admin Dashboard
              </Link>
            ) : (
              <Link
                to="/admin/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center text-slate-700 py-2 text-xs font-bold uppercase tracking-wider"
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
