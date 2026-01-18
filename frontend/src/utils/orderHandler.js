export const handlePurchase = async (user, pkg) => {
    if (user.balance < pkg.price) {
        return alert("আপনার ব্যালেন্স কম! আগে টাকা অ্যাড করুন।");
    }

    // অর্ডার প্রসেস করা
    // ১. ব্যালেন্স কাটা
    // ২. অর্ডার কালেকশনে ডাটা সেভ
    // ৩. টেলিগ্রাম নোটিফিকেশন পাঠানো
};
