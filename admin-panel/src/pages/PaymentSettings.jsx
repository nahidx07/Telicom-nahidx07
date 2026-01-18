import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, getDoc, updateDoc, collection, getDocs } from 'firebase/firestore';

const PaymentSettings = () => {
    const [methods, setMethods] = useState({
        bkash: { number: '', type: 'Personal', status: true },
        nagad: { number: '', type: 'Personal', status: true },
        rocket: { number: '', type: 'Personal', status: true }
    });
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(null); // কোন মেথড আপডেট হচ্ছে তা ট্রাক করতে

    // ১. ফায়ারবেস থেকে পেমেন্ট মেথড ডাটা লোড করা
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "payment_methods"));
                const tempData = {};
                querySnapshot.forEach((doc) => {
                    tempData[doc.id] = doc.data();
                });
                // যদি ডাটাবেসে ডাটা থাকে তবে স্টেট আপডেট হবে
                setMethods(prev => ({ ...prev, ...tempData }));
            } catch (error) {
                console.error("Error fetching payment methods: ", error);
            }
            setLoading(false);
        };
        fetchSettings();
    }, []);

    // ২. নম্বর এবং স্ট্যাটাস আপডেট করার ফাংশন
    const handleUpdate = async (id) => {
        setUpdating(id);
        try {
            const docRef = doc(db, "payment_methods", id);
            await updateDoc(docRef, {
                number: methods[id].number,
                type: methods[id].type,
                status: methods[id].status
            });
            alert(`${id.toUpperCase()} তথ্য সফলভাবে সেভ করা হয়েছে!`);
        } catch (error) {
            alert("আপডেট করতে সমস্যা হয়েছে: " + error.message);
        }
        setUpdating(null);
    };

    // ইনপুট হ্যান্ডেলার (State আপডেট করার জন্য)
    const handleChange = (id, field, value) => {
        setMethods({
            ...methods,
            [id]: { ...methods[id], [field]: value }
        });
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-2xl md:text-3xl font-black text-gray-800">পেমেন্ট মেথড সেটিংস</h1>
                    <p className="text-gray-500">এখান থেকে আপনার বিকাশ, নগদ ও রকেট নম্বর পরিবর্তন করুন</p>
                </div>
                
                <div className="grid gap-6">
                    {['bkash', 'nagad', 'rocket'].map((m) => (
                        <div key={m} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-200 flex flex-col md:flex-row items-center gap-6">
                            
                            {/* Method Branding */}
                            <div className="w-full md:w-40 flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-white shadow-lg
                                    ${m === 'bkash' ? 'bg-pink-600' : m === 'nagad' ? 'bg-orange-600' : 'bg-purple-700'}`}>
                                    {m[0].toUpperCase()}
                                </div>
                                <div>
                                    <span className="font-black text-lg capitalize block">{m}</span>
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${methods[m].status ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                        {methods[m].status ? 'Active' : 'Off'}
                                    </span>
                                </div>
                            </div>

                            {/* Number Input */}
                            <div className="flex-1 w-full">
                                <label className="text-xs font-bold text-gray-400 uppercase ml-1">নম্বর</label>
                                <input 
                                    type="text" 
                                    value={methods[m]?.number} 
                                    onChange={(e) => handleChange(m, 'number', e.target.value)}
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition"
                                    placeholder="017XXXXXXXX"
                                />
                            </div>

                            {/* Type & Status Selectors */}
                            <div className="flex gap-4 w-full md:w-auto">
                                <div className="flex-1 md:w-32">
                                    <label className="text-xs font-bold text-gray-400 uppercase ml-1">ধরণ</label>
                                    <select 
                                        value={methods[m]?.type}
                                        onChange={(e) => handleChange(m, 'type', e.target.value)}
                                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-2xl outline-none"
                                    >
                                        <option value="Personal">Personal</option>
                                        <option value="Agent">Agent</option>
                                    </select>
                                </div>

                                <div className="flex-1 md:w-28">
                                    <label className="text-xs font-bold text-gray-400 uppercase ml-1">স্ট্যাটাস</label>
                                    <select 
                                        value={methods[m]?.status}
                                        onChange={(e) => handleChange(m, 'status', e.target.value === 'true')}
                                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-2xl outline-none"
                                    >
                                        <option value="true">Active</option>
                                        <option value="false">Off</option>
                                    </select>
                                </div>
                            </div>

                            {/* Save Button */}
                            <button 
                                onClick={() => handleUpdate(m)}
                                disabled={updating === m}
                                className={`w-full md:w-auto px-8 py-3 rounded-2xl font-bold text-white shadow-lg transition
                                    ${updating === m ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 active:scale-95'}`}
                            >
                                {updating === m ? 'Saving...' : 'Save'}
                            </button>
                        </div>
                    ))}
                </div>

                <div className="mt-8 bg-indigo-50 p-6 rounded-3xl border border-indigo-100">
                    <div className="flex gap-3">
                        <span className="text-xl">💡</span>
                        <div>
                            <h4 className="font-bold text-indigo-900">অ্যাডমিন টিপস:</h4>
                            <p className="text-sm text-indigo-700">
                                যদি আপনি সাময়িকভাবে কোনো পেমেন্ট মেথড বন্ধ রাখতে চান, তবে সেটির স্ট্যাটাস "Off" করে দিন। ইউজাররা তখন সেই মেথডটি আর রিচার্জ পেজে দেখতে পাবে না।
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentSettings;
