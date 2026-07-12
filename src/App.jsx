import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAdmin } from './contexts/AdminContext';

// Layout shell — always needed, eagerly loaded
import DashboardLayout from './layouts/DashboardLayout';

// Lazy-loaded module pages — each becomes its own split chunk
const Auth               = lazy(() => import('./pages/Auth'));
const Overview           = lazy(() => import('./pages/Overview'));
const ServicesMgmt       = lazy(() => import('./pages/ServicesMgmt'));
const PortfolioMgmt      = lazy(() => import('./pages/PortfolioMgmt'));
const CaseStudiesMgmt    = lazy(() => import('./pages/CaseStudiesMgmt'));
const BlogMgmt           = lazy(() => import('./pages/BlogMgmt'));
const TechMgmt           = lazy(() => import('./pages/TechMgmt'));
const TeamMgmt           = lazy(() => import('./pages/TeamMgmt'));
const TestimonialsMgmt   = lazy(() => import('./pages/TestimonialsMgmt'));
const CareersMgmt        = lazy(() => import('./pages/CareersMgmt'));
const ContactsMgmt       = lazy(() => import('./pages/ContactsMgmt'));
const LeadsMgmt          = lazy(() => import('./pages/LeadsMgmt'));
const ClientPortalMgmt   = lazy(() => import('./pages/ClientPortalMgmt'));
const SettingsMgmt       = lazy(() => import('./pages/SettingsMgmt'));
const UserMgmt           = lazy(() => import('./pages/UserMgmt'));
const AuditLogs          = lazy(() => import('./pages/AuditLogs'));

import { Toaster } from 'sonner';

/** Skeleton fallback shown while a page chunk loads */
function PageSkeleton() {
  return (
    <div className="flex-1 p-6 animate-pulse space-y-4">
      <div className="h-8 bg-gray-700/40 rounded w-1/3" />
      <div className="h-4 bg-gray-700/30 rounded w-2/3" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-32 bg-gray-700/25 rounded-xl" />
        ))}
      </div>
    </div>
  );
}

/** Route guard — redirect to /auth if not authenticated */
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
        <Route
          path="/auth"
          element={
            <Suspense fallback={<div className="min-h-screen bg-gray-900 animate-pulse" />}>
              <Auth />
            </Suspense>
          }
        />

        {/* Protected admin workspace */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Suspense fallback={<PageSkeleton />}>
                  <Routes>
                    <Route path="/"                element={<Overview />} />
                    <Route path="/services"        element={<ServicesMgmt />} />
                    <Route path="/portfolio"       element={<PortfolioMgmt />} />
                    <Route path="/case-studies"    element={<CaseStudiesMgmt />} />
                    <Route path="/blog"            element={<BlogMgmt />} />
                    <Route path="/technologies"    element={<TechMgmt />} />
                    <Route path="/team"            element={<TeamMgmt />} />
                    <Route path="/testimonials"    element={<TestimonialsMgmt />} />
                    <Route path="/careers"         element={<CareersMgmt />} />
                    <Route path="/contacts"        element={<ContactsMgmt />} />
                    <Route path="/leads"           element={<LeadsMgmt />} />
                    <Route path="/client-portal"   element={<ClientPortalMgmt />} />
                    <Route path="/settings"        element={<SettingsMgmt />} />
                    <Route path="/users"           element={<UserMgmt />} />
                    <Route path="/logs"            element={<AuditLogs />} />
                    {/* Catch-all — redirect to dashboard root */}
                    <Route path="*"               element={<Navigate to="/" replace />} />
                  </Routes>
                </Suspense>
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}
