import Token from '../models/token.js';
import Application from '../models/application.js';

export const getTokenHistory = async (req, res) => {
    try {
        const tokens = await Token.find().sort({createdAt: -1}).select('email name token status registrationLinkStatus expiresAt');
        res.json(tokens);
    } catch (err) {
        res.status(500).json({message: `Server Error: ${err}`});
    }
};

export const getApplicationByStatus = async (req, res) => {
    const { status } = req.params;
    try {
        const applications = await Application.find({status}).populate('userId', 'userEmail');
        res.json(applications);
    } catch (err) {
        res.status(500).json({message: `Server Error: ${err}`});
    }
};

export const updateApplicationStatus = async (req, res) => {
    const { applicationId } = req.params;
    const { status, feedback } = req.body;

    try {
        const application = await Application.findById(applicationId);
        if (!application) return res.status(404).json({message: 'Application not found'});

        application.appStatus= status;
        if ( status === 'Rejected' ) {
            application.feedback = feedback;
        }
        await application.save();
        res.json({ message: `Application ${status.toLowerCase()}` });
    } catch (error) {
        res.status(500).json({message: 'Internal Server Error'});
    }
};

export const getApplicationById = async (req, res) => {
    const { applicationId } = req.params;
    try {
        const application = await Application.findById(applicationId).populate('userId', 'username email');
        if(!application) return res.status(404).json({ message: 'Application not found' });
        res.json(application);
    } catch (err) {
        res.status(500).json({message: 'Server Error'});
    }
};
