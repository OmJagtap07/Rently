import React, { useState, useEffect } from 'react';
import { Plus, TrendingUp, TrendingDown, Wallet, LogOut, Trash2 } from 'lucide-react'; // Added Trash2
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, Button } from './components/ui/all-ui';
import { auth, db } from './firebase';
import { signOut } from 'firebase/auth';
import { collection, query, where, orderBy, addDoc, onSnapshot, deleteDoc, doc } from 'firebase/firestore'; // Added deleteDoc, doc

const Dashboard = ({ user }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [formType, setFormType] = useState('income');
  const [formData, setFormData] = useState({ amount: '', desc: '', tenant: '', date: new Date().toISOString().split('T')[0] });

  // 1. LISTEN FOR DATA
  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, "transactions"),
      where("uid", "==", user.uid),
      orderBy("date", "desc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTransactions(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [user]);

  // 2. ADD DATA
  const handleAdd = async (e) => {
    e.preventDefault();
    if (!formData.amount || !formData.desc) return;
    const val = parseFloat(formData.amount);
    const finalAmount = formType === 'expense' ? -Math.abs(val) : Math.abs(val);

    await addDoc(collection(db, "transactions"), {
      uid: user.uid,
      amount: finalAmount,
      date: formData.date,
      description: formData.desc,
      tenantName: formType === 'income' ? formData.tenant : null,
      type: formType,
      createdAt: new Date()
    });
    setShowModal(false);
    setFormData({ amount: '', desc: '', tenant: '', date: new Date().toISOString().split('T')[0] });
  };

  // 3. DELETE DATA (NEW FUNCTION)
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      try {
        await deleteDoc(doc(db, "transactions", id));
      } catch (error) {
        alert("Error deleting: " + error.message);
      }
    }
  };

  // 4. STATS & CHART
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + Math.abs(t.amount), 0);
  const balance = totalIncome - totalExpense;

  const getChartData = () => {
    const data = {};
    transactions.forEach(t => {
      const month = t.date.substring(0, 7);
      if (!data[month]) data[month] = { name: month, income: 0, expense: 0 };
      if (t.type === 'income') data[month].income += t.amount;
      else data[month].expense += Math.abs(t.amount);
    });
    return Object.values(data).sort((a, b) => a.name.localeCompare(b.name));
  };

  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-950 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">

        {/* 1. RESTORED HEADER (Mobile Friendly) */}
        <div className="mb-6 md:mb-8">
          {/* App Name - Only shows on mobile (Desktop has it in the sidebar) */}
          <div className="flex items-center gap-2 mb-2 md:hidden">
            <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Wallet className="h-4 w-4 text-white" />
            </div>
            <h1 className="text-xl font-bold text-white font-sans">RentManager</h1>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-white">Dashboard</h2>
          <p className="text-slate-400 text-sm md:text-base">Welcome back, {user?.displayName?.split(' ')[0]}!</p>
        </div>

        {/* 2. RESTRUCTURED HERO CARDS */}
        {/* Mobile: Balance takes full width (col-span-2), Income/Expense split the row below it */}
        {/* Desktop: All three sit side-by-side (md:grid-cols-3) */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-8">

          <Card className="col-span-2 md:col-span-1">
            <CardHeader className="pb-2">
              <CardTitle className="text-slate-400 text-xs md:text-sm font-medium">Total Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl md:text-3xl font-bold text-white">${balance.toFixed(2)}</div>
            </CardContent>
          </Card>

          <Card className="col-span-1">
            <CardHeader className="pb-2">
              <CardTitle className="text-slate-400 text-xs md:text-sm font-medium">Income</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg md:text-3xl font-bold text-emerald-400 truncate">+${totalIncome.toFixed(0)}</div>
            </CardContent>
          </Card>

          <Card className="col-span-1">
            <CardHeader className="pb-2">
              <CardTitle className="text-slate-400 text-xs md:text-sm font-medium">Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg md:text-3xl font-bold text-rose-400 truncate">-${totalExpense.toFixed(0)}</div>
            </CardContent>
          </Card>

        </div>

        {/* CHART */}
        <Card className="mb-8">
          <CardHeader><CardTitle>Financial Overview</CardTitle></CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={getChartData()}>
                <defs>
                  <linearGradient id="colorInc" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} /><stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} /><stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#fff' }} />
                <Area type="monotone" dataKey="income" stroke="#10b981" fillOpacity={1} fill="url(#colorInc)" />
                <Area type="monotone" dataKey="expense" stroke="#f43f5e" fillOpacity={1} fill="url(#colorExp)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* LIST - NOW WITH DELETE BUTTON */}
        <Card>
          <CardHeader><CardTitle>Recent Transactions</CardTitle></CardHeader>
          <CardContent>
            {transactions.length === 0 ? <p className="text-slate-500">No transactions yet.</p> : (
              <div className="space-y-4">
                {transactions.slice(0, 10).map(t => (
                  <div key={t.id} className="flex justify-between items-center bg-slate-900 p-3 rounded border border-slate-800 hover:border-slate-700 transition-colors group">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded ${t.type === 'income' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                        {t.type === 'income' ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
                      </div>
                      <div>
                        <p className="font-bold text-slate-200">{t.description}</p>
                        <p className="text-xs text-slate-500">{t.date} • {t.tenantName || 'Expense'}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className={`font-bold ${t.type === 'income' ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {t.type === 'income' ? '+' : '-'}${Math.abs(t.amount)}
                      </span>

                      {/* DELETE BUTTON - Only shows on hover (group-hover) */}
                      <button
                        onClick={() => handleDelete(t.id)}
                        className="opacity-0 group-hover:opacity-100 p-2 text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-full transition-all"
                        title="Delete Transaction"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* FAB (Add Button) */}
        <button
          onClick={() => setShowModal(true)}
          className="fixed bottom-20 md:bottom-8 right-4 md:right-8 w-14 h-14 bg-indigo-600 rounded-full flex items-center justify-center shadow-lg hover:bg-indigo-500 text-white transition-all hover:scale-110 z-50"
        >
          <Plus size={24} />
        </button>

        {/* MODAL */}
        {showModal && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-slate-900 border border-slate-700 p-6 rounded-xl w-full max-w-md shadow-2xl">
              <h2 className="text-xl font-bold text-white mb-4">Add Transaction</h2>
              <div className="flex gap-2 mb-4 bg-slate-800 p-1 rounded-lg">
                <button onClick={() => setFormType('income')} className={`flex-1 py-2 rounded text-sm font-medium ${formType === 'income' ? 'bg-emerald-600 text-white' : 'text-slate-400'}`}>Income</button>
                <button onClick={() => setFormType('expense')} className={`flex-1 py-2 rounded text-sm font-medium ${formType === 'expense' ? 'bg-rose-600 text-white' : 'text-slate-400'}`}>Expense</button>
              </div>
              <form onSubmit={handleAdd} className="space-y-4">
                <input type="number" placeholder="Amount" className="w-full bg-slate-950 border border-slate-800 p-3 rounded text-white focus:ring-2 focus:ring-indigo-500 outline-none" value={formData.amount} onChange={e => setFormData({ ...formData, amount: e.target.value })} />
                <input type="text" placeholder="Description" className="w-full bg-slate-950 border border-slate-800 p-3 rounded text-white focus:ring-2 focus:ring-indigo-500 outline-none" value={formData.desc} onChange={e => setFormData({ ...formData, desc: e.target.value })} />
                {formType === 'income' && (
                  <input type="text" placeholder="Tenant Name" className="w-full bg-slate-950 border border-slate-800 p-3 rounded text-white focus:ring-2 focus:ring-indigo-500 outline-none" value={formData.tenant} onChange={e => setFormData({ ...formData, tenant: e.target.value })} />
                )}
                <input type="date" className="w-full bg-slate-950 border border-slate-800 p-3 rounded text-white [color-scheme:dark] focus:ring-2 focus:ring-indigo-500 outline-none" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} />

                <div className="flex gap-2 mt-6">
                  <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 rounded bg-slate-800 text-white hover:bg-slate-700 font-medium">Cancel</button>
                  <button type="submit" className="flex-1 py-3 rounded bg-indigo-600 text-white hover:bg-indigo-500 font-bold">Save Transaction</button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Dashboard;