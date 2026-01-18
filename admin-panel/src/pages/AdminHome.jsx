import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';

const AdminHome = () => {
    const [orders, setOrders] = useState([]);
    const [payments, setPayments] = useState([]);

    useEffect(() => {
        // রিয়েল-টাইম পেন্ডিং অর্ডার ফেচ করা
        const qOrders = query(collection(db, "orders"), orderBy("createdAt", "desc"));
        onSnapshot(qOrders, (snapshot) => {
            setOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });

        // রিয়েল-টাইম পেন্ডিং পেমেন্ট ফেচ করা
        const qPay = query(collection(db, "payments"), orderBy("createdAt", "desc"));
        onSnapshot(qPay, (snapshot) => {
            setPayments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar */}
            <div className="w-64 bg-slate-900 text-white p-6 hidden md:block">
                <h2 className="text-2xl font-black mb-10 text-indigo-400">ADMIN PANEL</h2>
                <nav className="space-y-4">
                    <div className="font-bold cursor-pointer hover:text-indigo-400">Dashboard</div>
                    <div className="font-bold cursor-pointer hover:text-indigo-400">Orders ({orders.filter(o => o.status === 'pending').length})</div>
                    <div className="font-bold cursor-pointer hover:text-indigo-400">Payments ({payments.filter(p => p.status === 'pending').length})</div>
                    <div className="font-bold cursor-pointer hover:text-indigo-400">Packages</div>
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-8 overflow-y-auto">
                <header className="flex justify-between items-center mb-10">
                    <h1 className="text-3xl font-bold text-gray-800">Overview</h1>
                    <div className="bg-white px-4 py-2 rounded-lg shadow-sm border font-medium">
                        Admin: +8801XXXXXXXX
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Orders Section */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                        <h3 className="text-xl font-bold mb-4 text-orange-600">Pending Orders</h3>
                        <div className="space-y-4">
                            {orders.filter(o => o.status === 'pending').map(order => (
                                <div key={order.id} className="p-4 border rounded-xl flex justify-between items-center bg-orange-50">
                                    <div>
                                        <p className="font-bold">{order.targetNumber}</p>
                                        <p className="text-sm text-gray-500">{order.packageName} - ৳{order.amount}</p>
                                    </div>
                                    <button className="bg-green-600 text-white px-4 py-1 rounded-lg text-sm font-bold">Done</button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Payments Section */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                        <h3 className="text-xl font-bold mb-4 text-blue-600">Recharge Requests</h3>
                        <div className="space-y-4">
                            {payments.filter(p => p.status === 'pending').map(pay => (
                                <div key={pay.id} className="p-4 border rounded-xl flex justify-between items-center bg-blue-50">
                                    <div>
                                        <p className="font-bold">TrxID: {pay.trxId}</p>
                                        <p className="text-sm text-gray-500">{pay.method} - ৳{pay.amount}</p>
                                    </div>
                                    <button className="bg-blue-600 text-white px-4 py-1 rounded-lg text-sm font-bold">Approve</button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminHome;
