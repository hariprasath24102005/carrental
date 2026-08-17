import {
  Car,
  WashService,
  Booking,
  CreateBookingPayload,
  BusinessSettings,
  DashboardStats,
  BookingStatus
} from '../types/index.js';

const API_BASE_URL = '/api';

/**
 * Helper to retrieve stored Admin JWT token
 */
const getAuthHeaders = () => {
  const token = localStorage.getItem('ag_admin_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

export const api = {
  // CAR FLEET API
  async getCars(params?: Record<string, string>): Promise<Car[]> {
    const queryString = params ? '?' + new URLSearchParams(params).toString() : '';
    const res = await fetch(`${API_BASE_URL}/cars${queryString}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch car fleet');
    return data.data;
  },

  async getCarById(id: string): Promise<Car> {
    const res = await fetch(`${API_BASE_URL}/cars/${id}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch car details');
    return data.data;
  },

  async createCar(carData: Partial<Car>): Promise<Car> {
    const res = await fetch(`${API_BASE_URL}/admin/cars`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(carData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to add car');
    return data.data;
  },

  async updateCar(id: string, carData: Partial<Car>): Promise<Car> {
    const res = await fetch(`${API_BASE_URL}/admin/cars/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(carData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update car');
    return data.data;
  },

  async deleteCar(id: string): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/admin/cars/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to delete car');
  },

  // CAR WASH SERVICES API
  async getWashServices(category?: string): Promise<WashService[]> {
    const url = category ? `${API_BASE_URL}/wash-services?category=${encodeURIComponent(category)}` : `${API_BASE_URL}/wash-services`;
    const res = await fetch(url);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch car wash services');
    return data.data;
  },

  async createWashService(serviceData: Partial<WashService>): Promise<WashService> {
    const res = await fetch(`${API_BASE_URL}/admin/wash-services`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(serviceData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to create wash service');
    return data.data;
  },

  async updateWashService(id: string, serviceData: Partial<WashService>): Promise<WashService> {
    const res = await fetch(`${API_BASE_URL}/admin/wash-services/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(serviceData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update wash service');
    return data.data;
  },

  async deleteWashService(id: string): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/admin/wash-services/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to delete service');
  },

  // UNIFIED BOOKING API
  async createBooking(payload: CreateBookingPayload): Promise<Booking> {
    const res = await fetch(`${API_BASE_URL}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to submit booking');
    return data.data;
  },

  async getBookings(params?: Record<string, string>): Promise<Booking[]> {
    const queryString = params ? '?' + new URLSearchParams(params).toString() : '';
    const res = await fetch(`${API_BASE_URL}/admin/bookings${queryString}`, {
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch bookings');
    return data.data;
  },

  async getBookingById(id: string): Promise<Booking> {
    const res = await fetch(`${API_BASE_URL}/bookings/${id}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch booking');
    return data.data;
  },

  async updateBookingStatus(id: string, status: BookingStatus): Promise<Booking> {
    const res = await fetch(`${API_BASE_URL}/admin/bookings/${id}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update booking status');
    return data.data;
  },

  // BUSINESS SETTINGS API
  async getBusinessSettings(): Promise<BusinessSettings> {
    const res = await fetch(`${API_BASE_URL}/settings`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch settings');
    return data.data;
  },

  async updateBusinessSettings(settings: Partial<BusinessSettings>): Promise<BusinessSettings> {
    const res = await fetch(`${API_BASE_URL}/admin/settings`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(settings),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update business settings');
    return data.data;
  },

  // ADMIN AUTH & DASHBOARD STATS API
  async adminLogin(email: string, password: string): Promise<{ token: string; user: any }> {
    const res = await fetch(`${API_BASE_URL}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Invalid credentials');
    return { token: data.token, user: data.user };
  },

  async getDashboardStats(): Promise<DashboardStats> {
    const res = await fetch(`${API_BASE_URL}/admin/stats`, {
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch dashboard stats');
    return data.stats;
  }
};
