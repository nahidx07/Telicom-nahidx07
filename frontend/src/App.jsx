import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';

// পেজগুলো ইমপোর্ট করুন
import Home from './pages/Home';
import AddMoney from './pages/AddMoney';
import MyOrders from './pages/MyOrders';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  // ইউজার লগইন অবস্থায় আছে কি না তা চেক করা
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center h-screen bg-white">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
    </div>
  );

  // বটম নেভিগেশন আইটেম (লগইন করা থাকলে দেখাবে)
  const navItems = [
    { name: 'অফার', path: '/', icon: '🎁' },
    { name: 'রিচার্জ', path: '/add-money', icon: '⚡' },
    { name: 'অর্ডার', path: '/my-orders', icon: '📝' },
    { name: 'প্রোফাইল', path: '/profile', icon: '👤' },
  ];

  // কিছু কিছু পেজে আমরা নিচের মেনু বার দেখাব না (যেমন: লগইন বা রেজিস্ট্রেশন)
  const hideNav = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans">
      
      <Routes>
        {/* পাবলিক রুটস */}
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
        <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />

        {/* প্রটেক্টেড রুটস (লগইন ছাড়া ঢোকা যাবে না) */}
        <Route path="/" element={user ? <Home /> : <Navigate to="/login" />} />
        <Route path="/add-money" element={user ? <AddMoney /> : <Navigate to="/login" />} />
        <Route path="/my-orders" element={user ? <MyOrders /> : <Navigate to="/login" />} />
        <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
        
        {/* ৪ঠা৪ পেজ */}
        <Route path="*" element={<div className="p-10 text-center font-bold">পেজ পাওয়া যায়নি!</div>} />
      </Routes>

      {/* বটম নেভিগেশন বার (শুধু লগইন থাকলে এবং নির্দিষ্ট পেজে দেখাবে) */}
      {!hideNav && user && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex justify-around items-center h-16 shadow-[0_-5px_15px_rgba(0,0,0,0.05)] z-50 rounded-t-3xl">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center w-full h-full transition-all duration-300 ${
                location.pathname === item.path 
                ? 'text-indigo-600 scale-110' 
                : 'text-gray-400 opacity-70'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className={`text-[10px] font-black mt-1 uppercase tracking-tighter ${
                location.pathname === item.path ? 'block' : 'hidden'
              }`}>
                {item.name}
              </span>
            </Link>
          ))}
        </nav>
      )}
    </div>
  );
};

export default App;
