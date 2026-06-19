import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Reports from './pages/Reports.jsx';
import Tenants from './pages/Tenants.jsx';
import Settings from './pages/Settings.jsx';
import About from './pages/About.jsx';

function LandlordApp({ user }) {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout user={user} />}>
          {/* These pages render INSIDE the Layout (Right side) */}
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard user={user} />} />
          <Route path="reports" element={<Reports />} />
          <Route path="tenants" element={<Tenants />} />
          <Route path="settings" element={<Settings />} />
          <Route path="about" element={<About />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default LandlordApp;
