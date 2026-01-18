const sendTelegramAlert = async (message) => {
    const BOT_TOKEN = "YOUR_BOT_TOKEN";
    const CHAT_ID = "YOUR_ADMIN_CHAT_ID";
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage?chat_id=${CHAT_ID}&text=${encodeURIComponent(message)}`;
    
    await fetch(url);
};

// উদাহরণ: যখন কেউ অর্ডার করবে
// sendTelegramAlert("নতুন অর্ডার! \nপ্যাকেজ: 40GB \nইউজার: 01700000000");
