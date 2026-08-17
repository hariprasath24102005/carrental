import { Request, Response } from 'express';
import { BookingService } from '../services/bookingService.js';
import { PDFService } from '../services/pdfService.js';
import { supabase, isSupabaseConfigured, memoryStore } from '../config/supabase.js';

export const createBooking = async (req: Request, res: Response) => {
  try {
    const payload = req.body;
    const booking = await BookingService.createBooking(payload);
    return res.status(201).json({
      success: true,
      message: `Booking created successfully! Booking Number: ${booking.booking_number}`,
      data: booking,
    });
  } catch (err: any) {
    return res.status(400).json({
      success: false,
      error: err.message || 'Failed to process booking',
    });
  }
};

export const getBookings = async (req: Request, res: Response) => {
  try {
    const { status, type, search } = req.query;

    if (isSupabaseConfigured && supabase) {
      let query = supabase.from('bookings').select('*, booking_items(*)').order('created_at', { ascending: false });
      if (status) query = query.eq('status', String(status));
      if (type) query = query.eq('booking_type', String(type));

      const { data, error } = await query;
      if (error) throw error;
      return res.json({ success: true, count: data.length, data });
    } else {
      let list = [...memoryStore.bookings];
      if (status) list = list.filter(b => b.status.toLowerCase() === String(status).toLowerCase());
      if (type) list = list.filter(b => b.booking_type.toLowerCase() === String(type).toLowerCase());
      if (search) {
        const term = String(search).toLowerCase();
        list = list.filter(b => 
          b.booking_number.toLowerCase().includes(term) ||
          b.customer_name.toLowerCase().includes(term) ||
          b.customer_phone.includes(term)
        );
      }
      return res.json({ success: true, count: list.length, data: list });
    }
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message || 'Failed to fetch bookings' });
  }
};

export const getBookingById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('bookings')
        .select('*, booking_items(*)')
        .or(`id.eq.${id},booking_number.eq.${id}`)
        .single();

      if (error || !data) {
        return res.status(404).json({ success: false, error: 'Booking not found' });
      }
      return res.json({ success: true, data });
    } else {
      const booking = memoryStore.bookings.find(b => b.id === id || b.booking_number === id);
      if (!booking) {
        return res.status(404).json({ success: false, error: 'Booking not found' });
      }
      return res.json({ success: true, data: booking });
    }
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message || 'Failed to retrieve booking' });
  }
};

export const updateBookingStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['Pending', 'Confirmed', 'In Progress', 'Completed', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
    }

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('bookings').update({ status }).eq('id', id).select().single();
      if (error) throw error;
      return res.json({ success: true, message: `Booking status updated to ${status}`, data });
    } else {
      const booking = memoryStore.bookings.find(b => b.id === id || b.booking_number === id);
      if (!booking) {
        return res.status(404).json({ success: false, error: 'Booking not found' });
      }
      booking.status = status;
      return res.json({ success: true, message: `Booking status updated to ${status}`, data: booking });
    }
  } catch (err: any) {
    return res.status(400).json({ success: false, error: err.message || 'Failed to update booking status' });
  }
};

export const downloadBookingReceiptPDF = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    let booking = memoryStore.bookings.find(b => b.id === id || b.booking_number === id);

    if (!booking && isSupabaseConfigured && supabase) {
      const { data } = await supabase.from('bookings').select('*, booking_items(*)').or(`id.eq.${id},booking_number.eq.${id}`).single();
      if (data) booking = data as any;
    }

    if (!booking) {
      return res.status(404).json({ success: false, error: 'Booking not found' });
    }

    const pdfBuffer = PDFService.generateBookingReceiptPDF(booking, memoryStore.businessSettings);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Receipt_${booking.booking_number}.pdf`);
    return res.send(pdfBuffer);
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message || 'Failed to generate PDF receipt' });
  }
};
