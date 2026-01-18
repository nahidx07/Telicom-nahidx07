import { db } from '../firebase';
import { doc, updateDoc, increment, getDoc, addDoc, collection } from 'firebase/firestore';

// ১. টাকা অ্যাড করার রিকোয়েস্ট (User Side)
export const requestAddBalance = async (userId, amount, method, transactionId) => {
    const requestData = {
        userId,
        amount: parseFloat(amount),
        method, // bKash, Nagad, Rocket
        transactionId,
        status: 'pending',
        timestamp: new Date()
    };
    
    await addDoc(collection(db, "payments"), requestData);
    
    // টেলিগ্রাম নোটিফিকেশন
    const msg = `💰 *Deposit Request!*\nUser ID: ${userId}\nAmount: ${amount} BDT\nMethod: ${method}\nTrxID: ${transactionId}`;
    sendTelegramToAdmin(msg); 
};

// ২. প্যাকেজ কেনার সময় ব্যালেন্স কাটা (Execution)
export const purchasePackage = async (userId, packagePrice) => {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists() && userSnap.data().balance >= packagePrice) {
        await updateDoc(userRef, {
            balance: increment(-packagePrice)
        });
        return { success: true };
    } else {
        return { success: false, message: "Insufficient Balance!" };
    }
};
