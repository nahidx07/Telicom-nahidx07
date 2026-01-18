import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { 
    collection, 
    query, 
    onSnapshot, 
    doc, 
    updateDoc, 
    increment, 
    orderBy,
    getDoc,
    serverTimestamp
} from 'firebase/firestore';

const ManagePayments = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);

    // ১. ডাটাবেস থেকে রিয়েল-টাইম পেমেন্ট রিকোয়েস্ট ফেচ করা
    useEffect(() => {
        const q = query(collection(db, "payments"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setPayments(list);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    // ২. পেমেন্ট অ্যাপ্রুভ করার লজিক
    const handleApprove = async (payId, userId, amount) => {
        const confirmApprove = window.confirm(`আপনি কি নিশ্চিত যে ৳${amount} যোগ করবেন?`);
        if (!confirmApprove) return;

        try {
            // ইউজারের ব্যালেন্স রেফারেন্স
            const userRef = doc(db, "users", userId);
            
            // ইউজারের ব্যালেন্স বাড়ানো (Firestore Increment)
            await updateDoc(userRef, {
                balance: increment(amount),
                lastDeposit: serverTimestamp()
            });

            // পেমেন্ট রিকোয়েস্ট স্ট্যাটাস আপডেট
            await updateDoc(doc(db, "payments", payId), {
                status: "approved",
                approvedAt: serverTimestamp()
            });

            alert("ব্যালেন্স সফলভাবে যোগ করা হয়েছে!");
        } catch (error) {
            console.error("Approval Error: ", error);
            alert("ত্রুটি: ইউজার প্রোফাইল খুঁজে পাওয়া যায়নি বা ডাটাবেস এরর।");
        }
    };

    // ৩. পেমেন্ট রিজেক্ট করার লজিক
    const handleReject = async (payId) => {
        const confirmReject = window.confirm("আপনি কি এই রিকোয়েস্টটি বাতিল করতে চান?");
        if (!confirmReject) return;

        try {
            await updateDoc(doc(db, "payments", payId), {
                status: "rejected",
                rejectedAt: serverTimestamp()
            });
            alert("রিকোয়েস্ট বাতিল করা হয়েছে।");
        } catch (error) {
            alert("বাতিল করতে সমস্যা হয়েছে।");
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    );

    return (
        <div className="p-4 md:p-8 bg-gray-50 min-h-screen font-sans">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl font-black text-gray-800 uppercase tracking-tight">পেমেন্ট রিকোয়েস্ট</h1>
                        <p className="text-gray-500 text-sm">ইউজারের পাঠানো TrxID যাচাই করে ব্যালেন্স দিন</p>
                    </div>
                    <div className="bg-white px-4 py-2 rounded-xl shadow-sm border text-sm font-bold text-blue-600">
                        Pending: {payments.filter(p => p.status === 'pending').length}
                    </div>
                </div>

                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="p-5 text-xs font-black text-gray-400 uppercase">ইউজার ও নম্বর</th>
                                    <th className="p-5 text-xs font-black text-gray-400 uppercase">মেথড</th>
                                    <th className="p-5 text-xs font-black text-gray-400 uppercase">পরিমাণ</th>
                                    <th className="p-5 text-xs font-black text-gray-400 uppercase">ট্রানজেকশন আইডি</th>
                                    <th className="p-5 text-xs font-black text-gray-400 uppercase">স্ট্যাটাস</th>
                                    <th className="p-5 text-xs font-black text-gray-400 uppercase">অ্যাকশন</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {payments.map((pay) => (
                                    <tr key={pay.id} className="hover:bg-blue-50/30 transition">
                                        <td className="p-5">
                                            <p className="font-bold text-gray-800">{pay.userPhone || 'No Phone'}</p>
                                            <p className="text-[10px] text-gray-400 font-mono">UID: {pay.userId.substring(0, 8)}...</p>
                                        </td>
                                        <td className="p-5">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                                                pay.method === 'bkash' ? 'bg-pink-100 text-pink-600' : 
                                                pay.method === 'nagad' ? 'bg-orange-100 text-orange-600' : 'bg-purple-100 text-purple-600'
                                            }`}>
                                                {pay.method}
                                            </span>
                                        </td>
                                        <td className="p-5">
                                            <span className="text-lg font-black text-gray-900">৳{pay.amount}</span>
                                        </td>
                                        <td className="p-5 font-mono text-sm">
                                            <div className="flex items-center gap-2">
                                                <span className="bg-gray-100 px-2 py-1 rounded select-all">{pay.trxId}</span>
                                            </div>
                                        </td>
                                        <td className="p-5">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                                                pay.status === 'pending' ? 'bg-yellow-100 text-yellow-600' :
                                                pay.status === 'approved' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                                            }`}>
                                                {pay.status.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="p-5">
                                            {pay.status === 'pending' && (
                                                <div className="flex gap-2">
                                                    <button 
                                                        onClick={() => handleApprove(pay.id, pay.userId, pay.amount)}
                                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition shadow-md shadow-blue-200"
                                                    >
                                                        Approve
                                                    </button>
                                                    <button 
                                                        onClick={() => handleReject(pay.id)}
                                                        className="bg-white border border-red-200 text-red-500 hover:bg-red-50 px-4 py-2 rounded-xl text-xs font-bold transition"
                                                    >
                                                        Reject
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {payments.length === 0 && (
                        <div className="text-center py-20 text-gray-400">
                            <p className="text-4xl mb-4">📥</p>
                            <p>এখনও কোনো পেমেন্ট রিকোয়েস্ট আসেনি</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ManagePayments;
