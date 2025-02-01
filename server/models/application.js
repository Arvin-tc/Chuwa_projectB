import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    userEmail: { type: String },
    // current file status
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
    // app status
    appStatus: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
    feedback: { type: String },
    details: {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        address: {
            apt: { type: String, required: true },
            street: { type: String, required: true },
            city: { type: String, required: true },
            state: { type: String, required: true },
            zip: { type: String, required: true }
        },
        cellPhone: { type: String, required: true },
        ssn: { type: String , required: true},
        dob: { type: Date , required: true},
        gender: { type: String, enum: ['Male', 'Female', 'Prefer not to say'] , required: true},
        citizenship: { type: String, enum: ['Citizen', 'Green Card', 'Work Authorization'] , required: true},
        visaType: { type: String , required: true},
        visaStartDate: { type: Date , required: true},
        visaEndDate: { type: Date , required: true},
        reference: {
            firstName: { type: String },
            lastName: { type: String },
            relationship: { type: String },
            phone: { type: String },
            email: { type: String }

        },
        emergencyContacts: [{
            firstName: { type: String },
            lastName: { type: String },
            relationship: { type: String },
            phone: { type: String },
            email: { type: String }
        }]
    },
    
    // TODO add status for each file
    uploadedFiles: {
        profilePicture: { type: String },
        driverLicense: { type: String },
        workAuthorization: { type: String },
        optReceipt: { type: String },
        optEAD: { type: String },
        i983: { type: String },
        i20: { type: String }
    }
}, { timestamps: true });

const Application = mongoose.model('Application', applicationSchema);
export default Application;
