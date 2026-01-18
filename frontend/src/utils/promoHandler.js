export const applyPromoCode = async (code, originalPrice) => {
    const promoRef = doc(db, "promo_codes", code);
    const promoSnap = await getDoc(promoRef);

    if (promoSnap.exists()) {
        const data = promoSnap.data();
        if (data.active && new Date() < data.expiry.toDate()) {
            const discount = (originalPrice * data.percentage) / 100;
            return { valid: true, newPrice: originalPrice - discount, discount };
        }
    }
    return { valid: false, message: "Invalid or Expired Code" };
};
