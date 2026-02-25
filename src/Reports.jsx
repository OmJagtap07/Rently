import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/all-ui';
import { TrendingUp, TrendingDown, Calendar, Loader2 } from 'lucide-react';
import { db, auth } from './firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';

const Reports = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [grandTotals, setGrandTotals] = useState({ income: 0, expense: 0, net: 0 });

    useEffect(() => {
        loadReports();
    }, []);

    const loadReports = async () => {
        if (!auth.currentUser) return;
        try {
            // 1. Fetch ALL data
            const q = query(collection(db, "transactions"), where("uid", "==", auth.currentUser.uid), orderBy("date", "desc"));
            const snapshot = await getDocs(q);
            const transactions = snapshot.docs.map(doc => doc.data());

            // 2. Process Data: Group by Month AND calculate Grand Totals
            const monthlyData = {};
            let totalInc = 0;
            let totalExp = 0;

            transactions.forEach(t => {
                const monthKey = t.date.substring(0, 7); // e.g., "2026-02"

                if (!monthlyData[monthKey]) {
                    monthlyData[monthKey] = { month: monthKey, income: 0, expense: 0, count: 0 };
                }

                const val = Math.abs(t.amount);
                if (t.type === 'income') {
                    monthlyData[monthKey].income += val;
                    totalInc += val; // Add to Grand Total
                } else {
                    monthlyData[monthKey].expense += val;
                    totalExp += val; // Add to Grand Total
                }
                monthlyData[monthKey].count += 1;
            });

            // Set the overall totals in state
            setGrandTotals({ income: totalInc, expense: totalExp, net: totalInc - totalExp });

            // 3. Convert to Array and Sort
            const reportArray = Object.values(monthlyData).sort((a, b) => b.month.localeCompare(a.month));
            setReports(reportArray);
        } catch (error) {
            console.error("Error loading reports:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-8 text-white flex justify-center"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold text-white">Monthly Reports</h1>

            {/* --- GRAND TOTALS UI SECTION --- */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h2 className="text-slate-400 text-sm font-bold uppercase tracking-wider">All-Time Grand Total</h2>
                    <div className={`text-4xl font-bold ${grandTotals.net >= 0 ? 'text-white' : 'text-rose-400'}`}>
                        {grandTotals.net >= 0 ? '' : '-'}₹{Math.abs(grandTotals.net).toLocaleString('en-IN')}
                    </div>
                </div>
                <div className="flex gap-4 md:gap-6 text-sm w-full md:w-auto">
                    <div className="flex-1 md:flex-none bg-slate-950 px-4 py-3 rounded-lg border border-slate-800 text-center md:text-left">
                        <span className="text-slate-500 block mb-1">Total Income</span>
                        <span className="text-emerald-400 font-bold text-lg">+₹{grandTotals.income.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex-1 md:flex-none bg-slate-950 px-4 py-3 rounded-lg border border-slate-800 text-center md:text-left">
                        <span className="text-slate-500 block mb-1">Total Expenses</span>
                        <span className="text-rose-400 font-bold text-lg">-₹{grandTotals.expense.toLocaleString('en-IN')}</span>
                    </div>
                </div>
            </div>

            {/* --- MONTHLY BREAKDOWN CARDS --- */}
            {reports.length === 0 ? (
                <div className="text-slate-400">No data found. Add some transactions on the Dashboard!</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {reports.map((report) => {
                        const dateObj = new Date(report.month + "-01");
                        const label = dateObj.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
                        const net = report.income - report.expense;

                        return (
                            <Card key={report.month} className="hover:border-indigo-500/50 transition-all cursor-default">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-white">
                                        <Calendar className="h-5 w-5 text-indigo-400" />
                                        {label}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-400 flex items-center gap-2">
                                            <TrendingUp size={16} className="text-emerald-400" /> Income
                                        </span>
                                        <span className="text-emerald-400 font-bold text-lg">
                                            +₹{report.income.toLocaleString('en-IN')}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-400 flex items-center gap-2">
                                            <TrendingDown size={16} className="text-rose-400" /> Expense
                                        </span>
                                        <span className="text-rose-400 font-bold text-lg">
                                            -₹{report.expense.toLocaleString('en-IN')}
                                        </span>
                                    </div>
                                    <div className="pt-4 border-t border-slate-800 flex justify-between items-center">
                                        <span className="text-slate-200 font-medium">Net Balance</span>
                                        <span className={`text-xl font-bold ${net >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                            {net >= 0 ? '' : '-'}₹{Math.abs(net).toLocaleString('en-IN')}
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default Reports;