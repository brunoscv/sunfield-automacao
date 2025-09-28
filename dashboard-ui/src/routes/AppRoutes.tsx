import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthService } from '../services';

// Layout
import DashboardLayout from '../components/layout/DashboardLayout';

// Pages
import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import UsersPage from '../pages/UsersPage';
import MatrizesPage from '../pages/MatrizesPage';
import FiliaisPage from '../pages/FiliaisPage';
import FilesPage from '../pages/FilesPage';
import ReportsPage from '../pages/ReportsPage';

// Componente para rotas protegidas
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = AuthService.isAuthenticated();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Componente para redirecionar usuários autenticados
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = AuthService.isAuthenticated();
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Rota pública - Login */}
      <Route 
        path="/login" 
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        } 
      />
      
      {/* Rotas protegidas - Dashboard */}
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="matrizes" element={<MatrizesPage />} />
        <Route path="filiais" element={<FiliaisPage />} />
        <Route path="files" element={<FilesPage />} />
        <Route path="reports" element={<ReportsPage />} />
      </Route>
      
      {/* Rota de fallback */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes;