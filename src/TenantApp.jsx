import React from 'react';
import { LogOut, Home } from 'lucide-react';
import { auth } from './config/firebase';

function TenantApp({ user }) {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-900/50 border border-slate-800 p-8 rounded-2xl text-center backdrop-blur-xl shadow-2xl">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl mb-6 shadow-lg shadow-emerald-500/20">
          <Home className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-4">Tenant Portal</h1>
        <p className="text-slate-400 mb-8 text-lg">Coming Soon</p>
        
        <div className="animate-pulse bg-slate-800/50 h-32 w-full rounded-xl mb-8 flex items-center justify-center border border-slate-700">
           <span className="text-slate-500 text-sm">Features under development</span>
        </div>
        
        <button
          onClick={() => auth.signOut()}
          className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold py-3 px-6 rounded-lg transition-all border border-slate-700 shadow-lg hover:shadow-slate-800/50"
        >
          <LogOut className="h-5 w-5" />
          Sign Out
        </button>
      </div>
    </div>
  );
}

export default TenantApp;
