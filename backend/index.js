const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// এনভায়রনমেন্ট ভেরিয়েবল থেকে তথ্য নেওয়া
const TELEGRAM_TOKEN = process.env.VITE_TELEGRAM_BOT_TOKEN;
const ADMIN_CHAT_ID = process.env.VITE_ADMIN_CHAT_ID;

// ১. টেলিগ্রাম নোটিফিকেশন পাঠানোর রুট (API Route)
app.post('/api/send-notification', async (req, res) => {
    const { message } = req.body;

    if (!message) {
        return res.status(400).send({ success: false, error: "Message is required" });
    }

    try {
        const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;
        await axios.post(url, {
            chat_id: ADMIN_CHAT_ID,
            text: message,
            parse_mode: 'Markdown'
        });
        res.status(200).send({ success: true, message: "Notification sent to Admin" });
    } catch (error) {
        console.error("Telegram Error:", error.response?.data || error.message);
        res.status(500).send({ success: false, error: "Failed to send notification" });
    }
});

// ২. টেলিগ্রাম বট ওয়েবহুক (Telegram Webhook - Bot Commands)
// এই রুটটি টেলিগ্রাম থেকে মেসেজ রিসিভ করবে
app.post('/api/telegram-webhook', async (req, res) => {
    const { message } = req.body;

    if (!message || !message.text) return res.sendStatus(200);

    const chatId = message.chat.id.toString();
    const text = message.text;

    // শুধুমাত্র এডমিন কমান্ড দিতে পারবে
    if (chatId === ADMIN_CHAT_ID) {
        
        // কমান্ড চেক: /start
        if (text === '/start') {
            await sendReply(chatId, "স্বাগতম এডমিন! আপনি এখান থেকে অর্ডার মনিটর করতে পারবেন।");
        }
        
        // কমান্ড চেক: /stats (উদাহরণ)
        if (text === '/stats') {
            await sendReply(chatId, "📊 আজকের রিপোর্ট:\nঅর্ডার: ১৫টি\nব্যালেন্স রিকোয়েস্ট: ৫টি");
        }

        // কমান্ড চেক: /add [phone] [amount] (ব্যালেন্স দেওয়ার কমান্ড)
        if (text.startsWith('/add')) {
            const parts = text.split(' ');
            if (parts.length === 3) {
                const phone = parts[1];
                const amount = parts[2];
                // এখানে Firebase Admin SDK ব্যবহার করে ব্যালেন্স আপডেট করা যাবে
                await sendReply(chatId, `✅ সফল! ইউজার ${phone}-এ ${amount} টাকা যোগ করা হয়েছে।`);
            } else {
                await sendReply(chatId, "❌ ভুল ফরমেট! লিখুন: /add 017xxxxxxxx 500");
            }
        }
    }

    res.sendStatus(200);
});

// রিপ্লাই ফাংশন
async function sendReply(chatId, text) {
    const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;
    await axios.post(url, { chat_id: chatId, text: text });
}

// সার্ভার পোর্ট সেটিংস
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Backend server is running on port ${PORT}`);
});
