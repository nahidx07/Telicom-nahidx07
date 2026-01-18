import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const user = auth.currentUser;
        if (!user) {
            navigate('/login'); // লগইন না থাকলে লগইন পেজে পাঠিয়ে দেবে
            return;
        }

        // ইউজারের ব্যালেন্স এবং তথ্য রিয়েল-টাইম দেখা
        const userRef = doc(db, "users", user.uid);
        const unsubscribe = onSnapshot(userRef, (doc) => {
            if (doc.exists()) {
                setUserData(doc.data());
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [navigate]);

    const handleLogout = async () => {
        if (window.confirm("আপনি কি লগআউট করতে নিশ্চিত?")) {
            await signOut(auth);
            navigate('/login');
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 p-4 pb-20">
            <div className="max-w-md mx-auto">
                {/* প্রোফাইল হেডার */}
                <div className="bg-indigo-600 rounded-3xl p-8 text-white text-center shadow-xl mb-6 relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="w-20 h-20 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl border-2 border-white/30">
                            👤
                        </div>
                        <h2 className="text-xl font-bold">{userData?.phone || "ব্যবহারকারী"}</h2>
                        <p className="text-indigo-200 text-xs">ইউজার আইডি: {auth.currentUser?.uid.substring(0, 10)}...</p>
                    </div>
                    {/* ব্যাকগ্রাউন্ড ডিজাইন এলিমেন্ট */}
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full"></div>
                </div>

                {/* ব্যালেন্স কার্ড */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex justify-between items-center mb-6">
                    <div>
                        <p className="text-gray-500 text-sm font-medium">বর্তমান ব্যালেন্স</p>
                        <h3 className="text-3xl font-black text-indigo-600">৳{userData?.balance || 0}</h3>
                    </div>
                    <button 
                        onClick={() => navigate('/add-money')}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md active:scale-95 transition"
                    >
                        রিচার্জ করুন
                    </button>
                </div>

                {/* মেনু লিস্ট */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
                    <button 
                        onClick={() => navigate('/my-orders')}
                        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 border-b border-gray-50 transition"
                    >
                        <div className="flex items-center gap-3">
                            <span className="text-xl">📦</span>
                            <span className="font-bold text-gray-700">আমার অর্ডারসমূহ</span>
                        </div>
                        <span className="text-gray-400">❯</span>
                    </button>
                    
                    <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 border-b border-gray-50 transition">
                        <div className="flex items-center gap-3">
                            <span className="text-xl">🛠️</span>
                            <span className="font-bold text-gray-700">সাপোর্ট সেন্টার</span>
                        </div>
                        <span className="text-gray-400">❯</span>
                    </button>
                </div>

                {/* লগআউট বাটন */}
                <button 
                    onClick={handleLogout}
                    className="w-full bg-red-50 text-red-600 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-red-100 transition border border-red-100"
                >
                    <span>🚪</span> লগআউট করুন
                </button>
            </div>
        </div>
    );
};

export default Profile;
