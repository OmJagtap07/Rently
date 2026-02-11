import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button } from './components/ui/all-ui';
import { User, Mail, DollarSign, Loader2 } from 'lucide-react';
import { db, auth } from './firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

const Tenants = () => {
    const [tenants, setTenants] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadTenants();
    }, []);

    const loadTenants = async () => {
        if (!auth.currentUser) return;
        try {
            const q = query(collection(db, "transactions"), where("uid", "==", auth.currentUser.uid), where("type", "==", "income"));
            const snapshot = await getDocs(q);

            const tenantMap = {};

            snapshot.forEach(doc => {
                const t = doc.data();
                const name = t.tenantName || "Unknown";

                if (!tenantMap[name]) {
                    tenantMap[name] = { name, totalPaid: 0, lastPay: t.date, count: 0 };
                }

                tenantMap[name].totalPaid += t.amount;
                tenantMap[name].count += 1;
                // Keep track of most recent payment date
                if (t.date > tenantMap[name].lastPay) tenantMap[name].lastPay = t.date;
            });

            setTenants(Object.values(tenantMap));
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleEmail = (tenant) => {
        const subject = `Rent Reminder: ${tenant.name}`;
        const body = `Hi ${tenant.name},\n\nThis is a friendly reminder regarding your rent.`;
        window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    };

    if (loading) return <div className="p-8 text-white flex justify-center"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold text-white">Tenant Directory</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tenants.map((tenant, idx) => (
                    <Card key={idx} className="group hover:border-indigo-500/50 transition-all">
                        <CardHeader>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xl font-bold">
                                    {tenant.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <CardTitle className="text-white text-lg">{tenant.name}</CardTitle>
                                    <p className="text-sm text-slate-400">{tenant.count} payments on record</p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between items-center bg-slate-900 p-3 rounded-lg border border-slate-800">
                                <div className="flex items-center gap-2 text-slate-400">
                                    <DollarSign size={16} /> Total Paid
                                </div>
                                <span className="text-emerald-400 font-bold text-lg">${tenant.totalPaid.toLocaleString()}</span>
                            </div>

                            <div className="text-sm text-slate-500 text-right">
                                Last seen: {tenant.lastPay}
                            </div>

                            <Button
                                onClick={() => handleEmail(tenant)}
                                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white mt-2"
                            >
                                <Mail className="w-4 h-4 mr-2" /> Send Reminder
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default Tenants;