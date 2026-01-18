const functions = require("firebase-functions");
const admin = require("firebase-admin");
const axios = require("axios");

admin.initializeApp();

const TELEGRAM_BOT_TOKEN = "YOUR_BOT_TOKEN";
const ADMIN_CHAT_ID = "YOUR_ADMIN_CHAT_ID";

// টেলিগ্রামে মেসেজ পাঠানোর ফাংশন
const sendTelegramAdmin = async (message) => {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  await axios.post(url, {
    chat_id: ADMIN_CHAT_ID,
    text: message,
    parse_mode: "HTML"
  });
};

// ১. নতুন অর্ডার নোটিফিকেশন
exports.onNewOrder = functions.firestore
  .document("orders/{orderId}")
  .onCreate(async (snap, context) => {
    const order = snap.data();
    const msg = `🔔 <b>নতুন অর্ডার!</b>\n\n👤 ইউজার: ${order.userName}\n📱 নাম্বার: ${order.phone}\n📦 প্যাক: ${order.packageName}\n💰 দাম: ${order.price} টাকা`;
    return sendTelegramAdmin(msg);
  });

// ২. টাকা এড করার রিকোয়েস্ট (Wallet Deposit)
exports.onDepositRequest = functions.firestore
  .document("payments/{paymentId}")
  .onCreate(async (snap, context) => {
    const payment = snap.data();
    const msg = `💳 <b>টাকা এড রিকোয়েস্ট!</b>\n\n👤 ইউজার: ${payment.userName}\n💵 পরিমাণ: ${payment.amount} টাকা\n🆔 ট্রানজেকশন ID: ${payment.trxId}\n🏦 মেথড: ${payment.method}`;
    return sendTelegramAdmin(msg);
  });

// ৩. নতুন ইউজার রেজিস্ট্রেশন
exports.onNewUser = functions.firestore
  .document("users/{userId}")
  .onCreate(async (snap, context) => {
    const user = snap.data();
    const msg = `👤 <b>নতুন ইউজার জয়েন করেছে!</b>\n\nনাম: ${user.name}\nফোন: ${user.phone}`;
    return sendTelegramAdmin(msg);
  });
