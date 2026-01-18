import { doc, updateDoc, increment, deleteDoc } from "firebase/firestore";

const approvePayment = async (paymentId, userId, amount) => {
    try {
        // ১. ইউজারের ব্যালেন্স আপডেট
        const userRef = doc(db, "users", userId);
        await updateDoc(userRef, {
            balance: increment(amount)
        });

        // ২. পেমেন্ট স্ট্যাটাস আপডেট বা রিমুভ
        const payRef = doc(db, "payments", paymentId);
        await updateDoc(payRef, { status: "approved" });

        alert("পেমেন্ট সফলভাবে যোগ হয়েছে!");
    } catch (err) { console.log(err); }
};
