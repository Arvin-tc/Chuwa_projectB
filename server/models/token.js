import mongoose from 'mongoose';

const tokenSchema = new mongoose.Schema({
    token: { type: String, required: true },
    email: { type: String, required: true },
    name: { type: String },
    status: { type: String, enum: ['valid', 'used'], default: 'valid' },
    expiresAt: { type: Date, required: true },
    registrationLinkStatus: { type: String, enum: ['Not Submittted', 'Submittted'], default: 'Not Submittted' }
});

const Token = mongoose.model('Token', tokenSchema);
export default Token;
