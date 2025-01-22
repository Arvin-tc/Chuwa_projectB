import Application from '../models/application.js';
import User from '../models/userModel.js'; 
import path from 'path';
import fs from 'fs';

export const getOnboardingStatus = async (req, res) => {
    try {
        const user = req.user;
        console.log('user:', user);
        // TODO user._id or user.id?
        const application = await Application.findOne({userId: user.id});  
        const userForEmail = await User.findById(user.id);
        const userEmail = userForEmail.email;
        console.log(userEmail);
        if(!application) {

            return res.json({ status: '', application: null, email: userEmail});
        }

        res.json({
            status: application.status,
            application: application.details,
            feedback: application.feedback || '',
            email: userEmail,
        });
    } catch (error) {
        console.error('Error fetching onboarding status:', error);
        res.status(500).json({message: 'Server error'});
    }
};

export const submitOnboarding = async (req, res) => {
    try {
        const userId = req.user.id;
        console.log(`User ID: ${userId}`);
        console.log('req.body:', req.body);

        // Extract data directly from req.body
        const {
            firstName,
            lastName,
            address,
            cellPhone,
            ssn,
            dob,
            gender,
            citizenship,
            visaType,
            visaStartDate,
            visaEndDate,
        } = req.body;

        if (!firstName) {
            return res.status(400).json({ message: "First name is required." });
        }

        const reference = {
            firstName: req.body['reference.firstName'],
            lastName: req.body['reference.lastName'],
            relationship: req.body['reference.relationship'],
            phone: req.body['reference.phone'],
            email: req.body['reference.email'],
        };

        const emergencyContacts = [];
        Object.keys(req.body)
            .filter((key) => key.startsWith('emergencyContacts'))
            .forEach((key) => {
                const match = key.match(/emergencyContacts\[(\d+)]\.(.+)/);
                if (match) {
                    const index = parseInt(match[1], 10);
                    const field = match[2];
                    emergencyContacts[index] = {
                        ...emergencyContacts[index],
                        [field]: req.body[key],
                    };
                }
            });

        console.log("Creating a new application for user:", userId);

        // Create or find the application
        let application = await Application.findOne({ userId });
        if (!application) {
            application = new Application({ userId });
        }

        // Update application fields
        application.details = {
            ...application.details,
            firstName,
            lastName: lastName || "",
            address: address || {},
            cellPhone: cellPhone || "",
            ssn: ssn || "",
            dob: dob || null,
            gender: gender || "",
            citizenship: citizenship || "",
            visaType: visaType || "",
            visaStartDate: visaStartDate || null,
            visaEndDate: visaEndDate || null,
            reference: reference || {},
            emergencyContacts: emergencyContacts || [],
        };

        // Handle uploaded files
        application.uploadedFiles = {
            profilePicture: req.files?.profilePicture?.[0]?.path || "",
            driverLicense: req.files?.driverLicense?.[0]?.path || "",
            workAuthorization: req.files?.workAuthorization?.[0]?.path || "",
            optReceipt: req.files?.optReceipt?.[0]?.path || "",
        };

        await application.save();
        res.status(200).json({ message: "Application submitted successfully.", application });
    } catch (error) {
        console.error("Error submitting onboarding application:", error);
        res.status(500).json({ message: "Server error.", error: error.message });
    }
};
