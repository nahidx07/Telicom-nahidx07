import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { 
    collection, 
    onSnapshot, 
    doc, 
    updateDoc, 
    query, 
    orderBy 
} from 'firebase/firestore';

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // ১. ডাটাবেস থেকে সকল ইউজার ফেচ করা
    useEffect(() => {
        const q = query(collection(db, "users"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setUsers(list);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    // ২. ব্যালেন্স আপডেট করার ফাংশন
    const handleEditBalance = async (userId, currentBalance) => {
        const newBalance = window.prompt(`নতুন ব্যালেন্স লিখুন (বর্তমানে আছে: ৳${currentBalance})`, currentBalance);
        
        if (newBalance !== null && !isNaN(newBalance)) {
            try {
                const userRef = doc(db, "users", userId);
                await updateDoc(userRef, {
                    balance: Number(newBalance)
                });
                alert("ব্যালেন্স আপডেট করা হয়েছে!");
            } catch (error) {
                alert("এরর: " + error.message);
            }
        }
    };

    // ৩. সার্চ ফিল্টারিং
    const filteredUsers = users.filter(user => 
        user.phone?.includes(searchTerm) || user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="p-10 text-center font-bold">ইউজার লিস্ট লোড হচ্ছে...</div>;

    return (
        <div className="p-4 md:p-8 bg-gray-50 min-h-screen font-sans">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-2xl font-black text-gray-800 uppercase tracking-tight">ইউজার লিস্ট</h1>
                        <p className="text-gray-500 text-sm">সকল নিবন্ধিত ইউজার এবং তাদের ব্যালেন্স ম্যানেজ করুন</p>
                    </div>
                    
                    {/* সার্চ বক্স */}
                    <div className="w-full md:w-64">
                        <input 
                            type="text" 
                            placeholder="নম্বর বা ইমেইল দিয়ে খুঁজুন..." 
                            className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="p-5 text-xs font-black text-gray-400 uppercase">ইউজার ইনফো</th>
                                    <th className="p-5 text-xs font-black text-gray-400 uppercase">রোল</th>
                                    <th className="p-5 text-xs font-black text-gray-400 uppercase">ব্যালেন্স</th>
                                    <th className="p-5 text-xs font-black text-gray-400 uppercase">যোগদান</th>
                                    <th className="p-5 text-xs font-black text-gray-400 uppercase">অ্যাকশন</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-indigo-50/30 transition">
                                        <td className="p-5">
                                            <p className="font-bold text-gray-800">{user.phone || 'N/A'}</p>
                                            <p className="text-xs text-gray-400">{user.email}</p>
                                        </td>
                                        <td className="p-5">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                                                user.role === 'admin' ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-600'
                                            }`}>
                                                {user.role || 'user'}
                                            </span>
                                        </td>
                                        <td className="p-5">
                                            <span className="text-lg font-black text-indigo-600">৳{user.balance || 0}</span>
                                        </td>
                                        <td className="p-5 text-xs text-gray-500">
                                            {user.createdAt?.toDate() ? new Date(user.createdAt.toDate()).toLocaleDateString() : 'পুরাতন'}
                                        </td>
                                        <td className="p-5">
                                            <button 
                                                onClick={() => handleEditBalance(user.id, user.balance || 0)}
                                                className="bg-white border border-indigo-200 text-indigo-600 hover:bg-indigo-600 hover:text-white px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm"
                                            >
                                                Edit Balance
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {filteredUsers.length === 0 && (
                        <div className="text-center py-20 text-gray-400">
                            <p>কোন ইউজার পাওয়া যায়নি!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ManageUsers;
