import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button, Input } from './components/ui/all-ui';
import { User, Mail, DollarSign, Loader2, MessageCircle, Phone, Save } from 'lucide-react';
import { db, auth } from './firebase';
import { collection, query, where, getDocs, setDoc, doc } from 'firebase/firestore';

const Tenants = () => {
    const [tenants, setTenants] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modal State
    const [selectedTenant, setSelectedTenant] = useState(null);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        if (!auth.currentUser) return;
        const uid = auth.currentUser.uid;

        try {
            // 1. Get All Transactions
            const transQuery = query(collection(db, "transactions"), where("uid", "==", uid), where("type", "==", "income"));
            const transSnapshot = await getDocs(transQuery);

            // 2. Get All Tenant Details
            const detailsQuery = query(collection(db, "tenants"), where("uid", "==", uid));
            const detailsSnapshot = await getDocs(detailsQuery);

            const phoneMap = {};
            detailsSnapshot.forEach(doc => {
                const data = doc.data();
                phoneMap[data.name] = data.phone;
            });

            // 3. Aggregate Data
            const tenantMap = {};

            transSnapshot.forEach(doc => {
                const t = doc.data();
                const name = t.tenantName || "Unknown";

                if (!tenantMap[name]) {
                    tenantMap[name] = {
                        name,
                        totalPaid: 0,
                        lastPay: t.date,
                        count: 0,
                        phone: phoneMap[name] || ''
                    };
                }

                tenantMap[name].totalPaid += t.amount;
                tenantMap[name].count += 1;
                if (t.date > tenantMap[name].lastPay) tenantMap[name].lastPay = t.date;
            });

            setTenants(Object.values(tenantMap));
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenTenant = (tenant) => {
        setSelectedTenant(tenant);
        setPhoneNumber(tenant.phone || '');
    };

    const savePhoneNumber = async () => {
        if (!phoneNumber) return;
        setIsSaving(true);

        try {
            const tenantId = `${auth.currentUser.uid}_${selectedTenant.name.replace(/\s+/g, '_')}`;

            await setDoc(doc(db, "tenants", tenantId), {
                uid: auth.currentUser.uid,
                name: selectedTenant.name,
                phone: phoneNumber,
                updatedAt: new Date()
            }, { merge: true });

            const updatedTenants = tenants.map(t =>
                t.name === selectedTenant.name ? { ...t, phone: phoneNumber } : t
            );
            setTenants(updatedTenants);
            setSelectedTenant({ ...selectedTenant, phone: phoneNumber });

            alert("Phone number saved!");
        } catch (error) {
            alert("Error saving number: " + error.message);
        } finally {
            setIsSaving(false);
        }
    };

    // --- UPDATED WHATSAPP LOGIC ---
    // Now accepts a 'targetTenant' argument so we can use it from the card OR the modal
    const sendWhatsApp = (targetTenant) => {
        const phone = targetTenant.phone;
        const name = targetTenant.name;

        if (!phone) {
            alert(`Please click on ${name}'s card to add a phone number first!`);
            return;
        }

        const message = `Hello ${name},
This is a reminder for your monthly payment details:

Rent: ₹6000
Maintenance: ₹300
Electricity Bill: <bill>

Total Amount Payable: <grandTotal>

Kindly make the payment at your earliest convenience.
Thank you.`;

        window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
    };

    if (loading) return <div className="p-8 text-white flex justify-center"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold text-white">Tenant Directory</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tenants.map((tenant, idx) => (
                    <Card
                        key={idx}
                        className="group hover:border-indigo-500/50 transition-all cursor-pointer relative"
                        onClick={() => handleOpenTenant(tenant)}
                    >
                        {/* --- NEW WHATSAPP BUTTON ON CARD --- */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation(); // Prevents the card click (Modal) from firing
                                sendWhatsApp(tenant);
                            }}
                            className="absolute top-4 right-4 p-2 bg-slate-800 hover:bg-green-600 text-slate-400 hover:text-white rounded-full transition-all z-10 shadow-lg"
                            title="Quick WhatsApp Reminder"
                        >
                            <MessageCircle size={20} />
                        </button>

                        <CardHeader>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xl font-bold">
                                    {tenant.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <CardTitle className="text-white text-lg">{tenant.name}</CardTitle>
                                    <p className="text-sm text-slate-400">{tenant.count} payments</p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex justify-between items-center bg-slate-900 p-3 rounded-lg border border-slate-800">
                                <div className="flex items-center gap-2 text-slate-400">
                                    <DollarSign size={16} /> Total Paid
                                </div>
                                <span className="text-emerald-400 font-bold text-lg">${tenant.totalPaid.toLocaleString()}</span>
                            </div>

                            <div className="mt-4 flex justify-between items-center">
                                {tenant.phone ? (
                                    <span className="text-xs text-emerald-400 flex items-center gap-1"><Phone size={12} /> {tenant.phone}</span>
                                ) : (
                                    <span className="text-xs text-slate-500">No contact info</span>
                                )}
                                <span className="text-indigo-400 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                                    Click to edit details
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* --- TENANT DETAIL MODAL --- */}
            {selectedTenant && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-slate-900 border border-slate-700 p-6 rounded-xl w-full max-w-md shadow-2xl relative">

                        <button
                            onClick={() => setSelectedTenant(null)}
                            className="absolute top-4 right-4 text-slate-500 hover:text-white"
                        >
                            ✕
                        </button>

                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-3">
                                {selectedTenant.name.charAt(0).toUpperCase()}
                            </div>
                            <h2 className="text-2xl font-bold text-white">{selectedTenant.name}</h2>
                            <p className="text-slate-400">Tenant Profile</p>
                        </div>

                        <div className="space-y-4">
                            {/* ... Stats Section ... */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-slate-950 p-3 rounded border border-slate-800 text-center">
                                    <p className="text-xs text-slate-500">Last Payment</p>
                                    <p className="text-white font-medium">{selectedTenant.lastPay}</p>
                                </div>
                                <div className="bg-slate-950 p-3 rounded border border-slate-800 text-center">
                                    <p className="text-xs text-slate-500">History</p>
                                    <p className="text-emerald-400 font-medium">{selectedTenant.count} Records</p>
                                </div>
                            </div>

                            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 space-y-3">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Contact Details</label>

                                <div className="flex gap-2">
                                    <div className="relative flex-1">
                                        <Phone className="absolute left-3 top-3 text-slate-500 w-4 h-4" />
                                        <Input
                                            placeholder="Mobile Number"
                                            className="pl-9 bg-slate-950 border-slate-700 text-white"
                                            value={phoneNumber}
                                            onChange={(e) => setPhoneNumber(e.target.value)}
                                        />
                                    </div>
                                    <Button onClick={savePhoneNumber} variant="outline" className="px-3" disabled={isSaving}>
                                        {isSaving ? <Loader2 className="animate-spin w-4 h-4" /> : <Save className="w-4 h-4" />}
                                    </Button>
                                </div>

                                <Button
                                    onClick={() => sendWhatsApp(selectedTenant)} // Use the refactored function
                                    className="w-full bg-green-600 hover:bg-green-500 text-white font-bold"
                                    disabled={!phoneNumber}
                                >
                                    <MessageCircle className="w-4 h-4 mr-2" /> Send WhatsApp Reminder
                                </Button>
                            </div>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
};

export default Tenants;