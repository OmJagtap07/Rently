import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'; // Import Router
import { auth, provider } from './firebase';
import { signInWithPopup, onAuthStateChanged } from 'firebase/auth';
import { Wallet } from 'lucide-react';

// Import Pages
import Layout from './Layout.jsx';
import Dashboard from './Dashboard';
import Reports from './Reports.jsx'; // Make sure these paths match where you saved them!
import Tenants from './Tenants.jsx';
import Settings from './Settings.jsx';
import About from './About.jsx';


function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try { await signInWithPopup(auth, provider); } catch (error) { console.error(error); }
  };

  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Loading...</div>;

  // 1. IF NOT LOGGED IN -> Show Login Page
  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900/50 border border-slate-800 p-8 rounded-2xl text-center backdrop-blur-xl shadow-2xl">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl mb-6 shadow-lg shadow-indigo-500/20">
            <Wallet className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">RentManager</h1>
          <p className="text-slate-400 mb-8">Professional Property Management SaaS</p>
          <button
            onClick={handleLogin}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-6 rounded-lg transition-all shadow-lg hover:shadow-indigo-500/25"
          >
            Sign in with Google
          </button>
        </div>
      </div>
    );
  }

  // 2. IF LOGGED IN -> Show Router with Sidebar Layout
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

export default App;