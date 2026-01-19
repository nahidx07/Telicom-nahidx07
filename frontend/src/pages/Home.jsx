import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, query, doc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const [packages, setPackages] = useState([]);
    const [notice, setNotice] = useState('অফারগুলো লোড হচ্ছে...');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // ১. নোটিশ বোর্ড ডাটা আনা (Real-time)
        const unsubNotice = onSnapshot(doc(db, "settings", "app_notice"), (doc) => {
            if (doc.exists()) {
                setNotice(doc.data().text);
            }
        });

        // ২. প্যাকেজ লিস্ট ডাটা আনা (Real-time)
        const q = query(collection(db, "packages"));
        const unsubPackages = onSnapshot(q, (snapshot) => {
            const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setPackages(list);
            setLoading(false);
        });

        return () => {
            unsubNotice();
            unsubPackages();
        };
    }, []);

    // প্যাকেজ কেনা বা অর্ডার পেজে পাঠানোর ফাংশন
    const handleBuy = (pkg) => {
        // পেমেন্ট পেজে ডাটা পাঠিয়ে দেওয়া
        navigate('/add-money', { state: { package: pkg } });
    };

    if (loading) return (
        <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 pb-24">
            
            {/* নোটিশ বোর্ড (Moving Text) */}
            <div className="bg-indigo-600 text-white py-2 flex items-center shadow-md overflow-hidden sticky top-0 z-50">
                <div className="bg-red-600 px-3 py-1 text-[10px] font-black uppercase z-10 shadow-lg ml-2 rounded">জরুরি</div>
                <marquee className="text-sm font-bold ml-2">
                    {notice}
                </marquee>
            </div>

            {/* হেডার/ব্যানার সেকশন */}
            <div className="bg-gradient-to-b from-indigo-600 to-indigo-800 p-8 rounded-b-[40px] text-white shadow-xl mb-6">
                <h1 className="text-2xl font-black italic tracking-tighter">SIM SERVICE APP</h1>
                <p className="text-indigo-100 text-xs mt-1 opacity-80 uppercase tracking-widest">সেরা অফার কিনুন মুহূর্তেই</p>
                
                <div className="mt-8 bg-white/10 p-4 rounded-3xl border border-white/20 backdrop-blur-sm">
                    <p className="text-xs text-indigo-200 uppercase font-bold">আজকের বিশেষ ঘোষণা</p>
                    <p className="text-sm font-medium mt-1">সব ড্রাইভ অফার এখন চালু আছে। অর্ডারের ৫-১০ মিনিটে ডেলিভারি!</p>
                </div>
            </div>

            {/* অফার ক্যাটাগরি বা লিস্ট */}
            <div className="px-4">
                <div className="flex justify-between items-center mb-4 px-1">
                    <h2 className="text-lg font-black text-gray-800 uppercase italic">Active Packages</h2>
                    <span className="text-[10px] bg-indigo-100 text-indigo-600 px-2 py-1 rounded-full font-bold">
                        {packages.length} OFFERS
                    </span>
                </div>

                <div className="grid gap-4">
                    {packages.length > 0 ? (
                        packages.map((pkg) => (
                            <div key={pkg.id} className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex justify-between items-center transition active:scale-95">
                                <div className="flex items-center gap-4">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-white text-xl shadow-lg ${
                                        pkg.operator === 'GP' ? 'bg-blue-500' : 
                                        pkg.operator === 'Robi' ? 'bg-red-600' : 
                                        pkg.operator === 'Banglalink' ? 'bg-orange-500' : 'bg-indigo-600'
                                    }`}>
                                        {pkg.operator === 'GP' ? 'G' : pkg.operator === 'Robi' ? 'R' : 'B'}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-800 text-sm leading-tight">{pkg.name}</h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-[10px] font-bold text-gray-400 border px-2 py-0.5 rounded-full uppercase">{pkg.operator}</span>
                                            <span className="text-indigo-600 font-black text-lg">৳{pkg.price}</span>
                                        </div>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => handleBuy(pkg)}
                                    className="bg-gray-900 text-white px-6 py-2 rounded-2xl text-xs font-black hover:bg-indigo-600 transition shadow-md"
                                >
                                    BUY
                                </button>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-100">
                            <p className="text-gray-400 font-medium">বর্তমানে কোনো অফার নেই!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Home;
