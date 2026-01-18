import React, { useState } from 'react';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const res = await createUserWithEmailAndPassword(auth, email, password);
            // ইউজার প্রোফাইল তৈরি করা
            await setDoc(doc(db, "users", res.user.uid), {
                uid: res.user.uid,
                email: email,
                phone: phone,
                balance: 0,
                role: 'user',
                createdAt: serverTimestamp()
            });
            alert("একাউন্ট তৈরি সফল হয়েছে!");
            navigate('/');
        } catch (error) {
            alert("ভুল হয়েছে: " + error.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
                <h2 className="text-3xl font-black text-indigo-600 mb-2">নতুন একাউন্ট</h2>
                <p className="text-gray-400 mb-8 text-sm">সঠিক তথ্য দিয়ে রেজিস্ট্রেশন সম্পন্ন করুন</p>
                <form onSubmit={handleRegister} className="space-y-4">
                    <input type="text" placeholder="মোবাইল নম্বর" className="w-full p-4 bg-gray-50 rounded-2xl border outline-none focus:ring-2 focus:ring-indigo-500" 
                    onChange={(e) => setPhone(e.target.value)} required />
                    
                    <input type="email" placeholder="ইমেইল" className="w-full p-4 bg-gray-50 rounded-2xl border outline-none focus:ring-2 focus:ring-indigo-500" 
                    onChange={(e) => setEmail(e.target.value)} required />
                    
                    <input type="password" placeholder="পাসওয়ার্ড (৬ সংখ্যা)" className="w-full p-4 bg-gray-50 rounded-2xl border outline-none focus:ring-2 focus:ring-indigo-500" 
                    onChange={(e) => setPassword(e.target.value)} required />
                    
                    <button className="w-full bg-indigo-600 text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-indigo-700 transition">রেজিস্ট্রেশন করুন</button>
                </form>
                <p className="mt-6 text-center text-sm text-gray-500">
                    আগে থেকেই একাউন্ট আছে? <Link to="/login" className="text-indigo-600 font-bold">লগইন করুন</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;

