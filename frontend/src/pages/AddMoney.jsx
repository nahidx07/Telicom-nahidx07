import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, addDoc, getDocs, serverTimestamp } from 'firebase/firestore';

const AddMoney = () => {
    const [methods, setMethods] = useState({});
    const [selectedMethod, setSelectedMethod] = useState('bkash');
    const [amount, setAmount] = useState('');
    const [trxId, setTrxId] = useState('');
    const [senderNum, setSenderNum] = useState('');
    const [loading, setLoading] = useState(false);

    // ১. অ্যাডমিন প্যানেল থেকে সেট করা নম্বরগুলো লোড করা
    useEffect(() => {
        const fetchPaymentMethods = async () => {
            const querySnapshot = await getDocs(collection(db, "payment_methods"));
            const data = {};
            querySnapshot.forEach((doc) => {
                data[doc.id] = doc.data();
            });
            setMethods(data);
        };
        fetchPaymentMethods();
    }, []);

    // ২. পেমেন্ট রিকোয়েস্ট সাবমিট করা
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!amount || !trxId || !senderNum) return alert("সবগুলো তথ্য সঠিকভাবে পূরণ করুন");
        
        setLoading(true);
        try {
            const payload = {
                userId: auth.currentUser?.uid || "guest",
                userPhone: auth.currentUser?.phoneNumber || "N/A",
                method: selectedMethod,
                amount: Number(amount),
                trxId: trxId,
                senderNumber: senderNum,
                status: "pending",
                createdAt: serverTimestamp()
            };

            // ফায়ারবেসে ডাটা সেভ
            await addDoc(collection(db, "payments"), payload);

            // ৩. এডমিনকে টেলিগ্রামে নোটিফিকেশন পাঠানো
            const msg = `💰 *নতুন পেমেন্ট রিকোয়েস্ট!* \n\n` +
                        `👤 ইউজার: ${payload.userPhone}\n` +
                        `💳 মেথড: ${selectedMethod.toUpperCase()}\n` +
                        `💵 পরিমাণ: ${amount} ৳\n` +
                        `🔢 TrxID: ${trxId}\n` +
                        `📱 প্রেরক নম্বর: ${senderNum}`;
            
            await fetch(`YOUR_BACKEND_URL/api/notify`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: msg })
            });

            alert("আপনার পেমেন্ট রিকোয়েস্ট সাবমিট হয়েছে। চেক করে ব্যালেন্স যোগ করা হবে।");
            setAmount(''); setTrxId(''); setSenderNum('');
        } catch (error) {
            alert("ত্রুটি হয়েছে: " + error.message);
        }
        setLoading(false);
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        alert("নম্বর কপি হয়েছে!");
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-md mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                <div className="bg-indigo-600 p-6 text-white text-center">
                    <h2 className="text-2xl font-bold">টাকা অ্যাড করুন</h2>
                    <p className="text-sm opacity-80">সঠিক তথ্য দিয়ে ব্যালেন্স রিচার্জ করুন</p>
                </div>

                <div className="p-6">
                    {/* Method Selection */}
                    <div className="flex justify-around mb-6">
                        {['bkash', 'nagad', 'rocket'].map((m) => (
                            <button 
                                key={m}
                                onClick={() => setSelectedMethod(m)}
                                className={`px-4 py-2 rounded-xl border-2 transition ${selectedMethod === m ? 'border-indigo-600 bg-indigo-50 font-bold' : 'border-gray-100'}`}
                            >
                                <span className="capitalize">{m}</span>
                            </button>
                        ))}
                    </div>

                    {/* Display Admin Number */}
                    <div className="bg-gray-100 p-4 rounded-2xl mb-6 text-center relative group">
                        <p className="text-xs text-gray-500 uppercase">আমাদের {selectedMethod} নম্বর ({methods[selectedMethod]?.type || '...' })</p>
                        <h3 className="text-2xl font-black text-gray-800 my-1">
                            {methods[selectedMethod]?.number || 'লোড হচ্ছে...'}
                        </h3>
                        <button 
                            onClick={() => copyToClipboard(methods[selectedMethod]?.number)}
                            className="text-xs text-indigo-600 font-bold underline"
                        >
                            Copy Number
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="text-sm font-bold text-gray-600">টাকার পরিমাণ (৳)</label>
                            <input type="number" value={amount} onChange={(e)=>setAmount(e.target.value)} 
                                   className="w-full p-3 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="500" required />
                        </div>
                        <div>
                            <label className="text-sm font-bold text-gray-600">আপনার {selectedMethod} নম্বর</label>
                            <input type="number" value={senderNum} onChange={(e)=>setSenderNum(e.target.value)} 
                                   className="w-full p-3 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="017XXXXXXXX" required />
                        </div>
                        <div>
                            <label className="text-sm font-bold text-gray-600">ট্রানজেকশন আইডি (TrxID)</label>
                            <input type="text" value={trxId} onChange={(e)=>setTrxId(e.target.value)} 
                                   className="w-full p-3 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="8N7X6W5Q" required />
                        </div>

                        <button 
                            disabled={loading}
                            className={`w-full py-4 rounded-2xl font-bold text-white shadow-lg transition ${loading ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                        >
                            {loading ? "প্রসেসিং হচ্ছে..." : "সাবমিট করুন"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddMoney;
