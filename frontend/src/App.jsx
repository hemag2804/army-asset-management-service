import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { useAuth } from './context/AuthContext';
import Dashboard from './pages/Dashboard';
import BasePage from './pages/BasePage';
import AssetPage from './pages/AssetPage';
import ProtectedRoute from './components/ProtectedRoute';
import PurchasePage from './pages/PurchasePage';
import TransferPage from './pages/TransferPage';

export default function App() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
      <Route path="/bases" element={
      <ProtectedRoute allowedRoles={['admin']}>
          <BasePage />
        </ProtectedRoute>
      } />

      <Route path="/assets" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <AssetPage />
        </ProtectedRoute>
      } />
      <Route path="/purchases" element={
        <ProtectedRoute allowedRoles={['admin', 'logistics']}>
          <PurchasePage />
        </ProtectedRoute>
      } />
      <Route path="/transfers" element={
        <ProtectedRoute allowedRoles={['admin', 'commander']}>
          <TransferPage />
        </ProtectedRoute>
      } />

      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}