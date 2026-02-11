import React, { useState, } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/all-ui';
import { User, Bell, Shield, Mail } from 'lucide-react';
import { auth } from './firebase';

const Settings = () => {
    const user = auth.currentUser;

    // Persist state in LocalStorage so it feels "real"
    const [notifications, setNotifications] = useState(
        localStorage.getItem('rently_notif') === 'true'
    );

    const toggleNotif = () => {
        const newState = !notifications;
        setNotifications(newState);
        localStorage.setItem('rently_notif', newState);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold text-white">Settings</h1>

            {/* PROFILE CARD */}
            <Card>
                <CardHeader><CardTitle className="flex gap-2 items-center text-white"><User className="text-indigo-400" /> Profile</CardTitle></CardHeader>
                <CardContent className="flex items-center gap-6">
                    <img src={user?.photoURL} alt="Profile" className="w-20 h-20 rounded-full border-4 border-slate-800" />
                    <div>
                        <h2 className="text-2xl font-bold text-white">{user?.displayName}</h2>
                        <p className="text-slate-400 flex items-center gap-2 mt-1"><Mail size={16} /> {user?.email}</p>
                        <div className="mt-3 inline-block px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-xs font-bold border border-emerald-500/30">
                            PRO ACCOUNT
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* PREFERENCES */}
            <Card>
                <CardHeader><CardTitle className="flex gap-2 items-center text-white"><Bell className="text-indigo-400" /> Preferences</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
                        <div>
                            <p className="text-white font-medium">Email Notifications</p>
                            <p className="text-sm text-slate-400">Receive monthly summaries</p>
                        </div>
                        {/* Custom Toggle Switch */}
                        <button
                            onClick={toggleNotif}
                            className={`w-12 h-6 rounded-full transition-colors relative ${notifications ? 'bg-indigo-600' : 'bg-slate-700'}`}
                        >
                            <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${notifications ? 'left-7' : 'left-1'}`}></div>
                        </button>
                    </div>
                </CardContent>
            </Card>

            {/* SECURITY */}
            <Card>
                <CardHeader><CardTitle className="flex gap-2 items-center text-white"><Shield className="text-indigo-400" /> Security</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="p-4 border border-slate-800 rounded bg-slate-900/30">
                        <p className="text-sm text-slate-400 mb-1">Auth Provider</p>
                        <p className="text-white font-mono">Google OAuth 2.0</p>
                    </div>
                    <div className="p-4 border border-slate-800 rounded bg-slate-900/30">
                        <p className="text-sm text-slate-400 mb-1">User ID</p>
                        <p className="text-white font-mono text-xs">{user?.uid}</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default Settings;