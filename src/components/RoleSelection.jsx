import React, { useState } from 'react';
import { Building2, Home, CheckCircle2, ArrowRight } from 'lucide-react';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';

const RoleSelection = ({ user }) => {
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);

  const handleRoleSelection = async (role) => {
    setSelectedRole(role);
    setLoading(true);
    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        role: role,
        onboardingCompleted: true,
        updatedAt: serverTimestamp()
      });
      // The parent component (App.jsx) listening via onSnapshot will automatically re-render
    } catch (error) {
      console.error("Error updating user role:", error);
      setLoading(false);
      setSelectedRole(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl w-full text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
          Welcome to RentManager!
        </h1>
        <p className="text-xl text-slate-400">
          How would you like to use the platform?
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-4xl w-full">
        {/* Landlord Card */}
        <button
          onClick={() => handleRoleSelection('landlord')}
          disabled={loading}
          className={`relative group text-left p-8 rounded-3xl border transition-all duration-300 ${
            selectedRole === 'landlord'
              ? 'bg-indigo-600/10 border-indigo-500 shadow-[0_0_30px_rgba(99,102,241,0.2)]'
              : 'bg-slate-900/50 border-slate-800 hover:border-indigo-500/50 hover:bg-slate-800/50'
          }`}
        >
          {selectedRole === 'landlord' && (
            <div className="absolute top-6 right-6">
              <CheckCircle2 className="w-6 h-6 text-indigo-400" />
            </div>
          )}
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-6 text-indigo-400 group-hover:scale-110 transition-transform">
            <Building2 className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-3 flex items-center">
            I am a Landlord
            <ArrowRight className="w-5 h-5 ml-2 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-indigo-400" />
          </h3>
          <ul className="space-y-3 text-slate-400">
            <li className="flex items-center">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mr-3" />
              Manage multiple properties
            </li>
            <li className="flex items-center">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mr-3" />
              Track rent and automated payments
            </li>
            <li className="flex items-center">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mr-3" />
              Invite and manage tenants
            </li>
          </ul>
        </button>

        {/* Tenant Card */}
        <button
          onClick={() => handleRoleSelection('tenant')}
          disabled={loading}
          className={`relative group text-left p-8 rounded-3xl border transition-all duration-300 ${
            selectedRole === 'tenant'
              ? 'bg-emerald-600/10 border-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.2)]'
              : 'bg-slate-900/50 border-slate-800 hover:border-emerald-500/50 hover:bg-slate-800/50'
          }`}
        >
          {selectedRole === 'tenant' && (
            <div className="absolute top-6 right-6">
              <CheckCircle2 className="w-6 h-6 text-emerald-400" />
            </div>
          )}
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-6 text-emerald-400 group-hover:scale-110 transition-transform">
            <Home className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-3 flex items-center">
            I am a Tenant
            <ArrowRight className="w-5 h-5 ml-2 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-emerald-400" />
          </h3>
          <ul className="space-y-3 text-slate-400">
            <li className="flex items-center">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-3" />
              Join existing properties
            </li>
            <li className="flex items-center">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-3" />
              View and pay rent online
            </li>
            <li className="flex items-center">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-3" />
              Submit maintenance requests
            </li>
          </ul>
        </button>
      </div>
    </div>
  );
};

export default RoleSelection;
