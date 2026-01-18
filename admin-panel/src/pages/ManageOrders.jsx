import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { 
    collection, 
    query, 
    onSnapshot, 
    doc, 
    updateDoc, 
    orderBy,
    serverTimestamp
} from 'firebase/firestore';

const ManageOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    // ১. ডাটাবেস থেকে সকল অর্ডার রিয়েল-টাইম ফেচ করা
    useEffect(() => {
        const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setOrders(list);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    // ২. অর্ডার স্ট্যাটাস আপডেট করার ফাংশন (Success/Cancel)
    const updateOrderStatus = async (orderId, newStatus) => {
        const confirmChange = window.confirm(`অর্ডারটি কি ${newStatus === 'success' ? 'সফল' : 'বাতিল'} করতে চান?`);
        if (!confirmChange) return;

        try {
            const orderRef = doc(db, "orders", orderId);
            await updateDoc(orderRef, {
                status: newStatus,
                updatedAt: serverTimestamp()
            });
            alert(`অর্ডারটি ${newStatus} হিসেবে মার্ক করা হয়েছে।`);
        } catch (error) {
            alert("ত্রুটি: " + error.message);
        }
    };

    if (loading) return <div className="p-10 text-center font-bold">অর্ডার লোড হচ্ছে...</div>;

    return (
        <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-black text-gray-800 uppercase">অর্ডার ম্যানেজমেন্ট</h1>
                    <div className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg">
                        মোট অর্ডার: {orders.length}
                    </div>
                </div>

                <div className="grid gap-4">
                    {orders.map((order) => (
                        <div key={order.id} className={`bg-white p-5 rounded-2xl shadow-sm border-l-8 transition ${
                            order.status === 'pending' ? 'border-yellow-400' : 
                            order.status === 'success' ? 'border-green-500' : 'border-red-500'
                        }`}>
                            <div className="flex flex-col md:flex-row justify-between gap-4">
                                {/* Order Info */}
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                                            order.operator === 'GP' ? 'bg-blue-100 text-blue-600' : 
                                            order.operator === 'Robi' ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'
                                        }`}>
                                            {order.operator}
                                        </span>
                                        <span className="text-xs text-gray-400">ID: {order.id.substring(0, 8)}</span>
                                    </div>
                                    <h3 className="text-lg font-black text-gray-800">{order.packageName}</h3>
                                    <p className="text-sm text-gray-600">টাকার পরিমাণ: <span className="font-bold text-indigo-600">৳{order.amount}</span></p>
                                    <p className="text-md mt-2 bg-gray-100 p-2 rounded-lg inline-block">
                                        লক্ষ্য নম্বর: <span className="font-black text-gray-900 select-all">{order.targetNumber}</span>
                                    </p>
                                </div>

                                {/* User & Time */}
                                <div className="text-left md:text-right flex flex-col justify-center">
                                    <p className="text-xs text-gray-500">ইউজার: {order.userPhone}</p>
                                    <p className="text-[10px] text-gray-400">সময়: {order.createdAt?.toDate().toLocaleString()}</p>
                                    <div className="mt-3">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                                            order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                            order.status === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                        }`}>
                                            {order.status}
                                        </span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex md:flex-col justify-center gap-2">
                                    {order.status === 'pending' && (
                                        <>
                                            <button 
                                                onClick={() => updateOrderStatus(order.id, 'success')}
                                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition shadow-md"
                                            >
                                                Done
                                            </button>
                                            <button 
                                                onClick={() => updateOrderStatus(order.id, 'cancelled')}
                                                className="bg-white border border-red-200 text-red-500 hover:bg-red-50 px-4 py-2 rounded-xl text-xs font-bold transition"
                                            >
                                                Cancel
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                    {orders.length === 0 && (
                        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
                            <p className="text-gray-400 font-bold">এখনো কোনো অর্ডার আসেনি!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ManageOrders;
