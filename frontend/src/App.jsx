import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';

// পেজগুলো ইমপোর্ট করুন (নিশ্চিত করুন এই ফাইলগুলো আপনার pages ফোল্ডারে আছে)
import Home from './pages/Home';
import AddMoney from './pages/AddMoney';
import MyOrders from './pages/MyOrders'; // ইউজারের নিজের অর্ডার হিস্ট্রি দেখার জন্য
import Profile from './pages/Profile';

const App = () => {
  const location = useLocation();

  // নিচের নেভিগেশন বারটি শুধু মোবাইল ইউজারদের জন্য চমৎকার কাজ করবে
  const navItems = [
    { name: 'হোম', path: '/', icon: '🏠' },
    { name: 'টাকা অ্যাড', path: '/add-money', icon: '💰' },
    { name: 'অর্ডারসমূহ', path: '/my-orders', icon: '📦' },
    { name: 'প্রোফাইল', path: '/profile', icon: '👤' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20"> {/* pb-20 দেওয়া হয়েছে যাতে নিচের মেনু কন্টেন্টকে ঢেকে না ফেলে */}
      
      {/* মেইন কন্টেন্ট এরিয়া */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add-money" element={<AddMoney />} />
        <Route path="/my-orders" element={<MyOrders />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<div className="p-10 text-center">৪ঠা৪: পেজ পাওয়া যায়নি।</div>} />
      </Routes>

      {/* বটম নেভিগেশন বার (Bottom Navigation Bar) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center h-16 shadow-2xl z-50">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center justify-center w-full h-full transition-all ${
              location.pathname === item.path 
              ? 'text-indigo-600 border-t-2 border-indigo-600 bg-indigo-50/50' 
              : 'text-gray-400'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="text-[10px] font-bold mt-1 uppercase tracking-tighter">
              {item.name}
            </span>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default App;
