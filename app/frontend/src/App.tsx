import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth';

// Admin-Bereich
import LoginPage from '@/pages/admin/LoginPage';
import DashboardPage from '@/pages/admin/DashboardPage';
import BestellungenPage from '@/pages/admin/BestellungenPage';
import TischePage from '@/pages/admin/TischePage';
import SpeisekartePage from '@/pages/admin/SpeisekartePage';
import ReservierungenPage from '@/pages/admin/ReservierungenPage';
import MitarbeiterPage from '@/pages/admin/MitarbeiterPage';
import AdminLayout from '@/layouts/AdminLayout';

// Gäste-Bereich
import BestellenPage from '@/pages/gast/BestellenPage';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const token = useAuthStore((s) => s.token);
  return token ? <>{children}</> : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Routes>
      {/* Öffentliche Routen */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/bestellen/:restaurantId/:tischId" element={<BestellenPage />} />

      {/* Admin-Bereich (geschützt) */}
      <Route
        path="/admin"
        element={
          <PrivateRoute>
            <AdminLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="bestellungen" element={<BestellungenPage />} />
        <Route path="tische" element={<TischePage />} />
        <Route path="speisekarte" element={<SpeisekartePage />} />
        <Route path="reservierungen" element={<ReservierungenPage />} />
        <Route path="mitarbeiter" element={<MitarbeiterPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
}
