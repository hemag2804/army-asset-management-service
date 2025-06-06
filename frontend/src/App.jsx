import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import Layout from './components/Layout';
import DashboardPage from './pages/DashboardPage';
import BasePage from './pages/BasePage';
import AssetPage from './pages/AssetPage';
import PurchasePage from './pages/PurchasePage';
import TransferPage from './pages/TransferPage';
import AssignmentPage from './pages/AssignmentPage';
import ExpenditurePage from './pages/ExpenditurePage';

export default function App() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Authenticated layout with navbar */}
      <Route element={<Layout />}>
        <Route path="/dashboard" element={
          <ProtectedRoute allowedRoles={['admin', 'commander', 'logistics']}>
            <DashboardPage />
          </ProtectedRoute>
        } />

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

        <Route path="/assignments" element={
          <ProtectedRoute allowedRoles={['admin', 'commander']}>
            <AssignmentPage />
          </ProtectedRoute>
        } />

        <Route path="/expenditures" element={
          <ProtectedRoute allowedRoles={['admin', 'commander']}>
            <ExpenditurePage />
          </ProtectedRoute>
        } />
      </Route>

      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}