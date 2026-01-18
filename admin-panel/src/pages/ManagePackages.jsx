import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { 
    collection, 
    addDoc, 
    getDocs, 
    doc, 
    deleteDoc, 
    updateDoc, 
    serverTimestamp 
} from 'firebase/firestore';

const ManagePackages = () => {
    const [packages, setPackages] = useState([]);
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [operator, setOperator] = useState('GP');
    const [loading, setLoading] = useState(false);

    // ১. ডাটাবেস থেকে প্যাকেজ লোড করা
    const fetchPackages = async () => {
        const querySnapshot = await getDocs(collection(db, "packages"));
        const list = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPackages(list);
    };

    useEffect(() => {
        fetchPackages();
    }, []);

    // ২. নতুন প্যাকেজ যোগ করা
    const handleAddPackage = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await addDoc(collection(db, "packages"), {
                name,
                price: Number(price),
                operator,
                createdAt: serverTimestamp()
            });
            setName(''); setPrice('');
            fetchPackages();
            alert("প্যাকেজ সফলভাবে যোগ করা হয়েছে!");
        } catch (error) {
            alert("Error: " + error.message);
        }
        setLoading(false);
    };

    // ৩. প্যাকেজ ডিলিট করা
    const handleDelete = async (id) => {
        if (window.confirm("আপনি কি এই প্যাকেজটি মুছে ফেলতে চান?")) {
            await deleteDoc(doc(db, "packages", id));
            fetchPackages();
        }
    };

    return (
        <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-2xl font-black mb-8 uppercase">প্যাকেজ ম্যানেজমেন্ট</h1>

                {/* প্যাকেজ যোগ করার ফর্ম */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mb-10">
                    <h2 className="text-lg font-bold mb-4">নতুন অফার যোগ করুন</h2>
                    <form onSubmit={handleAddPackage} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <input 
                            type="text" placeholder="প্যাকেজের নাম (Ex: 50GB 1600Min)" 
                            value={name} onChange={(e) => setName(e.target.value)}
                            className="p-3 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" required
                        />
                        <input 
                            type="number" placeholder="মূল্য (৳)" 
                            value={price} onChange={(e) => setPrice(e.target.value)}
                            className="p-3 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" required
                        />
                        <select 
                            value={operator} onChange={(e) => setOperator(e.target.value)}
                            className="p-3 border rounded-xl outline-none"
                        >
                            <option value="GP">GP</option>
                            <option value="Robi">Robi</option>
                            <option value="Airtel">Airtel</option>
                            <option value="Banglalink">Banglalink</option>
                        </select>
                        <button 
                            disabled={loading}
                            className="bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition shadow-lg"
                        >
                            {loading ? 'Adding...' : 'Add Offer'}
                        </button>
                    </form>
                </div>

                {/* প্যাকেজ লিস্ট */}
                <div className="grid gap-4">
                    <h2 className="text-lg font-bold">বর্তমান অফারসমূহ</h2>
                    {packages.map((pkg) => (
                        <div key={pkg.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-white ${
                                    pkg.operator === 'GP' ? 'bg-blue-500' : pkg.operator === 'Robi' ? 'bg-red-600' : 'bg-orange-500'
                                }`}>
                                    {pkg.operator[0]}
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-800">{pkg.name}</h3>
                                    <p className="text-sm text-indigo-600 font-bold">৳{pkg.price}</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => handleDelete(pkg.id)}
                                className="text-red-500 bg-red-50 p-2 rounded-lg hover:bg-red-100 transition"
                            >
                                🗑️ Delete
                            </button>
                        </div>
                    ))}
                    {packages.length === 0 && <p className="text-gray-400 text-center py-10">কোন প্যাকেজ পাওয়া যায়নি।</p>}
                </div>
            </div>
        </div>
    );
};

export default ManagePackages;
