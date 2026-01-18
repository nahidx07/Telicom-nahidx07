import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { auth, db } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

// Layout and Pages
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
                try {
                    // Firestore থেকে ইউজারের ডাটা চেক করা হচ্ছে সে এডমিন কি না
                    const userRef = doc(db, "users", currentUser.uid);
                    const userSnap = await getDoc(userRef);

                    if (userSnap.exists() && userSnap.data().role === 'admin') {
                        setUser(currentUser);
                        setIsAdmin(true);
                    } else {
                        // যদি এডমিন না হয়
                        setUser(null);
                        setIsAdmin(false);
                    }
                } catch (error) {
                    console.error("Admin Check Error:", error);
                }
            } else {
                setUser(null);
                setIsAdmin(false);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // লোডিং স্ক্রিন
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-slate-900 text-white">
                <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-indigo-500 mb-4"></div>
                <p className="text-sm font-bold tracking-widest uppercase animate-pulse">Checking Admin Access...</p>
            </div>
        );
    }

    return (
        <Routes>
            {/* যদি ইউজার এডমিন হয় তবেই এই রাউটগুলো কাজ করবে */}
            {isAdmin ? (
                <Route path="/" element={<AdminLayout />}>
                    {/* ডিফল্টভাবে অর্ডার পেজে পাঠাবে */}
                    <Route index element={<Navigate to="/orders" />} />
                    <Route path="orders" element={<ManageOrders />} />
                    <Route path="payments" element={<ManagePayments />} />
                    <Route path="packages" element={<ManagePackages />} />
                    <Route path="payment-settings" element={<PaymentSettings />} />
                    
                    {/* ৪ঠা৪ হ্যান্ডলিং এডমিন প্যানেলের ভেতরে */}
                    <Route path="*" element={<div className="p-10 font-bold">পেজটি পাওয়া যায়নি!</div>} />
                </Route>
            ) : (
                /* যদি এডমিন না হয় তবে এই স্ক্রিনটি দেখাবে */
                <Route path="*" element={
                    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-10 text-center">
                        <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-sm">
                            <span className="text-6xl">🚫</span>
                            <h1 className="text-2xl font-black text-gray-800 mt-4 uppercase">Access Denied</h1>
                            <p className="text-gray-500 mt-2 text-sm leading-relaxed">
                                আপনি এই প্যানেলটি ব্যবহার করতে পারবেন না। শুধুমাত্র অ্যাডমিনরাই এখানে প্রবেশ করতে পারেন।
                            </p>
                            <button 
                                onClick={() => window.location.href = 'https://your-user-app.vercel.app'} 
                                className="mt-6 w-full bg-indigo-600 text-white py-3 rounded-xl font-bold shadow-lg hover:bg-indigo-700 transition"
                            >
                                মেইন অ্যাপে ফিরে যান
                            </button>
                        </div>
                    </div>
                } />
            )}
        </Routes>
    );
};

export default App;
