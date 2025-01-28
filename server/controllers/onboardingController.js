import Application from '../models/application.js';
import path from 'path';
import fs from 'fs';

export const getOnboardingStatus = async (req, res) => {
    try {
        const user = req.user;
        // TODO user._id or user.id?
        const application = await Application.findOne({userId: user.id});  
        if(!application) {
            return res.json({ statue: '', application: null });
        }

        res.json({
            status: application.status,
            application: application.details,
            feedback: application.feedback || '',
        });
    } catch (error) {
        console.error('Error fetching onboarding status:', error);
        res.status(500).json({message: 'Server error'});
    }
};

export const submitOnboarding = async (req, res) => {
    try {
        const user = req.user;
        if (!user || !user.id) {
            console.error('User ID is missing in req.user:', req.user); 
            return res.status(401).json({ message: 'User not authenticated.' });
        }

        console.log('User ID:', user.id);

        const { firstName, lastName, address, cellPhone, ssn, dob, gender, citizenship, 
            visaType, visaStartDate, visaEndDate, reference, emergencyContacts } = req.body;

        const profilePicture = req.files?.profilePicture?.[0]?.path || null;  // multer store files in array so indexing 0 here
        const driverLicense = req.files?.driverLicense?.[0]?.path || null;
        const workAuthorization = req.files?.workAuthorization?.[0]?.path || null;
        const optReceipt = req.files?.optReceipt?.[0]?.path || null;

        let application = await Application.findOne({ userId: user.id });
        if(!application) {
            console.log('Creating a new application for user:', user.id); 
            application = new Application({ userId: user.id });
        }

        application.details = {
            firstName,
            lastName,
            address: JSON.parse(address),
            cellPhone,
            ssn,
            dob,
            gender,
            citizenship,
            visaType,
            visaStartDate,
            visaEndDate,
            reference: JSON.parse(reference),
            emergencyContacts: JSON.parse(emergencyContacts),
        };

        application.uploadedFiles = {
            profilePicture,
            driverLicense,
            workAuthorization,
            optReceipt,
        };

        application.status = 'Pending';

        await application.save();
        res.json({ message: 'Application submitted successfully' });

    } catch (error) {
        console.error('Error submitting onboarding application:', error);
        res.status(500).json({ message: 'Server error' });
    }
};


{/* hr used to for onborading */}
export const getApplicationsByStatus = async (req, res) => {
    const { status } = req.query;
  
    try {
      const query = status ? { status } : {};
      const applications = await Application.find(query).populate('userId', 'username email');
      res.json(applications);
    } catch (error) {
      console.error('Error fetching applications:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };

  export const updateApplicationStatus = async (req, res) => {
    const { id } = req.params;
    const { status, feedback } = req.body;
  
    try {
      const application = await Application.findById(id);
      if (!application) {
        return res.status(404).json({ message: 'Application not found' });
      }
  
      application.status = status;
      if (feedback) application.feedback = feedback;
  
      await application.save();
      res.json({ message: 'Application updated successfully' });
    } catch (error) {
      console.error('Error updating application status:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };
