import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/auth';

import Layout from './components/layout/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Bestellungen from './pages/Bestellungen';
import Speisekarte from './pages/Speisekarte';
import Reservierungen from './pages/Reservierungen';
import Tischplan from './pages/Tischplan';
import Statistiken from './pages/Statistiken';
import Bestellen from './pages/Bestellen';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const token = useAuthStore((s) => s.token);
  return token ? <>{children}</> : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Routes>
      {/* Öffentlich */}
      <Route path="/login" element={<Login />} />
      <Route path="/bestellen/:restaurantId/:tischId" element={<Bestellen />} />

      {/* Geschützter Admin-Bereich */}
      <Route element={<PrivateRoute><Layout /></PrivateRoute>}>
        <Route path="/dashboard"      element={<Dashboard />} />
        <Route path="/bestellungen"   element={<Bestellungen />} />
        <Route path="/speisekarte"    element={<Speisekarte />} />
        <Route path="/reservierungen" element={<Reservierungen />} />
        <Route path="/tischplan"      element={<Tischplan />} />
        <Route path="/statistiken"    element={<Statistiken />} />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
