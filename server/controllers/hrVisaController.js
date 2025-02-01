import express, {application} from 'express';
import Application from '../models/application.js';
import nodemailer from 'nodemailer';

export const hrGetVisaApplications = async (req, res) => {
    try {
        const applications = await Application.find({});
        const visaApplications = applications.map((app) => {
            const nextStep = calculateNextStep(app);
            const daysRemaining = calculateDaysRemaining(app.details.visaEndDate);

            return {
                _id: app._id,
                status: app.status,
                details: app.details,
                uploadedFiles: app.uploadedFiles,
                pendingDocuments: getPendingDocuments(app),
                appStatus: app.appStatus,
                nextStep,
                daysRemaining,
            };
        });
        res.json(visaApplications);
    } catch (err){
        console.error('Error fetching visa status for hr', err);
        res.status(500).json({ message: 'Server Error' });
    }
};

export const hrUpdateVisaDoc = async (req, res) => {
    const { applicationId, docType } = req.params;
    const { status, feedback } = req.body;

    try {
        const application = await Application.findById(applicationId);
        if(!application) return res.status(404).json({message: 'Application not found'});

        if(status === 'Approved') {
            application.status = 'Approved';
        } else {
            application.status = 'Rejected';
            application.feedback = feedback;
        }

        await application.save();
        res.json({message: `${docType.toLowerCase()} ${status}`});
    } catch (err) {
        console.error('Error updating document status:', err);
        res.status(500).json({message: 'Server error'});
    }
};

export const hrSendEmailNotification = async(req, res) => {

    const { applicationId } = req.params;

    console.log('remidner app:', applicationId);
    try {
        const application = await Application.findById(applicationId);
        if(!application) return res.status(404).json({message: 'Application not found'});

        const transporter = nodemailer.createTransport({
            host: 'smtp.mailtrap.io',
            port: 2525,
            auth: {
                user: process.env.MAILTRAP_USER,
                pass: process.env.MAILTRAP_PASS,
            },
        });

        const mailOptions = {
            from: '"HR Portal" <no-reply@hrportal.com>',
            to: application.userEmail,
            subject: 'Upload File Reminder',
            text: `Hello ${application.details.firstName},
            This is a reminder to complete the following step for your visa process:
            ${calculateNextStep(application)}
            `,

        };
        transporter.sendMail(mailOptions);
        res.json({message: 'Reminder email sent'});
    } catch (error) {
        console.error('Error sending reminder email:', error);
        res.status(500).json({message: 'Server error'});
    }
};





const calculateNextStep = (application) => {
    const { uploadedFiles, status } = application;


    const documentTypes = ['optReceipt', 'optEAD', 'i983', 'i20'];

    for (let i = 0; i < documentTypes.length; i++) {
        const docType = documentTypes[i];

        if (!uploadedFiles[docType]) {
            return `Upload ${docType}`;
        }

        const nextIndex = i + 1;
        const nextDocType = nextIndex < documentTypes.length ? documentTypes[nextIndex] : null;
        const nextDocExists = nextDocType && uploadedFiles[nextDocType];

        console.log(`docType:${docType}, nextDocType:${nextDocType}, nextDocExists:${nextDocExists}`);
        if (status === 'Pending' && nextDocExists) {
            continue;
        }

        if (status === 'Pending' && !nextDocExists) {
            return `Wait for HR approval of ${docType}`;
        }

        if (status === 'Rejected' && !nextDocExists) {
            return `Re-upload ${docType} (Rejected by HR)`;
        }

        if (status === 'Rejected' && nextDocExists) {
            continue
        }
    }

    return 'All documents approved';
};





const calculateDaysRemaining = (visaEndDate) => {
    if(!visaEndDate) return 'Unknown';
    const now = new Date();
    const endDate = new Date(visaEndDate);
    const diff = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 'Expired';
};


const getPendingDocuments = (application) => {
    const pending = {};
    const requiredDocs = ['optReceipt', 'optEAD', 'i983', 'i20'];

    requiredDocs.forEach((doc) => {
        const isUploaded = Boolean(application.uploadedFiles[doc]); // Check if the document is uploaded
        const isApproved = application.status === 'Approved'; // Check the overall application status

        if (!isUploaded || !isApproved) {
            pending[doc] = isUploaded ? application.uploadedFiles[doc] : null;
        }
    });

    return pending;
};


