import React, { useState } from 'react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/');
        } catch (error) {
            alert("ইমেইল বা পাসওয়ার্ড ভুল!");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
                <h2 className="text-3xl font-black text-indigo-600 mb-2">ফিরে আসায় স্বাগতম</h2>
                <p className="text-gray-400 mb-8 text-sm">লগইন করে আপনার একাউন্টে প্রবেশ করুন</p>
                <form onSubmit={handleLogin} className="space-y-4">
                    <input type="email" placeholder="আপনার ইমেইল" className="w-full p-4 bg-gray-50 rounded-2xl border outline-none focus:ring-2 focus:ring-indigo-500" 
                    onChange={(e) => setEmail(e.target.value)} required />
                    
                    <input type="password" placeholder="পাসওয়ার্ড" className="w-full p-4 bg-gray-50 rounded-2xl border outline-none focus:ring-2 focus:ring-indigo-500" 
                    onChange={(e) => setPassword(e.target.value)} required />
                    
                    <button className="w-full bg-indigo-600 text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-indigo-700 transition">লগইন করুন</button>
                </form>
                <p className="mt-6 text-center text-sm text-gray-500">
                    একাউন্ট নেই? <Link to="/register" className="text-indigo-600 font-bold">নতুন একাউন্ট খুলুন</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
