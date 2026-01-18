import React from 'react';

const Home = () => {
    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            {/* Header / Wallet */}
            <div className="bg-indigo-700 p-6 rounded-b-3xl shadow-lg text-white">
                <div className="flex justify-between items-center">
                    <div>
                        <p className="text-sm opacity-80">স্বাগতম!</p>
                        <h1 className="text-xl font-bold">User Name</h1>
                    </div>
                    <div className="bg-white/20 p-2 rounded-full">
                        <img src="https://ui-avatars.com/api/?name=User" className="w-10 h-10 rounded-full" />
                    </div>
                </div>
                <div className="mt-6 bg-white/10 p-4 rounded-xl backdrop-blur-md">
                    <p className="text-xs uppercase tracking-wider">বর্তমান ব্যালেন্স</p>
                    <h2 className="text-3xl font-black">৳ 0.00</h2>
                </div>
            </div>

            {/* Operators */}
            <div className="p-4 mt-4">
                <h3 className="font-bold text-gray-700 mb-3">সিম অপারেটর সিলেক্ট করুন</h3>
                <div className="grid grid-cols-4 gap-3">
                    {['GP', 'Robi', 'Airtel', 'BL'].map(op => (
                        <button key={op} className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center">
                            <img src={`https://placehold.co/40x40?text=${op}`} alt={op} className="rounded-lg mb-2" />
                            <span className="text-[10px] font-bold">{op}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Featured Packages */}
            <div className="p-4">
                <h3 className="font-bold text-gray-700 mb-3">জনপ্রিয় অফার</h3>
                <div className="space-y-3">
                    <div className="bg-white p-4 rounded-2xl flex justify-between items-center shadow-sm border-l-4 border-indigo-500">
                        <div>
                            <h4 className="font-bold text-sm">40GB + 800 Minute</h4>
                            <p className="text-xs text-gray-500">মেয়াদ: ৩০ দিন</p>
                        </div>
                        <div className="text-right">
                            <p className="text-indigo-600 font-bold">৳ ৪৯৯</p>
                            <button className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-lg text-xs font-bold mt-1">কিনুন</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
