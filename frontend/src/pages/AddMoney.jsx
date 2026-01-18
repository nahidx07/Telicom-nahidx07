import React, { useState } from 'react';
import { db, auth } from '../firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

const AddMoney = () => {
    const [amount, setAmount] = useState('');
    const [trxId, setTrxId] = useState('');
    const [method, setMethod] = useState('bKash');

    const handleSubmit = async () => {
        if(!amount || !trxId) return alert("সবগুলো ঘর পূরণ করুন");
        
        try {
            await addDoc(collection(db, "payments"), {
                userId: auth.currentUser.uid,
                userPhone: auth.currentUser.phoneNumber,
                amount: Number(amount),
                trxId: trxId,
                method: method,
                status: "pending", // এডমিন অ্যাপ্রুভ করলে সাকসেস হবে
                createdAt: serverTimestamp()
            });
            alert("অনুরোধ পাঠানো হয়েছে! অপেক্ষা করুন।");
        } catch (err) { alert(err.message); }
    };

    return (
        <div className="p-6 bg-white min-h-screen">
            <h2 className="text-xl font-bold mb-4 text-indigo-700">টাকা অ্যাড করুন</h2>
            <div className="bg-indigo-50 p-4 rounded-xl mb-6">
                <p className="text-sm text-gray-600">আমাদের বিকাশ নম্বর (Send Money):</p>
                <p className="font-bold text-lg text-indigo-800">017XXXXXXXX</p>
            </div>
            
            <select onChange={(e)=>setMethod(e.target.value)} className="w-full p-3 border rounded-xl mb-4">
                <option value="bKash">bKash</option>
                <option value="Nagad">Nagad</option>
                <option value="Rocket">Rocket</option>
            </select>
            
            <input type="number" placeholder="পরিমাণ (BDT)" className="w-full p-3 border rounded-xl mb-4" 
                   onChange={(e)=>setAmount(e.target.value)} />
            <input type="text" placeholder="Transaction ID (TrxID)" className="w-full p-3 border rounded-xl mb-4" 
                   onChange={(e)=>setTrxId(e.target.value)} />
            
            <button onClick={handleSubmit} className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold">
                Request Deposit
            </button>
        </div>
    );
};

export default AddMoney;
