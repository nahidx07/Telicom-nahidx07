const adjustBalance = async (userId, amount) => {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
        balance: increment(amount) // positive to add, negative to deduct
    });
    alert("Balance Updated!");
};
