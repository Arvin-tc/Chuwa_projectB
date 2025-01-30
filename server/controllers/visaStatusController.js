import Application from '../models/application.js';

export const getVisaStatus = async (req, res) => {
    try {
        const userId = req.user.id;
        const application = await Application.findOne({userId: userId});

        console.log('Debugging: fetch visa router');
        if(!application || application.details.visaType !== 'F1(CPT/OPT)') {
            return res.status(404).json({message: 'Visa management is not application for this user'});
        }

        console.log('Debugging: fetch visa router');
        res.status(200).json({
            status: application.status,
            feedback: application.feedback,
            visaDocument: application.uploadedFiles,
            appId: application._id
        });
    } catch(error) {
        console.error('Error fetching visa documents:', error);
        res.status(500).json({message: 'Internal Server Error'});
    }
};

export const updateVisaStatus = async (req, res) => {
    const { applicationId } = req.params;
    const { status } = req.body;

    try {
        console.log('backend appId:', applicationId);
        const application = await Application.findById(applicationId);
        if(!application) return res.status(404).json({message: 'Application not found'});

        application.status = status;

        await application.save();
        res.json({message: `visa status updated to ${status}`});
    } catch (err) {
        console.error('Error updating document status:', err);
        res.status(500).json({message: 'Server error'});
    }
};
