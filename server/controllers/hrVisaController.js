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

    if (!uploadedFiles.optReceipt) {
        return 'Upload optReceipt';
    } else if (status === 'Rejected') {
        return 'Re-upload optReceipt (Rejected by HR)';
    } else if ( status === 'Pending') {
        return 'Wait for HR approval of optReceipt';
    }

    if (!uploadedFiles.optEAD) {
        return 'Upload optEAD';
    } else if ( status === 'Rejected') {
        return 'Re-upload optEAD (Rejected by HR)';
    } else if ( status === 'Pending') {
        return 'Wait for HR approval of optEAD';
    }

    if (!uploadedFiles.i983) {
        return 'Upload i983';
    } else if ( status === 'Rejected') {
        return 'Re-upload i983 (Rejected by HR)';
    } else if ( status === 'Pending') {
        return 'Wait for HR approval of i983';
    }

    if (!uploadedFiles.i20) {
        return 'Upload i20';
    } else if ( status === 'Rejected') {
        return 'Re-upload i20 (Rejected by HR)';
    } else if ( status === 'Pending') {
        return 'Wait for HR approval of i20';
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


