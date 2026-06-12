import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import './index.css';
import ErrorBoundary from './components/ErrorBoundary';
import Layout from './components/Layout';
import { ToastProvider } from './components/Toast';
import { AuthProvider } from './hooks/useAuth';
import ProtectedRoute from './routes/ProtectedRoute';
import Astrologers from './pages/Astrologers';
import Consultations from './pages/Consultations';
import Customers from './pages/Customers';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <ToastProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route element={<ProtectedRoute />}>
                <Route element={<Layout />}>
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/astrologers" element={<Astrologers />} />
                  <Route path="/customers" element={<Customers />} />
                  <Route path="/consultations" element={<Consultations />} />
                </Route>
              </Route>
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ToastProvider>
    </ErrorBoundary>
  </React.StrictMode>,
);
