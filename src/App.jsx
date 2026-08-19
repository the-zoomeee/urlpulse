import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedLayout, AdminRoute, GuestOnlyLayout } from './components/RouteGuards';
import { ThemeProvider } from './context/ThemeContext';

import Landing from './pages/Landing';
import Support from './pages/Support';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import VerifyEmail from './pages/VerifyEmail';
import Dashboard from './pages/Dashboard';
import JobDetail from './pages/JobDetail';
import SetupGuide from './pages/SetupGuide';
import Account from './pages/Account';
import AdminPanel from './pages/AdminPanel';
import NotFound from './pages/NotFound';
import Report from './pages/Report';

export default function App() {
  return (
    <BrowserRouter>
    <ThemeProvider>
      <AuthProvider>
        <Routes>
          {/* Fully public, not gated by auth state either way - logged-in
              visitors can still read the marketing page or support docs if
              they land here directly (e.g. from a search engine, a shared
              link). Only the CTAs inside them route somewhere auth-aware. */}
          <Route path="/" element={<Landing />} />
          <Route path="/support" element={<Support />} />
          <Route path="/report" element={<Report />} />

          <Route element={<GuestOnlyLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
          </Route>

          {/* Not gated by auth state - a reset/verify link can land on a
              device that's logged in, logged out, or logged in as someone
              else. Both pages handle their own token, independent of
              whatever session (if any) already exists in this browser. */}
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verify-email" element={<VerifyEmail />} />

          <Route element={<ProtectedLayout />}>
            <Route path="/app" element={<Dashboard />} />
            <Route path="/jobs/:id" element={<JobDetail />} />
            <Route path="/guide" element={<SetupGuide />} />
            <Route path="/account" element={<Account />} />

            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<AdminPanel />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}