import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { DashboardStats } from '../../types';
import {
  Car as CarIcon,
  Sparkles,
  Calendar,
  DollarSign,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Settings,
  Layers
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getDashboardStats()
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="pt-32 pb-20 text-center">
        <div className="w-12 h-12 border-4 border-ag-cyan border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-400">Loading admin metrics...</p>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs text-ag-cyan font-bold uppercase tracking-widest block">Executive Console</span>
          <h1 className="font-heading text-3xl sm:text-4xl font-black text-white">
            ADMIN DASHBOARD
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/bookings"
            className="px-4 py-2.5 rounded-xl bg-ag-cyan text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md"
          >
            <Calendar className="w-4 h-4" />
            Manage Bookings
          </Link>
          <Link
            to="/admin/cars"
            className="px-4 py-2.5 rounded-xl bg-ag-surface border border-ag-border text-white font-semibold text-xs flex items-center gap-1.5"
          >
            <CarIcon className="w-4 h-4" />
            Manage Fleet
          </Link>
        </div>
      </div>

      {/* KPI METRIC CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* TOTAL REVENUE */}
        <div className="glass-card p-6 rounded-3xl space-y-3 border-ag-cyan/40 cyan-glow">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-semibold">Total Gross Revenue</span>
            <div className="w-10 h-10 rounded-xl bg-ag-cyan/10 text-ag-cyan flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="font-heading text-3xl font-black text-white">
            ${stats?.totalRevenue.toLocaleString() || '0'}
          </div>
          <span className="text-[11px] text-emerald-400 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> +14.2% from last month
          </span>
        </div>

        {/* TOTAL BOOKINGS */}
        <div className="glass-card p-6 rounded-3xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-semibold">Total Bookings</span>
            <div className="w-10 h-10 rounded-xl bg-ag-gold/10 text-ag-gold flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div className="font-heading text-3xl font-black text-white">
            {stats?.totalBookings || 0}
          </div>
          <span className="text-[11px] text-slate-400">
            {stats?.pendingBookings || 0} Pending | {stats?.confirmedBookings || 0} Confirmed
          </span>
        </div>

        {/* AVAILABLE VEHICLES */}
        <div className="glass-card p-6 rounded-3xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-semibold">Fleet Status</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <CarIcon className="w-5 h-5" />
            </div>
          </div>
          <div className="font-heading text-3xl font-black text-white">
            {stats?.availableCars || 0} / {stats?.totalCars || 0}
          </div>
          <span className="text-[11px] text-amber-400 flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" /> {stats?.maintenanceCars || 0} under maintenance
          </span>
        </div>

        {/* TODAY WASH APPOINTMENTS */}
        <div className="glass-card p-6 rounded-3xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-semibold">Today's Wash Appointments</span>
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
          <div className="font-heading text-3xl font-black text-white">
            {stats?.todayWashAppointments || 0}
          </div>
          <span className="text-[11px] text-slate-400">
            {stats?.activeWashServices || 0} Active Wash Services
          </span>
        </div>

      </div>

      {/* QUICK MANAGEMENT NAVIGATION CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
        
        <Link
          to="/admin/cars"
          className="glass-card p-6 rounded-3xl space-y-3 hover:border-ag-cyan transition-all group"
        >
          <div className="w-12 h-12 rounded-2xl bg-ag-surface text-ag-cyan flex items-center justify-center group-hover:scale-110 transition-transform">
            <CarIcon className="w-6 h-6" />
          </div>
          <h3 className="font-heading text-lg font-bold text-white group-hover:text-ag-cyan">
            Car Rental Fleet
          </h3>
          <p className="text-xs text-slate-400">Add, edit specs, update pricing, or mark vehicles under maintenance.</p>
        </Link>

        <Link
          to="/admin/services"
          className="glass-card p-6 rounded-3xl space-y-3 hover:border-ag-gold transition-all group"
        >
          <div className="w-12 h-12 rounded-2xl bg-ag-surface text-ag-gold flex items-center justify-center group-hover:scale-110 transition-transform">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="font-heading text-lg font-bold text-white group-hover:text-ag-gold">
            Car Wash Catalog
          </h3>
          <p className="text-xs text-slate-400">Configure detailing packages, durations, and pricing.</p>
        </Link>

        <Link
          to="/admin/bookings"
          className="glass-card p-6 rounded-3xl space-y-3 hover:border-purple-400 transition-all group"
        >
          <div className="w-12 h-12 rounded-2xl bg-ag-surface text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Calendar className="w-6 h-6" />
          </div>
          <h3 className="font-heading text-lg font-bold text-white group-hover:text-purple-400">
            Booking Reservations
          </h3>
          <p className="text-xs text-slate-400">Review customer bookings, change status, and generate receipts.</p>
        </Link>

        <Link
          to="/admin/settings"
          className="glass-card p-6 rounded-3xl space-y-3 hover:border-emerald-400 transition-all group"
        >
          <div className="w-12 h-12 rounded-2xl bg-ag-surface text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Settings className="w-6 h-6" />
          </div>
          <h3 className="font-heading text-lg font-bold text-white group-hover:text-emerald-400">
            Business Settings
          </h3>
          <p className="text-xs text-slate-400">Manage contact details, tax rates %, and operating slot rules.</p>
        </Link>

      </div>

    </div>
  );
};
