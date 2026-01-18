import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

const AdminDashboard = () => {
    const [stats, setStats] = useState({ users: 0, orders: 0, revenue: 0 });

    useEffect(() => {
        // ফায়ারবেস থেকে ডাটা ফেচ করার লজিক এখানে হবে
    }, []);

    return (
        <div className="p-6 bg-slate-100 min-h-screen">
            <h1 className="text-2xl font-bold mb-6">Admin Control Panel</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border-t-4 border-blue-500">
                    <p className="text-gray-500">Total Users</p>
                    <h2 className="text-3xl font-bold">{stats.users}</h2>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border-t-4 border-green-500">
                    <p className="text-gray-500">Total Orders</p>
                    <h2 className="text-3xl font-bold">{stats.orders}</h2>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border-t-4 border-purple-500">
                    <p className="text-gray-500">Total Revenue</p>
                    <h2 className="text-3xl font-bold">৳ {stats.revenue}</h2>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-10 bg-white p-6 rounded-xl shadow-sm">
                <h3 className="font-bold mb-4">Add New Package</h3>
                <div className="grid grid-cols-2 gap-4">
                    <input type="text" placeholder="Package Name" className="border p-2 rounded" />
                    <input type="number" placeholder="Price (BDT)" className="border p-2 rounded" />
                    <select className="border p-2 rounded">
                        <option>Grameenphone</option>
                        <option>Robi</option>
                        <option>Airtel</option>
                    </select>
                    <button className="bg-blue-600 text-white font-bold py-2 rounded">Add Package</button>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
