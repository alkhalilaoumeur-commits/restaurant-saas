import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/auth';
import { useThemeStore } from './store/theme';

import Layout from './components/layout/Layout';
import Login from './pages/Login';
import Registrieren from './pages/Registrieren';
import PasswortVergessen from './pages/PasswortVergessen';
import PasswortZuruecksetzen from './pages/PasswortZuruecksetzen';
import Einladung from './pages/Einladung';
import EmailVerifizieren from './pages/EmailVerifizieren';
import Dashboard from './pages/Dashboard';
import Bestellungen from './pages/Bestellungen';
import Speisekarte from './pages/Speisekarte';
import Reservierungen from './pages/Reservierungen';
import Tischplan from './pages/Tischplan';
import Statistiken from './pages/Statistiken';
import Mitarbeiter from './pages/Mitarbeiter';
import BestellenPro from './pages/BestellenPro';
import Buchen from './pages/Buchen';
import ReservierungDetail from './pages/ReservierungDetail';
import ReservierungStornieren from './pages/ReservierungStornieren';
import ReservierungUmbuchen from './pages/ReservierungUmbuchen';
import Dienstplan from './pages/Dienstplan';
import Einstellungen from './pages/Einstellungen';
import Gaeste from './pages/Gaeste';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const token = useAuthStore((s) => s.token);
  return token ? <>{children}</> : <Navigate to="/login" replace />;
}

export default function App() {
  // Theme beim Start aus localStorage laden und auf <html> anwenden
  const theme = useThemeStore((s) => s.theme);
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <Routes>
      {/* Öffentlich */}
      <Route path="/login" element={<Login />} />
      <Route path="/registrieren" element={<Registrieren />} />
      <Route path="/passwort-vergessen" element={<PasswortVergessen />} />
      <Route path="/passwort-zuruecksetzen/:token" element={<PasswortZuruecksetzen />} />
      <Route path="/einladung/:token" element={<Einladung />} />
      <Route path="/email-verifizieren/:token" element={<EmailVerifizieren />} />
      <Route path="/bestellen/:restaurantId/:tischId" element={<BestellenPro />} />
      <Route path="/bestellen-pro/:restaurantId/:tischId" element={<BestellenPro />} />
      <Route path="/buchen/:restaurantId" element={<Buchen />} />
      <Route path="/reservierung/:token" element={<ReservierungDetail />} />
      <Route path="/reservierung/:token/stornieren" element={<ReservierungStornieren />} />
      <Route path="/reservierung/:token/aendern" element={<ReservierungUmbuchen />} />

      {/* Geschützter Admin-Bereich */}
      <Route element={<PrivateRoute><Layout /></PrivateRoute>}>
        <Route path="/dashboard"      element={<Dashboard />} />
        <Route path="/bestellungen"   element={<Bestellungen />} />
        <Route path="/speisekarte"    element={<Speisekarte />} />
        <Route path="/reservierungen" element={<Reservierungen />} />
        <Route path="/tischplan"      element={<Tischplan />} />
        <Route path="/dienstplan"      element={<Dienstplan />} />
        <Route path="/mitarbeiter"     element={<Mitarbeiter />} />
        <Route path="/gaeste"          element={<Gaeste />} />
        <Route path="/statistiken"    element={<Statistiken />} />
        <Route path="/einstellungen"  element={<Einstellungen />} />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
