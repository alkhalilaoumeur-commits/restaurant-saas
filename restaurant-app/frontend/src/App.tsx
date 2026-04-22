import { useEffect } from 'react';
import { Routes, Route, Navigate, useParams } from 'react-router-dom';
import { useAuthStore } from './store/auth';
import { useThemeStore } from './store/theme';
import { useAboStore } from './store/abo';
import { useRestaurantDesign } from './hooks/useRestaurantDesign';
import { getLayout } from './lib/layouts';

import Layout from './components/layout/Layout';
import Login from './pages/Login';
import Registrieren from './pages/Registrieren';
import PasswortVergessen from './pages/PasswortVergessen';
import PasswortZuruecksetzen from './pages/PasswortZuruecksetzen';
import Einladung from './pages/Einladung';
import EmailVerifizieren from './pages/EmailVerifizieren';
import RestaurantEmailBestaetigen from './pages/RestaurantEmailBestaetigen';
import Dashboard from './pages/Dashboard';
import Bestellungen from './pages/Bestellungen';
import Speisekarte from './pages/Speisekarte';
import Reservierungen from './pages/Reservierungen';
import Tischplan from './pages/Tischplan';
import Statistiken from './pages/Statistiken';
import Mitarbeiter from './pages/Mitarbeiter';
import BestellenPro from './pages/BestellenPro';
import BestellenQR from './pages/BestellenQR';
import Buchen from './pages/Buchen';
import ReservierungDetail from './pages/ReservierungDetail';
import ReservierungStornieren from './pages/ReservierungStornieren';
import ReservierungUmbuchen from './pages/ReservierungUmbuchen';
import Dienstplan from './pages/Dienstplan';
import Einstellungen from './pages/Einstellungen';
import Gaeste from './pages/Gaeste';
import Bewertungen from './pages/Bewertungen';
import Bewertung from './pages/Bewertung';
import Inventur from './pages/Inventur';
import Warteliste from './pages/Warteliste';
import Erlebnisse from './pages/Erlebnisse';
import ErlebnisDetail from './pages/ErlebnisDetail';
import ErlebnisBestaetigung from './pages/ErlebnisBestaetigung';
import PlanAuswaehlen from './pages/PlanAuswaehlen';

// ─── Login-Guard: nur für eingeloggte User ───────────────────────────────────
function PrivateRoute({ children }: { children: React.ReactNode }) {
  const token = useAuthStore((s) => s.token);
  return token ? <>{children}</> : <Navigate to="/login" replace />;
}

// ─── Plan-Guard: Admin ohne aktiven Plan → Plan-Auswahl ──────────────────────
// Kellner und Küche sind nicht betroffen — die zahlen nicht.
function PlanGuard({ children }: { children: React.ReactNode }) {
  const mitarbeiter = useAuthStore((s) => s.mitarbeiter);
  const { status, geladen } = useAboStore();

  // Nicht-Admins immer durchlassen
  if (!mitarbeiter || mitarbeiter.rolle !== 'admin') return <>{children}</>;

  // Noch nicht geladen → kurz warten (vermeidet Flackern)
  if (!geladen) return null;

  // Nur 'active' gibt Zugang — alles andere → Plan-Auswahl
  if (status !== 'active') {
    return <Navigate to="/plan-auswaehlen" replace />;
  }

  return <>{children}</>;
}

function BestellenRouter() {
  const { restaurantId } = useParams<{ restaurantId: string; tischId: string }>();
  const design = useRestaurantDesign(restaurantId);
  const layout = getLayout(design?.layout_id);

  if (layout.kategorienAnzeige === 'qr-menu') {
    return <BestellenQR />;
  }
  return <BestellenPro />;
}

export default function App() {
  const theme = useThemeStore((s) => s.theme);
  const token = useAuthStore((s) => s.token);
  const { laden, reset } = useAboStore();

  // Theme beim Start anwenden
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Abo-Status laden wenn eingeloggt, zurücksetzen wenn ausgeloggt
  useEffect(() => {
    if (token) {
      laden();
    } else {
      reset();
    }
  }, [token, laden, reset]);

  return (
    <Routes>
      {/* Öffentlich */}
      <Route path="/login" element={<Login />} />
      <Route path="/registrieren" element={<Registrieren />} />
      <Route path="/passwort-vergessen" element={<PasswortVergessen />} />
      <Route path="/passwort-zuruecksetzen/:token" element={<PasswortZuruecksetzen />} />
      <Route path="/einladung/:token" element={<Einladung />} />
      <Route path="/email-verifizieren/:token" element={<EmailVerifizieren />} />
      <Route path="/restaurant-email-bestaetigen/:token" element={<RestaurantEmailBestaetigen />} />
      <Route path="/bestellen/:restaurantId/:tischId" element={<BestellenRouter />} />
      <Route path="/bestellen-pro/:restaurantId/:tischId" element={<BestellenRouter />} />
      <Route path="/bestellen-qr/:restaurantId/:tischId"  element={<BestellenQR />} />
      <Route path="/buchen/:restaurantId" element={<Buchen />} />
      <Route path="/reservierung/:token" element={<ReservierungDetail />} />
      <Route path="/reservierung/:token/stornieren" element={<ReservierungStornieren />} />
      <Route path="/reservierung/:token/aendern" element={<ReservierungUmbuchen />} />
      <Route path="/bewertung/:token" element={<Bewertung />} />
      <Route path="/erlebnis/:restaurantId/:erlebnisId" element={<ErlebnisDetail />} />
      <Route path="/erlebnis-bestaetigung/:token" element={<ErlebnisBestaetigung />} />

      {/* Plan-Auswahl (nach Registrierung, ohne Layout) */}
      <Route path="/plan-auswaehlen" element={<PrivateRoute><PlanAuswaehlen /></PrivateRoute>} />

      {/* Geschützter Admin-Bereich — Plan-Guard prüft ob Abo aktiv */}
      <Route element={<PrivateRoute><PlanGuard><Layout /></PlanGuard></PrivateRoute>}>
        <Route path="/dashboard"      element={<Dashboard />} />
        <Route path="/bestellungen"   element={<Bestellungen />} />
        <Route path="/speisekarte"    element={<Speisekarte />} />
        <Route path="/reservierungen" element={<Reservierungen />} />
        <Route path="/tischplan"      element={<Tischplan />} />
        <Route path="/dienstplan"     element={<Dienstplan />} />
        <Route path="/mitarbeiter"    element={<Mitarbeiter />} />
        <Route path="/gaeste"         element={<Gaeste />} />
        <Route path="/bewertungen"    element={<Bewertungen />} />
        <Route path="/inventur"       element={<Inventur />} />
        <Route path="/warteliste"     element={<Warteliste />} />
        <Route path="/erlebnisse"     element={<Erlebnisse />} />
        <Route path="/statistiken"    element={<Statistiken />} />
        <Route path="/einstellungen"  element={<Einstellungen />} />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
