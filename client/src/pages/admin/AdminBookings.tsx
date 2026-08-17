import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { downloadBookingReceiptPDFClient } from '../../utils/pdfGenerator';
import { Booking, BookingStatus, BusinessSettings } from '../../types';
import { Search, Download, Eye, Calendar, User, Phone, CheckCircle2, X } from 'lucide-react';

export const AdminBookings: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [businessSettings, setBusinessSettings] = useState<BusinessSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const fetchBookings = async () => {
    try {
      const params: Record<string, string> = {};
      if (search) params.search = search;
      if (selectedStatus) params.status = selectedStatus;

      const [data, settingsData] = await Promise.all([
        api.getBookings(params),
        api.getBusinessSettings()
      ]);
      setBookings(data);
      setBusinessSettings(settingsData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [search, selectedStatus]);

  const handleStatusChange = async (bookingId: string, newStatus: BookingStatus) => {
    try {
      await api.updateBookingStatus(bookingId, newStatus);
      fetchBookings();
      if (selectedBooking && selectedBooking.id === bookingId) {
        setSelectedBooking({ ...selectedBooking, status: newStatus });
      }
    } catch (err: any) {
      alert(err.message || 'Failed to update booking status');
    }
  };

  const handleDownloadPDF = (b: Booking) => {
    if (businessSettings) {
      downloadBookingReceiptPDFClient(b, businessSettings);
    }
  };

  const statuses = ['All Statuses', 'Pending', 'Confirmed', 'In Progress', 'Completed', 'Cancelled'];

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs text-ag-cyan font-bold uppercase tracking-widest block">Unified Reservations</span>
          <h1 className="font-heading text-3xl font-black text-white">BOOKING MANAGEMENT</h1>
        </div>
      </div>

      {/* FILTER STRIP */}
      <div className="glass-panel p-6 rounded-3xl space-y-4 border border-ag-border/80">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Booking ID (AG-2026-...), Customer Name, or Phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-ag-surface/80 border border-ag-border rounded-2xl pl-12 pr-4 py-3 text-xs text-white focus:outline-none focus:border-ag-cyan"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
            {statuses.map((st) => {
              const isSel = (st === 'All Statuses' && !selectedStatus) || selectedStatus === st;
              return (
                <button
                  key={st}
                  onClick={() => setSelectedStatus(st === 'All Statuses' ? '' : st)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    isSel ? 'bg-ag-cyan text-slate-950 shadow-md' : 'bg-ag-surface text-slate-300 hover:text-white'
                  }`}
                >
                  {st}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* BOOKINGS TABLE */}
      {loading ? (
        <div className="h-64 rounded-3xl bg-ag-surface/50 animate-pulse" />
      ) : (
        <div className="glass-panel rounded-3xl overflow-hidden border border-ag-border/80">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-ag-surface/80 text-white font-bold uppercase text-[10px] tracking-wider border-b border-ag-border">
                <tr>
                  <th className="p-4">Booking ID</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Total Amount</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ag-border/50">
                {bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-ag-surface/40 transition-colors">
                    <td className="p-4 font-mono font-bold text-ag-gold">{b.booking_number}</td>
                    <td className="p-4">
                      <span className="font-bold text-white block">{b.customer_name}</span>
                      <span className="text-[10px] text-slate-400">{b.customer_phone}</span>
                    </td>
                    <td className="p-4 font-semibold">{b.booking_type}</td>
                    <td className="p-4 font-bold text-white">${b.total_amount.toFixed(2)}</td>
                    <td className="p-4">
                      <select
                        value={b.status}
                        onChange={(e) => handleStatusChange(b.id, e.target.value as BookingStatus)}
                        className="bg-ag-surface border border-ag-border rounded-lg px-2.5 py-1 text-[11px] font-bold text-white focus:outline-none"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => setSelectedBooking(b)}
                        className="p-2 rounded-lg bg-ag-surface hover:bg-ag-border text-slate-300 hover:text-white"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDownloadPDF(b)}
                        className="p-2 rounded-lg bg-ag-cyan/10 hover:bg-ag-cyan/20 text-ag-cyan"
                        title="Download PDF Receipt"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* DETAIL MODAL */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel max-w-2xl w-full p-8 rounded-3xl space-y-6 border border-ag-cyan/40 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-ag-gold font-mono font-bold block">{selectedBooking.booking_number}</span>
                <h3 className="font-heading text-xl font-bold text-white">Booking Details</h3>
              </div>
              <button onClick={() => setSelectedBooking(null)} className="text-slate-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 rounded-xl bg-ag-surface/60 border border-ag-border">
                <span className="text-slate-400 block text-[10px]">Customer Name</span>
                <span className="font-bold text-white">{selectedBooking.customer_name}</span>
              </div>
              <div className="p-3 rounded-xl bg-ag-surface/60 border border-ag-border">
                <span className="text-slate-400 block text-[10px]">Phone Number</span>
                <span className="font-bold text-white">{selectedBooking.customer_phone}</span>
              </div>
              <div className="p-3 rounded-xl bg-ag-surface/60 border border-ag-border">
                <span className="text-slate-400 block text-[10px]">Email</span>
                <span className="font-bold text-white">{selectedBooking.customer_email || 'N/A'}</span>
              </div>
              <div className="p-3 rounded-xl bg-ag-surface/60 border border-ag-border">
                <span className="text-slate-400 block text-[10px]">Total Amount</span>
                <span className="font-bold text-ag-cyan">${selectedBooking.total_amount.toFixed(2)}</span>
              </div>
            </div>

            {selectedBooking.additional_notes && (
              <div className="p-3 rounded-xl bg-ag-surface/40 border border-ag-border text-xs">
                <span className="text-slate-400 block text-[10px]">Special Notes</span>
                <p className="text-slate-200">{selectedBooking.additional_notes}</p>
              </div>
            )}

            <div className="pt-4 flex justify-between items-center">
              <button
                onClick={() => handleDownloadPDF(selectedBooking)}
                className="px-5 py-2.5 rounded-xl bg-ag-cyan text-slate-950 font-bold text-xs flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download PDF Receipt
              </button>

              <button
                onClick={() => setSelectedBooking(null)}
                className="px-5 py-2.5 rounded-xl bg-ag-surface text-slate-300 text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
