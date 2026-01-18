import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export const placeOrder = async (userId, phone, packageInfo) => {
    try {
        // ১. ফায়ারবেসে অর্ডার সেভ করা
        const docRef = await addDoc(collection(db, "orders"), {
            userId: userId,
            targetNumber: phone,
            packageName: packageInfo.name,
            amount: packageInfo.price,
            status: "pending",
            createdAt: serverTimestamp()
        });

        // ২. টেলিগ্রাম নোটিফিকেশন পাঠানো (Cloud Function বা সরাসরি API)
        const message = `🚨 *New Order Alert!*\n\n` +
                        `👤 User: ${phone}\n` +
                        `📦 Package: ${packageInfo.name}\n` +
                        `💰 Amount: ${packageInfo.price} BDT\n` +
                        `🆔 Order ID: ${docRef.id}`;
        
        await sendTelegramToAdmin(message); 
        
        return { success: true, id: docRef.id };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

const sendTelegramToAdmin = async (text) => {
    const botToken = "8497561673:AAGBUqSbDfN4HsYI5jbs-SAeC1kWo6i6Qkc";
    const chatId = "5024973191";
    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text: text, parse_mode: 'Markdown' })
    });
};
