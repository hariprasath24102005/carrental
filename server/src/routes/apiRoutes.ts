import { Router } from 'express';
import { authenticateAdmin } from '../middleware/auth.js';
import { getCars, getCarById, createCar, updateCar, deleteCar } from '../controllers/carController.js';
import { getWashServices, createWashService, updateWashService, deleteWashService } from '../controllers/serviceController.js';
import { createBooking, getBookings, getBookingById, updateBookingStatus, downloadBookingReceiptPDF } from '../controllers/bookingController.js';
import { adminLogin, getDashboardStats } from '../controllers/adminController.js';
import { getBusinessSettings, updateBusinessSettings } from '../controllers/settingsController.js';

const router = Router();

// PUBLIC CAR FLEET ROUTES
router.get('/cars', getCars);
router.get('/cars/:id', getCarById);

// PUBLIC CAR WASH SERVICES ROUTES
router.get('/wash-services', getWashServices);

// PUBLIC UNIFIED BOOKING ROUTES
router.post('/bookings', createBooking);
router.get('/bookings/:id', getBookingById);
router.get('/bookings/:id/receipt', downloadBookingReceiptPDF);

// PUBLIC BUSINESS SETTINGS
router.get('/settings', getBusinessSettings);

// ADMIN AUTHENTICATION
router.post('/admin/login', adminLogin);

// PROTECTED ADMIN ROUTES
router.get('/admin/stats', authenticateAdmin, getDashboardStats);
router.post('/admin/cars', authenticateAdmin, createCar);
router.put('/admin/cars/:id', authenticateAdmin, updateCar);
router.delete('/admin/cars/:id', authenticateAdmin, deleteCar);

router.post('/admin/wash-services', authenticateAdmin, createWashService);
router.put('/admin/wash-services/:id', authenticateAdmin, updateWashService);
router.delete('/admin/wash-services/:id', authenticateAdmin, deleteWashService);

router.get('/admin/bookings', authenticateAdmin, getBookings);
router.patch('/admin/bookings/:id/status', authenticateAdmin, updateBookingStatus);

router.put('/admin/settings', authenticateAdmin, updateBusinessSettings);

export default router;
