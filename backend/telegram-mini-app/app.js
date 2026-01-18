// Telegram WebApp Initialization
const tg = window.Telegram.WebApp;
tg.expand(); // অ্যাপটি ফুল স্ক্রিন করবে

// ইউজারের ডাটা অটো নেয়া
const userData = tg.initDataUnsafe.user;

if (userData) {
  document.getElementById('user-name').innerText = userData.first_name;
}

// অর্ডার করার বাটন লজিক
function placeOrder(packageId) {
  // Firebase-এ ডাটা সেভ হবে
  db.collection("orders").add({
    userId: userData.id,
    userName: userData.first_name,
    packageId: packageId,
    status: "pending",
    timestamp: new Date()
  });
  
  tg.showConfirm("অর্ডারটি সফল হয়েছে! এডমিন শীঘ্রই কনফার্ম করবেন।");
}
