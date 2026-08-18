import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { downloadBookingReceiptPDFClient } from '../../utils/pdfGenerator';
import { Booking, BookingStatus, BusinessSettings } from '../../types';
import { Search, Download, Eye, Calendar, User, Phone, Mail, MapPin, X, Car, Sparkles, FileText, CheckCircle2 } from 'lucide-react';

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
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 bg-slate-50 text-slate-800">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs text-red-600 font-bold uppercase tracking-widest block">Unified Reservations</span>
          <h1 className="font-heading text-3xl sm:text-4xl font-black text-slate-900 uppercase tracking-tight">
            BOOKING MANAGEMENT
          </h1>
        </div>
      </div>

      {/* FILTER STRIP */}
      <div className="bg-white p-6 rounded-3xl space-y-4 border border-slate-200 shadow-xl shadow-slate-200/50">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Booking ID (AG-2026-...), Customer Name, or Phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-3 text-xs text-slate-900 font-medium focus:outline-none focus:border-red-600 focus:bg-white"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1">
            {statuses.map((st) => {
              const isSel = (st === 'All Statuses' && !selectedStatus) || selectedStatus === st;
              return (
                <button
                  key={st}
                  onClick={() => setSelectedStatus(st === 'All Statuses' ? '' : st)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    isSel ? 'bg-red-600 text-white shadow-md shadow-red-600/20' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {st}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* BOOKINGS TABLE (HIGH-VISIBILITY BLACK ON WHITE) */}
      {loading ? (
        <div className="h-64 rounded-3xl bg-slate-200/60 animate-pulse" />
      ) : (
        <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-xl shadow-slate-200/50">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-800">
              <thead className="bg-slate-100 text-slate-900 font-black uppercase text-[11px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="p-4">Booking ID</th>
                  <th className="p-4">Customer Info</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Total Amount</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {bookings.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-500 font-medium">
                      No bookings found matching your search.
                    </td>
                  </tr>
                ) : (
                  bookings.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 font-mono font-bold text-red-600 text-sm">{b.booking_number}</td>
                      <td className="p-4">
                        <span className="font-bold text-slate-900 text-sm block">{b.customer_name}</span>
                        <span className="text-xs text-slate-600 font-medium">{b.customer_phone}</span>
                      </td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-800 border border-slate-200">
                          {b.booking_type}
                        </span>
                      </td>
                      <td className="p-4 font-black text-slate-900 text-sm">${b.total_amount.toFixed(2)}</td>
                      <td className="p-4">
                        <select
                          value={b.status}
                          onChange={(e) => handleStatusChange(b.id, e.target.value as BookingStatus)}
                          className={`border rounded-xl px-3 py-1.5 text-xs font-bold focus:outline-none cursor-pointer ${
                            b.status === 'Confirmed'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                              : b.status === 'Pending'
                              ? 'bg-amber-50 text-amber-700 border-amber-300'
                              : b.status === 'Completed'
                              ? 'bg-blue-50 text-blue-700 border-blue-300'
                              : 'bg-rose-50 text-rose-700 border-rose-300'
                          }`}
                        >
                          <option value="Pending" className="bg-white text-slate-900">Pending</option>
                          <option value="Confirmed" className="bg-white text-slate-900">Confirmed</option>
                          <option value="In Progress" className="bg-white text-slate-900">In Progress</option>
                          <option value="Completed" className="bg-white text-slate-900">Completed</option>
                          <option value="Cancelled" className="bg-white text-slate-900">Cancelled</option>
                        </select>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => setSelectedBooking(b)}
                          className="p-2.5 rounded-xl bg-slate-100 hover:bg-red-600 hover:text-white text-slate-800 transition-all border border-slate-200 font-bold"
                          title="View Full Booking Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDownloadPDF(b)}
                          className="p-2.5 rounded-xl bg-red-50 hover:bg-red-600 hover:text-white text-red-600 transition-all border border-red-200 font-bold"
                          title="Download PDF Receipt"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* RICH BOOKING DETAIL MODAL */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-2xl w-full p-6 sm:p-8 rounded-3xl space-y-6 border border-slate-200 shadow-2xl max-h-[90vh] overflow-y-auto text-slate-800">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div>
                <span className="text-xs text-red-600 font-mono font-bold block uppercase tracking-wider">{selectedBooking.booking_number}</span>
                <h3 className="font-heading text-2xl font-black text-slate-900 uppercase">FULL BOOKING DETAILS</h3>
              </div>
              <button
                onClick={() => setSelectedBooking(null)}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* CUSTOMER INFORMATION CARD */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-4 h-4 text-red-600" /> Customer Information
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 text-[10px] block font-semibold">Full Name</span>
                  <span className="font-bold text-slate-900 text-sm">{selectedBooking.customer_name}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 text-[10px] block font-semibold">Phone Number</span>
                  <span className="font-bold text-slate-900 text-sm">{selectedBooking.customer_phone}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 text-[10px] block font-semibold">Email Address</span>
                  <span className="font-medium text-slate-800">{selectedBooking.customer_email || 'N/A'}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 text-[10px] block font-semibold">Delivery Address</span>
                  <span className="font-medium text-slate-800">{selectedBooking.customer_address || 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* RENTAL DETAILS (IF APPLICABLE) */}
            {selectedBooking.rental_item && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Car className="w-4 h-4 text-red-600" /> Car Rental Details
                </h4>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                  <div className="flex justify-between items-center font-bold text-slate-900">
                    <span>{selectedBooking.rental_item.car?.brand} {selectedBooking.rental_item.car?.name}</span>
                    <span className="text-red-600">{selectedBooking.rental_item.rental_days} Days</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 pt-2 border-t border-slate-200">
                    <div>Pickup: <strong>{selectedBooking.rental_item.pickup_date} @ {selectedBooking.rental_item.pickup_time}</strong></div>
                    <div>Return: <strong>{selectedBooking.rental_item.return_date} @ {selectedBooking.rental_item.return_time}</strong></div>
                  </div>
                </div>
              </div>
            )}

            {/* WASH DETAILS (IF APPLICABLE) */}
            {selectedBooking.wash_item && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" /> Car Wash Detailing Details
                </h4>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                  <div className="flex justify-between items-center font-bold text-slate-900">
                    <span>{selectedBooking.wash_item.service?.name}</span>
                    <span className="text-amber-600">${selectedBooking.wash_item.service_price.toFixed(2)}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 pt-2 border-t border-slate-200">
                    <div>Appointment Date: <strong>{selectedBooking.wash_item.wash_date}</strong></div>
                    <div>Time Slot: <strong>{selectedBooking.wash_item.wash_time_slot} Slot</strong></div>
                    <div>Vehicle Type: <strong>{selectedBooking.wash_item.vehicle_type}</strong></div>
                    <div>Registration: <strong>{selectedBooking.wash_item.vehicle_registration}</strong></div>
                  </div>
                </div>
              </div>
            )}

            {/* NOTES */}
            {selectedBooking.additional_notes && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                <span className="text-slate-500 font-bold block text-[10px]">Customer Notes</span>
                <p className="text-slate-800 font-medium">{selectedBooking.additional_notes}</p>
              </div>
            )}

            {/* FINANCIAL SUMMARY */}
            <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold">${selectedBooking.subtotal.toFixed(2)}</span>
              </div>
              {selectedBooking.discount_amount > 0 && (
                <div className="flex justify-between text-amber-600 font-bold">
                  <span>Bundle Discount (5%)</span>
                  <span>-${selectedBooking.discount_amount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Estimated Tax (8.5%)</span>
                <span className="font-bold">${selectedBooking.tax_amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200 text-sm font-black text-slate-900">
                <span>Total Amount Paid</span>
                <span className="text-red-600 font-heading text-xl">${selectedBooking.total_amount.toFixed(2)}</span>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-between items-center">
              <button
                onClick={() => handleDownloadPDF(selectedBooking)}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black text-xs flex items-center justify-center gap-2 uppercase tracking-wider shadow-md shadow-red-600/20"
              >
                <Download className="w-4 h-4" />
                Download PDF Receipt
              </button>

              <button
                onClick={() => setSelectedBooking(null)}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs"
              >
                Close Window
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
