import React, { useState, useEffect } from 'react';
import { Trash2, Plus, Wallet, TrendingUp, TrendingDown, Users, ArrowLeft, History, LogOut, LogIn, Folder, Calendar } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

// FIREBASE IMPORTS
import { auth, provider, db } from './components/firebase';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { collection, addDoc, deleteDoc, doc, query, where, onSnapshot, orderBy } from 'firebase/firestore';

const GlassCard = ({ children, className = "" }) => (
  <div className={`backdrop-blur-xl bg-slate-800/50 border border-slate-700 p-6 rounded-2xl shadow-xl ${className}`}>
    {children}
  </div>
);

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);

  // VIEWS: 'dashboard' | 'monthList' | 'monthDetail' | 'history'
  const [view, setView] = useState('dashboard');

  const [selectedTenant, setSelectedTenant] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null); // Format: "2026-02"

  // Form State
  const [amount, setAmount] = useState('');
  const [tenantName, setTenantName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('income');
  const [entryDate, setEntryDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;
    // REPLACE WITH THIS:
const q = query(collection(db, "transactions"), where("uid", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setTransactions(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, [user]);

  const handleLogin = async () => { try { await signInWithPopup(auth, provider); } catch (error) { console.error(error); } };

  const handleLogout = async () => {
    await signOut(auth);
    setTransactions([]);
  };

  const addTransaction = async (e) => {
    e.preventDefault();
    if (!amount || !description || !entryDate) return;
    if (type === 'income' && !tenantName) return alert("Please enter a tenant name.");

    try {
      const val = parseFloat(amount);
      const finalAmount = type === 'expense' ? -Math.abs(val) : Math.abs(val);

      await addDoc(collection(db, "transactions"), {
        uid: user.uid,
        date: entryDate,
        createdAt: new Date(),
        tenantName: type === 'income' ? tenantName : 'Property Expense',
        description,
        amount: finalAmount,
        type
      });
      setAmount(''); setDescription(''); setEntryDate(new Date().toISOString().split('T')[0]);
    } catch (error) { alert("Error: " + error.message); }
  };

  const deleteTransaction = async (id) => { if (window.confirm("Delete this entry?")) await deleteDoc(doc(db, "transactions", id)); };

  // --- NAVIGATION HELPERS ---
  const openTenantHistory = (name) => { setSelectedTenant(name); setView('history'); };

  const openMonthDetail = (monthKey) => {
    setSelectedMonth(monthKey);
    setView('monthDetail');
  };

  // --- CALCULATIONS (GLOBAL) ---
  const knownTenants = [...new Set(transactions.filter(t => t.type === 'income').map(t => t.tenantName))];
  const total = transactions.reduce((acc, t) => acc + t.amount, 0).toFixed(2);
  const income = transactions.filter(t => t.amount > 0).reduce((acc, t) => acc + t.amount, 0).toFixed(2);
  const expense = Math.abs(transactions.filter(t => t.amount < 0).reduce((acc, t) => acc + t.amount, 0)).toFixed(2);

  const chartData = [{ name: 'Collected', value: parseFloat(income) || 0 }, { name: 'Spent', value: parseFloat(expense) || 0 }];
  const COLORS = ['#10b981', '#ef4444'];

  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Loading...</div>;

  // --- LOGIN SCREEN ---
  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <GlassCard className="max-w-md w-full text-center space-y-6 py-12">
          <div className="bg-indigo-500/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto text-indigo-400"><Wallet size={40} /></div>
          <h1 className="text-3xl font-bold text-white">Property Manager</h1>
          <button onClick={handleLogin} className="w-full bg-white text-slate-900 font-bold py-3 px-6 rounded-lg hover:bg-slate-200 transition flex items-center justify-center gap-2"><LogIn size={20} /> Sign in with Google</button>
        </GlassCard>
      </div>
    );
  }

  // --- VIEW 1: DASHBOARD (HOME) ---
  if (view === 'dashboard') {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-200 font-sans pb-10">
        <div className="max-w-6xl mx-auto px-4 pt-10">
          <header className="mb-8 flex justify-between items-center">
            <div><h1 className="text-3xl font-bold text-white">Dashboard</h1><p className="text-slate-400 text-sm">Welcome back, {user.displayName}</p></div>
            <div className="flex gap-3">
              {/* NEW BUTTON: Go to Monthly Reports */}
              <button onClick={() => setView('monthList')} className="text-white bg-indigo-600 hover:bg-indigo-500 flex items-center gap-2 text-sm px-4 py-2 rounded-lg transition shadow-lg shadow-indigo-500/20">
                <Folder size={18} /> Monthly Reports
              </button>
              <button onClick={handleLogout} className="text-slate-400 hover:text-red-400 flex items-center gap-2 text-sm bg-slate-900/50 px-4 py-2 rounded-lg border border-slate-800 transition"><LogOut size={16} /></button>
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-6 rounded-2xl shadow-2xl text-white">
                <h4 className="text-indigo-200 text-sm font-medium uppercase mb-1">Total Balance</h4>
                <h2 className="text-4xl font-bold">${total}</h2>
                <div className="mt-6 flex gap-4 text-sm">
                  <div><span className="block opacity-60">In</span><span className="font-bold text-emerald-300">+${income}</span></div>
                  <div className="border-l border-white/20 pl-4"><span className="block opacity-60">Out</span><span className="font-bold text-red-300">-${expense}</span></div>
                </div>
              </div>

              <GlassCard>
                <h3 className="font-bold text-lg mb-4 text-white">New Entry</h3>
                <form onSubmit={addTransaction} className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-slate-400 ml-1">Date</label>
                    <input type="date" value={entryDate} onChange={(e) => setEntryDate(e.target.value)} className="w-full bg-slate-900 border border-slate-700 text-white p-3 rounded-lg mt-1 [color-scheme:dark]" />
                  </div>
                  <div className="grid grid-cols-2 gap-2 bg-slate-900 p-1 rounded-lg border border-slate-700">
                    <button type="button" onClick={() => setType('income')} className={`py-2 rounded-md text-sm font-semibold transition-all ${type === 'income' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'}`}>Collect Rent</button>
                    <button type="button" onClick={() => setType('expense')} className={`py-2 rounded-md text-sm font-semibold transition-all ${type === 'expense' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'}`}>Expense</button>
                  </div>
                  {type === 'income' && (
                    <div>
                      <input list="tenant-options" type="text" value={tenantName} onChange={(e) => setTenantName(e.target.value)} placeholder="Tenant Name..." className="w-full bg-slate-900 border border-slate-700 text-white p-3 rounded-lg mt-1" />
                      <datalist id="tenant-options">{knownTenants.map((name, i) => <option key={i} value={name} />)}</datalist>
                    </div>
                  )}
                  <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" className="w-full bg-slate-900 border border-slate-700 text-white p-3 rounded-lg mt-1" />
                  <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount" className="w-full bg-slate-900 border border-slate-700 text-white p-3 rounded-lg mt-1" />
                  <button className={`w-full p-3 rounded-lg font-semibold shadow-lg transition-all flex items-center justify-center gap-2 ${type === 'income' ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-red-600 hover:bg-red-500'}`}><Plus size={20} /> Add Entry</button>
                </form>
              </GlassCard>
            </div>

            <div className="lg:col-span-2 space-y-6">
              <GlassCard className="h-64 flex items-center justify-center">
                {transactions.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={chartData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">{chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index]} />)}</Pie><Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }} /></PieChart></ResponsiveContainer>
                ) : <p className="text-slate-500">No data yet</p>}
              </GlassCard>
              <GlassCard>
                <h3 className="font-bold text-lg mb-4 text-white">Recent Activity</h3>
                <ul className="space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                  {transactions.slice(0, 10).map(t => (
                    <li key={t.id} className="flex justify-between items-center bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${t.amount > 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>{t.amount > 0 ? <Users size={18} /> : <TrendingDown size={18} />}</div>
                        <div>
                          {t.amount > 0 ? <button onClick={() => openTenantHistory(t.tenantName)} className="font-bold text-indigo-400 hover:underline text-left block">{t.tenantName}</button> : <span className="font-bold text-slate-300">Property Expense</span>}
                          <p className="text-xs text-slate-500">{t.description} • {t.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4"><span className={`font-bold ${t.amount > 0 ? 'text-emerald-400' : 'text-red-400'}`}>{t.amount > 0 ? '+' : ''}{t.amount}</span><button onClick={() => deleteTransaction(t.id)} className="text-slate-600 hover:text-red-500"><Trash2 size={16} /></button></div>
                    </li>
                  ))}
                </ul>
              </GlassCard>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- VIEW 2: MONTHLY REPORTS LIST ---
  if (view === 'monthList') {
    // 1. Get all unique months from data (e.g. ["2026-02", "2026-01"])
    const months = [...new Set(transactions.map(t => t.date.substring(0, 7)))].sort().reverse();

    return (
      <div className="min-h-screen bg-slate-950 text-slate-200 font-sans p-6">
        <div className="max-w-4xl mx-auto">
          <button onClick={() => setView('dashboard')} className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition"><ArrowLeft size={20} /> Back to Dashboard</button>
          <header className="mb-8"><h1 className="text-3xl font-bold text-white">Monthly Reports</h1><p className="text-slate-400">Select a month to view details.</p></header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {months.map(month => {
              // Calculate stats for this button preview
              const monthData = transactions.filter(t => t.date.startsWith(month));
              const mTotal = monthData.reduce((acc, t) => acc + t.amount, 0).toFixed(2);
              const [year, m] = month.split('-');
              const dateObj = new Date(year, m - 1);
              const label = dateObj.toLocaleString('default', { month: 'long', year: 'numeric' });

              return (
                <button key={month} onClick={() => openMonthDetail(month)} className="text-left bg-slate-800 hover:bg-slate-700 p-6 rounded-xl border border-slate-700 transition group">
                  <div className="flex justify-between items-start mb-4">
                    <div className="bg-indigo-500/20 p-3 rounded-lg text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition"><Calendar size={24} /></div>
                    <span className={`text-lg font-bold ${mTotal >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>{mTotal >= 0 ? '+' : ''}${mTotal}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white">{label}</h3>
                  <p className="text-sm text-slate-400">{monthData.length} entries</p>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // --- VIEW 3: SPECIFIC MONTH DETAIL ---
  if (view === 'monthDetail') {
    const monthTransactions = transactions.filter(t => t.date.startsWith(selectedMonth));
    const [year, m] = selectedMonth.split('-');
    const label = new Date(year, m - 1).toLocaleString('default', { month: 'long', year: 'numeric' });

    // Monthly Totals
    const mTotal = monthTransactions.reduce((acc, t) => acc + t.amount, 0).toFixed(2);
    const mIncome = monthTransactions.filter(t => t.amount > 0).reduce((acc, t) => acc + t.amount, 0).toFixed(2);
    const mExpense = Math.abs(monthTransactions.filter(t => t.amount < 0).reduce((acc, t) => acc + t.amount, 0)).toFixed(2);

    return (
      <div className="min-h-screen bg-slate-950 text-slate-200 font-sans p-6">
        <div className="max-w-4xl mx-auto">
          <button onClick={() => setView('monthList')} className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition"><ArrowLeft size={20} /> Back to Reports</button>

          <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 mb-8 flex justify-between items-center">
            <div><p className="text-indigo-400 font-bold uppercase text-sm tracking-wider mb-1">Monthly Report</p><h1 className="text-3xl font-bold text-white">{label}</h1></div>
            <div className="text-right">
              <p className="text-slate-400 text-sm mb-1">Net Balance</p>
              <h2 className={`text-4xl font-bold ${mTotal >= 0 ? 'text-white' : 'text-red-400'}`}>${mTotal}</h2>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-emerald-500/10 p-4 rounded-xl border border-emerald-500/20 text-center"><p className="text-emerald-400 text-sm font-bold uppercase">Income</p><p className="text-2xl font-bold text-white">+${mIncome}</p></div>
            <div className="bg-red-500/10 p-4 rounded-xl border border-red-500/20 text-center"><p className="text-red-400 text-sm font-bold uppercase">Expense</p><p className="text-2xl font-bold text-white">-${mExpense}</p></div>
          </div>

          <GlassCard>
            <h3 className="font-bold text-lg mb-4 text-white">Entries</h3>
            <ul className="space-y-3">
              {monthTransactions.map(t => (
                <li key={t.id} className="flex justify-between items-center bg-slate-900 p-4 rounded-xl border border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${t.amount > 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>{t.amount > 0 ? <Users size={18} /> : <TrendingDown size={18} />}</div>
                    <div><p className="font-bold text-slate-200">{t.tenantName || 'Expense'}</p><p className="text-xs text-slate-500">{t.description} • {t.date}</p></div>
                  </div>
                  <span className={`font-bold ${t.amount > 0 ? 'text-emerald-400' : 'text-red-400'}`}>{t.amount > 0 ? '+' : ''}{t.amount}</span>
                </li>
              ))}
            </ul>
          </GlassCard>
        </div>
      </div>
    );
  }

  // --- VIEW 4: TENANT HISTORY (Unchanged) ---
  if (view === 'history') {
    const history = transactions.filter(t => t.tenantName === selectedTenant);
    const totalPaid = history.reduce((acc, t) => acc + t.amount, 0);
    return (
      <div className="min-h-screen bg-slate-950 text-slate-200 font-sans p-6">
        <div className="max-w-4xl mx-auto">
          <button onClick={() => setView('dashboard')} className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition"><ArrowLeft size={20} /> Back to Dashboard</button>
          <header className="flex justify-between items-end mb-8 border-b border-slate-800 pb-6"><div><p className="text-indigo-400 font-bold uppercase text-sm tracking-wider mb-1">Tenant Record</p><h1 className="text-4xl font-bold text-white">{selectedTenant}</h1></div><div className="text-right"><p className="text-slate-400 text-sm">Total Contribution</p><h2 className="text-3xl font-bold text-emerald-400">${totalPaid.toFixed(2)}</h2></div></header>
          <GlassCard>
            <h3 className="font-bold text-lg mb-6 text-white flex items-center gap-2"><History size={20} className="text-slate-400" /> Payment History</h3>
            <div className="space-y-4">{history.map(t => (<div key={t.id} className="flex justify-between items-center bg-slate-900 p-4 rounded-lg border-l-4 border-emerald-500"><div><p className="font-bold text-slate-200">{t.description}</p><p className="text-sm text-slate-500">{t.date}</p></div><span className="font-bold text-xl text-emerald-400">+${t.amount}</span></div>))}</div>
          </GlassCard>
        </div>
      </div>
    );
  }
};

export default App;