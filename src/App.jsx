import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { BloodDataProvider } from './context/BloodDataContext';
import { ToastProvider } from './context/ToastContext';

// Layouts
import { PublicLayout } from './components/layout/PublicLayout';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { ProtectedRoute } from './components/common/ProtectedRoute';

// Public Pages
import { LandingPage } from './pages/public/LandingPage';
import { HowItWorksPage } from './pages/public/HowItWorksPage';
import { SafetyPrivacyPage } from './pages/public/SafetyPrivacyPage';
import { AboutPage } from './pages/public/AboutPage';
import { NotFoundPage } from './pages/public/NotFoundPage';

// Auth Pages
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { DonorRegisterPage } from './pages/auth/DonorRegisterPage';

// Donor Pages
import { DonorDashboardPage } from './pages/donor/DonorDashboardPage';
import { FindRequestsPage } from './pages/donor/FindRequestsPage';
import { DonationHistoryPage } from './pages/donor/DonationHistoryPage';

// Recipient Pages
import { RecipientDashboardPage } from './pages/recipient/RecipientDashboardPage';
import { CreateRequestPage } from './pages/recipient/CreateRequestPage';
import { EmergencyRequestPage } from './pages/recipient/EmergencyRequestPage';
import { MatchDonorsPage } from './pages/recipient/MatchDonorsPage';

// Admin Pages
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';

// Shared Pages
import { ProfileSettingsPage } from './pages/shared/ProfileSettingsPage';
import { NotificationsPage } from './pages/shared/NotificationsPage';
import { SmartPickupPage } from './pages/shared/SmartPickupPage';

import { SplashScreen } from './components/common/SplashScreen';
import { PushNotificationBanner } from './components/notifications/PushNotificationBanner';

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BloodDataProvider>
          <SplashScreen duration={1500} />
          <PushNotificationBanner onOpenEmail={() => { window.location.href = '/notifications'; }} />
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              
              {/* Public Shell Routes */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<LandingPage />} />
                <Route path="/how-it-works" element={<HowItWorksPage />} />
                <Route path="/safety-privacy" element={<SafetyPrivacyPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/smart-pickup" element={<SmartPickupPage />} />
                <Route path="/pickup-point" element={<SmartPickupPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/register/donor" element={<DonorRegisterPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Route>

              {/* Protected Dashboard Shell Routes */}
              <Route
                element={
                  <ProtectedRoute>
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                {/* Donor Specific */}
                <Route
                  path="/donor/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['donor']}>
                      <DonorDashboardPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/donor/requests"
                  element={
                    <ProtectedRoute allowedRoles={['donor']}>
                      <FindRequestsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/donor/history"
                  element={
                    <ProtectedRoute allowedRoles={['donor']}>
                      <DonationHistoryPage />
                    </ProtectedRoute>
                  }
                />

                {/* Recipient & Hospital Specific */}
                <Route
                  path="/recipient/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['recipient', 'hospital', 'admin']}>
                      <RecipientDashboardPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/recipient/request"
                  element={
                    <ProtectedRoute allowedRoles={['recipient', 'hospital', 'admin']}>
                      <CreateRequestPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/recipient/emergency"
                  element={
                    <ProtectedRoute allowedRoles={['recipient', 'hospital', 'admin', 'donor']}>
                      <EmergencyRequestPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/recipient/match"
                  element={
                    <ProtectedRoute allowedRoles={['recipient', 'hospital', 'admin']}>
                      <MatchDonorsPage />
                    </ProtectedRoute>
                  }
                />

                {/* Admin Specific */}
                <Route
                  path="/admin/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminDashboardPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/requests"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminDashboardPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/users"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminDashboardPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/reports"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminDashboardPage />
                    </ProtectedRoute>
                  }
                />

                {/* Shared User Routes */}
                <Route path="/profile" element={<ProfileSettingsPage />} />
                <Route path="/notifications" element={<NotificationsPage />} />
                <Route path="/smart-pickup" element={<SmartPickupPage />} />
                <Route path="/pickup-point" element={<SmartPickupPage />} />
              </Route>

            </Routes>
          </BrowserRouter>
        </BloodDataProvider>
      </ToastProvider>
    </AuthProvider>
  );
}
