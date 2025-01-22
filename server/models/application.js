import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
    feedback: { type: String },
    details: {
        firstName: { type: String, required: true },
        lastName: { type: String }, // Not required for testing
        address: {
            apt: { type: String },
            street: { type: String },
            city: { type: String },
            state: { type: String },
            zip: { type: String }
        },
        cellPhone: { type: String },
        ssn: { type: String },
        dob: { type: Date },
        gender: { type: String, enum: ['Male', 'Female', 'Prefer not to say'] },
        citizenship: { type: String, enum: ['Citizen', 'Green Card', 'Work Authorization'] },
        visaType: { type: String },
        visaStartDate: { type: Date },
        visaEndDate: { type: Date },
        reference: {
            firstName: { type: String },
            lastName: { type: String },
            relationship: { type: String }
        },
        emergencyContacts: [{
            firstName: { type: String },
            lastName: { type: String },
            relationship: { type: String },
            phone: { type: String },
            email: { type: String }
        }]
    },
    uploadedFiles: {
        profilePicture: { type: String },
        driverLicense: { type: String },
        workAuthorization: { type: String },
        optReceipt: { type: String }
    }
}, { timestamps: true });

const Application = mongoose.model('Application', applicationSchema);
export default Application;
