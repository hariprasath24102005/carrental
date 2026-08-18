import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Public Pages
import { Home } from './pages/public/Home';
import { CarsPage } from './pages/public/CarsPage';
import { CarDetailPage } from './pages/public/CarDetailPage';
import { WashingServicesPage } from './pages/public/WashingServicesPage';
import { BookingPage } from './pages/public/BookingPage';
import { BookingConfirmationPage } from './pages/public/BookingConfirmationPage';
import { AboutPage } from './pages/public/AboutPage';
import { ContactPage } from './pages/public/ContactPage';
import { TermsPage } from './pages/public/TermsPage';
import { PrivacyPage } from './pages/public/PrivacyPage';


// Admin Pages
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminCars } from './pages/admin/AdminCars';
import { AdminServices } from './pages/admin/AdminServices';
import { AdminBookings } from './pages/admin/AdminBookings';
import { AdminSettings } from './pages/admin/AdminSettings';

// Scroll to top helper
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Protected Admin Route Component
const ProtectedAdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div className="pt-32 text-center text-slate-400">Verifying admin session...</div>;
  if (!isAuthenticated) return <Navigate to="/admin/login" replace />;
  return <>{children}</>;
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <div className="flex flex-col min-h-screen bg-ag-dark text-slate-100">
          <Navbar />
          
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/cars" element={<CarsPage />} />
              <Route path="/cars/:id" element={<CarDetailPage />} />
              <Route path="/services" element={<WashingServicesPage />} />
              <Route path="/booking" element={<BookingPage />} />
              <Route path="/booking/confirmation/:id" element={<BookingConfirmationPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />

              {/* ADMIN AUTH & PROTECTED ROUTES */}
              <Route path="/admin/login" element={<AdminLoginPage />} />
              
              <Route
                path="/admin"
                element={
                  <ProtectedAdminRoute>
                    <AdminDashboard />
                  </ProtectedAdminRoute>
                }
              />
              <Route
                path="/admin/cars"
                element={
                  <ProtectedAdminRoute>
                    <AdminCars />
                  </ProtectedAdminRoute>
                }
              />
              <Route
                path="/admin/services"
                element={
                  <ProtectedAdminRoute>
                    <AdminServices />
                  </ProtectedAdminRoute>
                }
              />
              <Route
                path="/admin/bookings"
                element={
                  <ProtectedAdminRoute>
                    <AdminBookings />
                  </ProtectedAdminRoute>
                }
              />
              <Route
                path="/admin/settings"
                element={
                  <ProtectedAdminRoute>
                    <AdminSettings />
                  </ProtectedAdminRoute>
                }
              />

              {/* FALLBACK REDIRECT */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
