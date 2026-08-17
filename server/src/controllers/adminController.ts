import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { supabase, isSupabaseConfigured, memoryStore } from '../config/supabase.js';

export const adminLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required.' });
    }

    let user: any = null;

    const queryInput = String(email).toLowerCase().trim();

    if (isSupabaseConfigured && supabase) {
      const { data } = await supabase.from('admin_users').select('*').or(`email.ilike.${queryInput},full_name.ilike.${queryInput}`).single();
      user = data;
    } else {
      user = memoryStore.adminUsers.find(
        u => u.email.toLowerCase() === queryInput || u.full_name.toLowerCase() === queryInput
      );
    }

    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid admin credentials.' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid admin credentials.' });
    }

    const secret = process.env.JWT_SECRET || 'super_secret_anti_gravity_jwt_key_2026';
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.full_name },
      secret,
      { expiresIn: '24h' }
    );

    return res.json({
      success: true,
      message: 'Admin authentication successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role
      }
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message || 'Authentication error' });
  }
};

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const cars = memoryStore.cars;
    const bookings = memoryStore.bookings;
    const washServices = memoryStore.washServices;

    const totalBookings = bookings.length;
    const pendingBookings = bookings.filter(b => b.status === 'Pending').length;
    const confirmedBookings = bookings.filter(b => b.status === 'Confirmed').length;
    const completedBookings = bookings.filter(b => b.status === 'Completed').length;
    const cancelledBookings = bookings.filter(b => b.status === 'Cancelled').length;

    const availableCars = cars.filter(c => c.status === 'Available').length;
    const maintenanceCars = cars.filter(c => c.status === 'Maintenance').length;

    const totalRevenue = bookings
      .filter(b => b.status !== 'Cancelled')
      .reduce((sum, b) => sum + b.total_amount, 0);

    const todayStr = new Date().toISOString().split('T')[0];
    const todayWashAppointments = bookings.filter(b => 
      b.wash_item && b.wash_item.wash_date === todayStr && b.status !== 'Cancelled'
    ).length;

    return res.json({
      success: true,
      stats: {
        totalBookings,
        pendingBookings,
        confirmedBookings,
        completedBookings,
        cancelledBookings,
        availableCars,
        totalCars: cars.length,
        maintenanceCars,
        activeWashServices: washServices.filter(s => s.is_active).length,
        todayWashAppointments,
        totalRevenue: Number(totalRevenue.toFixed(2)),
      }
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message || 'Failed to calculate stats' });
  }
};
