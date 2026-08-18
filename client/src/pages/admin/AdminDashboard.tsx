import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { DashboardStats } from '../../types';
import {
  Car as CarIcon,
  Sparkles,
  Calendar,
  DollarSign,
  AlertTriangle,
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
      <div className="pt-32 pb-20 text-center bg-slate-50 min-h-screen">
        <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-600 font-medium">Loading admin metrics...</p>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 bg-slate-50 text-slate-800">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs text-red-600 font-bold uppercase tracking-widest block">Executive Console</span>
          <h1 className="font-heading text-3xl sm:text-4xl font-black text-slate-900 uppercase tracking-tight">
            ADMIN DASHBOARD
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/bookings"
            className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-red-600/20 uppercase tracking-wider"
          >
            <Calendar className="w-4 h-4" />
            Manage Bookings
          </Link>
          <Link
            to="/admin/cars"
            className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 hover:bg-slate-100 font-bold text-xs flex items-center gap-1.5 shadow-sm uppercase tracking-wider"
          >
            <CarIcon className="w-4 h-4 text-red-600" />
            Manage Fleet
          </Link>
        </div>
      </div>

      {/* KPI METRIC CARDS GRID (HIGH VISIBILITY WHITE LUXURY STYLING) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* TOTAL REVENUE */}
        <div className="bg-white p-6 rounded-3xl space-y-3 border border-slate-200 shadow-xl shadow-slate-200/50">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-600 font-bold uppercase tracking-wider">Total Gross Revenue</span>
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 border border-red-100 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="font-heading text-3xl font-black text-slate-900">
            ${stats?.totalRevenue.toLocaleString() || '0'}
          </div>
          <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> +14.2% from last month
          </span>
        </div>

        {/* TOTAL BOOKINGS */}
        <div className="bg-white p-6 rounded-3xl space-y-3 border border-slate-200 shadow-xl shadow-slate-200/50">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-600 font-bold uppercase tracking-wider">Total Bookings</span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div className="font-heading text-3xl font-black text-slate-900">
            {stats?.totalBookings || 0}
          </div>
          <span className="text-[11px] text-slate-600 font-medium">
            {stats?.pendingBookings || 0} Pending | {stats?.confirmedBookings || 0} Confirmed
          </span>
        </div>

        {/* AVAILABLE VEHICLES */}
        <div className="bg-white p-6 rounded-3xl space-y-3 border border-slate-200 shadow-xl shadow-slate-200/50">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-600 font-bold uppercase tracking-wider">Fleet Status</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center">
              <CarIcon className="w-5 h-5" />
            </div>
          </div>
          <div className="font-heading text-3xl font-black text-slate-900">
            {stats?.availableCars || 0} / {stats?.totalCars || 0}
          </div>
          <span className="text-[11px] text-amber-600 font-bold flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" /> {stats?.maintenanceCars || 0} under maintenance
          </span>
        </div>

        {/* TODAY WASH APPOINTMENTS */}
        <div className="bg-white p-6 rounded-3xl space-y-3 border border-slate-200 shadow-xl shadow-slate-200/50">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-600 font-bold uppercase tracking-wider">Today's Wash Appointments</span>
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 border border-sky-100 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
          <div className="font-heading text-3xl font-black text-slate-900">
            {stats?.todayWashAppointments || 0}
          </div>
          <span className="text-[11px] text-slate-600 font-medium">
            {stats?.activeWashServices || 0} Active Wash Services
          </span>
        </div>

      </div>

      {/* QUICK MANAGEMENT NAVIGATION CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
        
        <Link
          to="/admin/cars"
          className="bg-white p-6 rounded-3xl space-y-3 border border-slate-200 shadow-lg hover:border-red-500 transition-all group"
        >
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center group-hover:scale-110 transition-transform">
            <CarIcon className="w-6 h-6" />
          </div>
          <h3 className="font-heading text-lg font-bold text-slate-900 group-hover:text-red-600">
            Car Rental Fleet
          </h3>
          <p className="text-xs text-slate-600">Add, edit specs, update pricing, or mark vehicles under maintenance.</p>
        </Link>

        <Link
          to="/admin/services"
          className="bg-white p-6 rounded-3xl space-y-3 border border-slate-200 shadow-lg hover:border-amber-500 transition-all group"
        >
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="font-heading text-lg font-bold text-slate-900 group-hover:text-amber-600">
            Car Wash Catalog
          </h3>
          <p className="text-xs text-slate-600">Configure detailing packages, durations, and pricing.</p>
        </Link>

        <Link
          to="/admin/bookings"
          className="bg-white p-6 rounded-3xl space-y-3 border border-slate-200 shadow-lg hover:border-purple-500 transition-all group"
        >
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Calendar className="w-6 h-6" />
          </div>
          <h3 className="font-heading text-lg font-bold text-slate-900 group-hover:text-purple-600">
            Booking Reservations
          </h3>
          <p className="text-xs text-slate-600">Review customer bookings, change status, and generate receipts.</p>
        </Link>

        <Link
          to="/admin/settings"
          className="bg-white p-6 rounded-3xl space-y-3 border border-slate-200 shadow-lg hover:border-emerald-500 transition-all group"
        >
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Settings className="w-6 h-6" />
          </div>
          <h3 className="font-heading text-lg font-bold text-slate-900 group-hover:text-emerald-600">
            Business Settings
          </h3>
          <p className="text-xs text-slate-600">Manage contact details, tax rates %, and operating slot rules.</p>
        </Link>

      </div>

    </div>
  );
};
