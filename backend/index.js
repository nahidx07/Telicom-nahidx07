const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// এনভায়রনমেন্ট ভেরিয়েবল (Vercel বা .env ফাইল থেকে আসবে)
const TELEGRAM_TOKEN = process.env.VITE_TELEGRAM_BOT_TOKEN;
const ADMIN_CHAT_ID = process.env.VITE_ADMIN_CHAT_ID;

// ১. হেলথ চেক রুট (সার্ভার ঠিক আছে কি না দেখার জন্য)
app.get('/', (req, res) => {
    res.send('SIM Service Backend is Running...');
});

// ২. ইন-অ্যাপ নোটিফিকেশন এপিআই (Frontend থেকে কল হবে)
app.post('/api/notify', async (req, res) => {
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ success: false, error: "Message is empty" });
    }

    try {
        const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;
        await axios.post(url, {
            chat_id: ADMIN_CHAT_ID,
            text: message,
            parse_mode: 'Markdown'
        });
        res.status(200).json({ success: true, message: "Notification sent!" });
    } catch (error) {
        console.error("Telegram API Error:", error.message);
        res.status(500).json({ success: false, error: "Failed to send notification" });
    }
});

// ৩. টেলিগ্রাম ওয়েবহুক (বট কমান্ড হ্যান্ডেল করার জন্য)
app.post('/api/telegram-webhook', async (req, res) => {
    try {
        const { message } = req.body;

        if (!message || !message.text) return res.sendStatus(200);

        const chatId = message.chat.id.toString();
        const text = message.text;

        // শুধু এডমিন চ্যাট আইডি থেকে কমান্ড গ্রহণ করবে
        if (chatId === ADMIN_CHAT_ID) {
            if (text === '/start') {
                await sendTelegramMessage(chatId, "👋 স্বাগতম এডমিন! \nআপনি এখান থেকে সব নোটিফিকেশন পাবেন।");
            } 
            else if (text === '/status') {
                await sendTelegramMessage(chatId, "📊 সার্ভার স্ট্যাটাস: অনলাইন ✅\nডেটাবেস: কানেক্টেড ✅");
            }
            else if (text.startsWith('/broadcast')) {
                const broadcastMsg = text.replace('/broadcast', '').trim();
                await sendTelegramMessage(chatId, `📢 ব্রডকাস্টিং: ${broadcastMsg}`);
                // এখানে ইউজারদের ডাটাবেস থেকে নিয়ে মেসেজ পাঠানোর লজিক যোগ করা যাবে
            }
        } else {
            // সাধারণ ইউজারদের জন্য রিপ্লাই
            await sendTelegramMessage(chatId, "ধন্যবাদ! আমাদের অ্যাপটি ব্যবহার করতে /start কমান্ড দিন অথবা অ্যাপটি ওপেন করুন।");
        }

        res.sendStatus(200);
    } catch (err) {
        console.error("Webhook Error:", err.message);
        res.sendStatus(200); // টেলিগ্রামকে ২০০ পাঠাতে হবে যাতে সে বারবার রিকোয়েস্ট না করে
    }
});

// ৪. টেলিগ্রাম মেসেজ পাঠানোর কমন ফাংশন
async function sendTelegramMessage(chatId, text) {
    const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;
    try {
        await axios.post(url, {
            chat_id: chatId,
            text: text,
            parse_mode: 'Markdown'
        });
    } catch (err) {
        console.error("Error sending Telegram message:", err.message);
    }
}

// সার্ভার স্টার্ট
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
