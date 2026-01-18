import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { auth, db } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

// লেআউট এবং পেজগুলো ইমপোর্ট করুন
import AdminLayout from './components/AdminLayout';
import ManageOrders from './pages/ManageOrders';
import ManagePayments from './pages/ManagePayments';
import ManagePackages from './pages/ManagePackages';
import PaymentSettings from './pages/PaymentSettings';

const App = () => {
    const [user, setUser] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                // চেক করা হচ্ছে ইউজারের রোল 'admin' কি না
                const userDoc = await getDoc(doc(db, "users", currentUser.uid));
                if (userDoc.exists() && userDoc.data().role === 'admin') {
                    setUser(currentUser);
                    setIsAdmin(true);
                } else {
                    setUser(null);
                    setIsAdmin(false);
                }
            } else {
                setUser(null);
                setIsAdmin(false);
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    if (loading) return (
        <div className="flex justify-center items-center h-screen bg-slate-900">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
        </div>
    );

    return (
        <Routes>
            {/* যদি এডমিন লগইন থাকে তবে সব পেজ এক্সেস পাবে */}
            {isAdmin ? (
                <Route path="/" element={<AdminLayout />}>
                    <Route index element={<Navigate to="/orders" />} />
                    <Route path="orders" element={<ManageOrders />} />
                    <Route path="payments" element={<ManagePayments />} />
                    <Route path="packages" element={<ManagePackages />} />
                    <Route path="payment-settings" element={<PaymentSettings />} />
                </Route>
            ) : (
                /* যদি এডমিন না হয় তবে তাকে এক্সেস ডিনাইড বা লগইন পেজে পাঠাবে */
                <Route path="*" element={
                    <div className="flex flex-col items-center justify-center h-screen bg-slate-100 p-6 text-center">
                        <h1 className="text-4xl font-black text-red-500 mb-2">ACCESS DENIED</h1>
                        <p className="text-gray-600">আপনার এই প্যানেল ব্যবহারের অনুমতি নেই।</p>
                        <a href="https://your-main-app-link.vercel.app/login" className="mt-4 text-indigo-600 font-bold underline">
                            মেইন অ্যাপে ফিরে যান
                        </a>
                    </div>
                } />
            )}
        </Routes>
    );
};

export default App;
