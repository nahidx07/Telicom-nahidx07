import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';

const ManageSettings = () => {
    const [notice, setNotice] = useState('');
    const [bkash, setBkash] = useState('');
    const [nagad, setNagad] = useState('');
    const [rocket, setRocket] = useState('');
    const [loading, setLoading] = useState(false);

    // ১. ডাটাবেস থেকে বর্তমান সেটিংস লোড করা
    useEffect(() => {
        const fetchSettings = async () => {
            const noticeSnap = await getDoc(doc(db, "settings", "app_notice"));
            if (noticeSnap.exists()) setNotice(noticeSnap.data().text);

            const paymentSnap = await getDoc(doc(db, "settings", "payment_numbers"));
            if (paymentSnap.exists()) {
                const data = paymentSnap.data();
                setBkash(data.bkash || '');
                setNagad(data.nagad || '');
                setRocket(data.rocket || '');
            }
        };
        fetchSettings();
    }, []);

    // ২. সেটিংস আপডেট করার ফাংশন
    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // নোটিশ আপডেট
            await setDoc(doc(db, "settings", "app_notice"), { text: notice });
            
            // পেমেন্ট নম্বর আপডেট
            await setDoc(doc(db, "settings", "payment_numbers"), {
                bkash: bkash,
                nagad: nagad,
                rocket: rocket
            });

            alert("সেটিংস সফলভাবে আপডেট হয়েছে!");
        } catch (error) {
            console.error("Update Error:", error);
            alert("কিছু একটা সমস্যা হয়েছে! আবার চেষ্টা করুন।");
        }
        setLoading(false);
    };

    return (
        <div className="p-4 md:p-8 bg-gray-50 min-h-screen font-sans">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-2xl font-black text-gray-800 mb-6 uppercase tracking-tight">অ্যাপ সেটিংস</h1>

                <form onSubmit={handleUpdate} className="space-y-6">
                    
                    {/* নোটিশ বোর্ড সেকশন */}
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                        <h2 className="text-sm font-bold text-indigo-600 mb-4 uppercase">📢 হোম পেজ নোটিশ</h2>
                        <textarea 
                            className="w-full p-4 bg-gray-50 rounded-2xl border border-gray-100 outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                            rows="4"
                            value={notice}
                            onChange={(e) => setNotice(e.target.value)}
                            placeholder="অ্যাপের উপরে যে লেখাটি চলবে তা এখানে লিখুন..."
                        />
                    </div>

                    {/* পেমেন্ট নম্বর সেকশন */}
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                        <h2 className="text-sm font-bold text-indigo-600 mb-4 uppercase">💰 পেমেন্ট নম্বরসমূহ</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-gray-400 ml-1">বিকাশ (Personal)</label>
                                <input 
                                    type="text" value={bkash} onChange={(e) => setBkash(e.target.value)}
                                    className="w-full p-3 mt-1 bg-gray-50 rounded-xl border border-gray-100 outline-none focus:ring-2 focus:ring-pink-500"
                                    placeholder="বিকাশ নম্বর দিন"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-400 ml-1">নগদ (Personal)</label>
                                <input 
                                    type="text" value={nagad} onChange={(e) => setNagad(e.target.value)}
                                    className="w-full p-3 mt-1 bg-gray-50 rounded-xl border border-gray-100 outline-none focus:ring-2 focus:ring-orange-500"
                                    placeholder="নগদ নম্বর দিন"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-400 ml-1">রকেট (Personal)</label>
                                <input 
                                    type="text" value={rocket} onChange={(e) => setRocket(e.target.value)}
                                    className="w-full p-3 mt-1 bg-gray-50 rounded-xl border border-gray-100 outline-none focus:ring-2 focus:ring-purple-500"
                                    placeholder="রকেট নম্বর দিন"
                                />
                            </div>
                        </div>
                    </div>

                    {/* সেভ বাটন */}
                    <button 
                        type="submit"
                        disabled={loading}
                        className={`w-full py-4 rounded-2xl font-black text-white shadow-lg transition transform active:scale-95 ${
                            loading ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'
                        }`}
                    >
                        {loading ? 'আপডেট হচ্ছে...' : 'সেটিংস সেভ করুন'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ManageSettings;

