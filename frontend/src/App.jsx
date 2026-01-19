import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { auth } from './firebase'; // আপনার ফায়ারবেস ফাইল থেকে
import { onAuthStateChanged } from 'firebase/auth';

// পেজগুলো ইম্পোর্ট করুন (নিশ্চিত করুন এই ফাইলগুলো আপনার আছে)
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Offers from './pages/Offers';
import Navbar from './components/Navbar'; // যদি নেভিগেশন বার থাকে

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ইউজার লগইন আছে কি না তা চেক করা
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div className="spinner"></div> {/* App.css থেকে এনিমেশন আসবে */}
      </div>
    );
  }

  return (
    <Router>
      <div className="app-container">
        {/* ইউজার লগইন থাকলে Navbar দেখাবে */}
        {user && <Navbar />}

        <Routes>
          {/* যদি লগইন না থাকে তবে লগইন পেজে পাঠাবে */}
          <Route 
            path="/" 
            element={user ? <Home /> : <Navigate to="/login" />} 
          />
          
          <Route 
            path="/offers" 
            element={user ? <Offers /> : <Navigate to="/login" />} 
          />
          
          <Route 
            path="/profile" 
            element={user ? <Profile /> : <Navigate to="/login" />} 
          />

          {/* লগইন এবং রেজিস্ট্রেশন রুট */}
          <Route 
            path="/login" 
            element={!user ? <Login /> : <Navigate to="/" />} 
          />
          
          <Route 
            path="/register" 
            element={!user ? <Register /> : <Navigate to="/" />} 
          />

          {/* ভুল ইউআরএল দিলে হোমে পাঠাবে */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
