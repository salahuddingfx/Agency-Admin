import { Routes, Route, Navigate } from 'react-router-dom';
import { useAdmin } from './contexts/AdminContext';

// Layout shell
import DashboardLayout from './layouts/DashboardLayout';

// Modules pages
import Auth from './pages/Auth';
import Overview from './pages/Overview';
import ServicesMgmt from './pages/ServicesMgmt';
import PortfolioMgmt from './pages/PortfolioMgmt';
import CaseStudiesMgmt from './pages/CaseStudiesMgmt';
import BlogMgmt from './pages/BlogMgmt';
import TechMgmt from './pages/TechMgmt';
import TeamMgmt from './pages/TeamMgmt';
import TestimonialsMgmt from './pages/TestimonialsMgmt';
import CareersMgmt from './pages/CareersMgmt';
import ContactsMgmt from './pages/ContactsMgmt';
import LeadsMgmt from './pages/LeadsMgmt';
import ClientPortalMgmt from './pages/ClientPortalMgmt';
import SettingsMgmt from './pages/SettingsMgmt';
import UserMgmt from './pages/UserMgmt';
import AuditLogs from './pages/AuditLogs';

import { Toaster } from 'sonner';

// Protected Route Gating Middleware representation
function ProtectedRoute({ children }) {
  const { auth } = useAdmin();
  return auth.isLoggedIn ? children : <Navigate to="/auth" replace />;
}

export default function App() {
  return (
    <>
      <Toaster position="top-right" richColors />
      <Routes>
      {/* Auth module route */}
      <Route path="/auth" element={<Auth />} />

      {/* Protected Sandbox workspace layout routes */}
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Routes>
                <Route path="/" element={<Overview />} />
                <Route path="/services" element={<ServicesMgmt />} />
                <Route path="/portfolio" element={<PortfolioMgmt />} />
                <Route path="/case-studies" element={<CaseStudiesMgmt />} />
                <Route path="/blog" element={<BlogMgmt />} />
                <Route path="/technologies" element={<TechMgmt />} />
                <Route path="/team" element={<TeamMgmt />} />
                <Route path="/testimonials" element={<TestimonialsMgmt />} />
                <Route path="/careers" element={<CareersMgmt />} />
                <Route path="/contacts" element={<ContactsMgmt />} />
                <Route path="/leads" element={<LeadsMgmt />} />
                <Route path="/client-portal" element={<ClientPortalMgmt />} />
                <Route path="/settings" element={<SettingsMgmt />} />
                <Route path="/users" element={<UserMgmt />} />
                <Route path="/logs" element={<AuditLogs />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
    </>
  );
}
