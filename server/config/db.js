const mongoose = require('mongoose');
const Payment = require('../models/Payment');

const ensurePaymentIndexes = async () => {
    const indexes = await Payment.collection.indexes();
    const legacy = indexes.find((index) => index.name === 'razorpayPaymentId_1' && index.unique && !index.sparse);

    if (legacy) {
        await Payment.collection.dropIndex(legacy.name);
        console.log('Removed legacy non-sparse Razorpay payment index.');
    }

    await Payment.updateMany({ razorpayPaymentId: null }, { $unset: { razorpayPaymentId: 1 } });
    await Payment.syncIndexes();
};

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        await ensurePaymentIndexes();
        console.log('Payment indexes verified.');
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;