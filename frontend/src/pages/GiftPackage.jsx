import React, { useState } from 'react';

const GiftPackage = ({ selectedPackage }) => {
    const [recipientNumber, setRecipientNumber] = useState('');

    const handleGift = async () => {
        if(recipientNumber.length !== 11) return alert("Invalid Number");
        
        // এখানে purchasePackage লজিক কল হবে
        // এবং অর্ডারে recipientNumber সেভ হবে
        alert(`Gifting ${selectedPackage.name} to ${recipientNumber}`);
    };

    return (
        <div className="p-4 bg-white rounded-t-3xl shadow-2xl fixed bottom-0 w-full">
            <h3 className="font-bold text-lg mb-2">Gift this Package</h3>
            <input 
                type="number" 
                placeholder="Recipient Mobile Number" 
                className="w-full p-3 border rounded-xl mb-4 focus:ring-2 focus:ring-indigo-500"
                onChange={(e) => setRecipientNumber(e.target.value)}
            />
            <button 
                onClick={handleGift}
                className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold"
            >
                Confirm Gift (৳{selectedPackage.price})
            </button>
        </div>
    );
};
