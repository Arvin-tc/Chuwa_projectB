import mongoose from 'mongoose';

const tokenSchema = new mongoose.Schema({
    token: { type: String, required: true },
    email: { type: String, required: true },
    status: { type: String, enum: ['valid', 'used'], default: 'valid' },
    expiresAt: { type: Date, required: true },
});

const Token = mongoose.model('Token', tokenSchema);
export default Token;
