import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

const AdminLayout = () => {
    const [isOpen, setIsOpen] = useState(true);
    const location = useLocation();

    const menuItems = [
        { name: 'ড্যাশবোর্ড', path: '/admin', icon: '📊' },
        { name: 'অর্ডার ম্যানেজমেন্ট', path: '/admin/orders', icon: '📦' },
        { name: 'পেমেন্ট রিকোয়েস্ট', path: '/admin/payments', icon: '💰' },
        { name: 'প্যাকেজ সেটিংস', path: '/admin/packages', icon: '🎁' },
        { name: 'পেমেন্ট নম্বর সেটআপ', path: '/admin/payment-settings', icon: '⚙️' },
        { name: 'ইউজার লিস্ট', path: '/admin/users', icon: '👥' },
    ];

    return (
        <div className="flex h-screen bg-gray-100 font-sans">
            {/* Sidebar */}
            <div className={`${isOpen ? 'w-64' : 'w-20'} bg-slate-900 text-white transition-all duration-300 flex flex-col`}>
                <div className="p-6 text-center border-b border-slate-800">
                    <h1 className={`${!isOpen && 'hidden'} text-xl font-black text-indigo-400 tracking-tighter uppercase`}>
                        Admin Panel
                    </h1>
                    <span className={`${isOpen && 'hidden'} text-xl`}>⚡</span>
                </div>

                <nav className="mt-6 flex-1 px-3 space-y-2">
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center p-3 rounded-xl transition ${
                                location.pathname === item.path 
                                ? 'bg-indigo-600 text-white shadow-lg' 
                                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                            }`}
                        >
                            <span className="text-xl">{item.icon}</span>
                            <span className={`${!isOpen && 'hidden'} ml-4 font-bold text-sm`}>
                                {item.name}
                            </span>
                        </Link>
                    ))}
                </nav>

                <button 
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-4 text-center bg-slate-800 hover:bg-indigo-600 transition"
                >
                    {isOpen ? '◀ বন্ধ করুন' : '▶'}
                </button>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Header */}
                <header className="bg-white h-16 shadow-sm border-b flex items-center justify-between px-8">
                    <div className="font-bold text-gray-700">
                        {menuItems.find(m => m.path === location.pathname)?.name || 'ড্যাশবোর্ড'}
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-sm font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">Admin Account</span>
                        <button className="text-red-500 font-bold text-sm">লগআউট</button>
                    </div>
                </header>

                {/* Content Render Area */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
                    <Outlet /> {/* এখানে বিভিন্ন পেজ (Orders, Payments) লোড হবে */}
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
