import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom'; // Routing magic
import { LayoutDashboard, FileText, Users, Settings, Info, LogOut, Wallet } from 'lucide-react';
import { auth } from './firebase';
import { signOut } from 'firebase/auth';

const Layout = ({ user }) => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        await signOut(auth);
        navigate('/'); // Go back to login
    };

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
        { icon: FileText, label: 'Reports', path: '/reports' },
        { icon: Users, label: 'Tenants', path: '/tenants' },
        { icon: Settings, label: 'Settings', path: '/settings' },
        { icon: Info, label: 'About', path: '/about' },
    ];

    return (
        <div className="min-h-screen bg-slate-950 flex">
            {/* SIDEBAR - Fixed on Desktop */}
            <aside className="w-64 fixed left-0 top-0 h-full border-r border-slate-800 bg-slate-950/50 backdrop-blur-xl z-50 flex flex-col">

                {/* LOGO */}
                <div className="p-6 border-b border-slate-800">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                            <Wallet className="h-6 w-6 text-white" strokeWidth={1.5} />
                        </div>
                        <h1 className="text-xl font-bold text-white font-sans">
                            RentManager
                        </h1>
                    </div>
                </div>

                {/* NAVIGATION LINKS */}
                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) => `
                w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 font-medium
                ${isActive
                                    ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 shadow-sm'
                                    : 'text-slate-400 hover:text-white hover:bg-slate-900'}
              `}
                        >
                            <item.icon className="h-5 w-5" strokeWidth={1.5} />
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

                {/* USER PROFILE & LOGOUT */}
                <div className="p-4 border-t border-slate-800 bg-slate-900/30">
                    <div className="flex items-center gap-3 mb-4 px-2">
                        <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold">
                            {user?.displayName?.charAt(0) || 'U'}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-medium text-white truncate">{user?.displayName}</p>
                            <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors text-sm font-medium"
                    >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* MAIN CONTENT AREA */}
            {/* ml-64 pushes content to the right so it doesn't hide behind sidebar */}
            <main className="flex-1 ml-64 p-8">
                <Outlet context={{ user }} />
            </main>
        </div>
    );
};

export default Layout;