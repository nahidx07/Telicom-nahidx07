import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // বর্তমানে লগইন করা ইউজারের আইডি নেওয়া
        const user = auth.currentUser;
        if (!user) {
            setLoading(false);
            return;
        }

        // শুধুমাত্র এই ইউজারের অর্ডারগুলো ফিল্টার করে আনা
        const q = query(
            collection(db, "orders"),
            where("userId", "==", user.uid),
            orderBy("createdAt", "desc")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setOrders(list);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    if (loading) return (
        <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 p-4 pb-20">
            <div className="max-w-md mx-auto">
                <h1 className="text-2xl font-black text-gray-800 mb-6 flex items-center gap-2">
                    <span className="text-3xl">📜</span> আমার অর্ডারসমূহ
                </h1>

                <div className="space-y-4">
                    {orders.length > 0 ? (
                        orders.map((order) => (
                            <div key={order.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center transition active:scale-95">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                                            order.operator === 'GP' ? 'bg-blue-100 text-blue-600' : 
                                            order.operator === 'Robi' ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'
                                        }`}>
                                            {order.operator}
                                        </span>
                                        <span className="text-[10px] text-gray-400 font-mono">#{order.id.substring(0, 6)}</span>
                                    </div>
                                    <h3 className="font-bold text-gray-800">{order.packageName}</h3>
                                    <p className="text-xs text-gray-500">নম্বর: <span className="font-bold text-gray-700">{order.targetNumber}</span></p>
                                    <p className="text-xs text-indigo-600 font-bold mt-1">৳{order.amount}</p>
                                </div>

                                <div className="text-right">
                                    <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase ${
                                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-600' :
                                        order.status === 'success' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                                    }`}>
                                        {order.status === 'pending' ? '⏳ Pending' : 
                                         order.status === 'success' ? '✅ Success' : '❌ Cancelled'}
                                    </span>
                                    <p className="text-[10px] text-gray-400 mt-2 italic">
                                        {order.createdAt?.toDate() ? new Date(order.createdAt.toDate()).toLocaleDateString() : 'Just now'}
                                    </p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                            <p className="text-4xl mb-2">📥</p>
                            <p className="text-gray-400 text-sm">আপনি এখনও কোনো অর্ডার করেননি!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyOrders;

