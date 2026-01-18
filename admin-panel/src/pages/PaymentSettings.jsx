import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, updateDoc, getDoc } from 'firebase/firestore';

const PaymentSettings = () => {
    const [methods, setMethods] = useState({
        bkash: { number: '', type: '' },
        nagad: { number: '', type: '' }
    });

    const updateNumber = async (id, newNumber, newType) => {
        const docRef = doc(db, "payment_methods", id);
        await updateDoc(docRef, { number: newNumber, type: newType });
        alert(id + " নম্বর আপডেট হয়েছে!");
    };

    return (
        <div className="p-8 bg-white rounded-2xl shadow-sm">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Payment Method Settings</h2>
            
            {['bkash', 'nagad', 'rocket'].map((m) => (
                <div key={m} className="mb-6 p-4 border rounded-xl flex items-center gap-4">
                    <img src={`/icons/${m}.png`} className="w-12 h-12" alt={m} />
                    <input 
                        placeholder={`${m} Number`} 
                        className="border p-2 rounded w-full"
                        id={`${m}-num`}
                    />
                    <select id={`${m}-type`} className="border p-2 rounded">
                        <option value="Personal">Personal</option>
                        <option value="Agent">Agent</option>
                    </select>
                    <button 
                        onClick={() => updateNumber(m, document.getElementById(`${m}-num`).value, document.getElementById(`${m}-type`).value)}
                        className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold"
                    >
                        Save
                    </button>
                </div>
            ))}
        </div>
    );
};
