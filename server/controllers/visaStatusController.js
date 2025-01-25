import Application from '../models/application.js';

export const getVisaStatus = async (req, res) => {
    try {
        const userId = req.user.id;
        const application = await Application.findOne({userId: userId});

        console.log('Debugging: fetch visa router');
        if(!application || application.details.visaType !== 'F1(CPT/OPT)') {
            return res.status(404).json({message: 'Visa management is not application for this user'});
        }

        res.status(200).json({
            status: application.status,
            feedback: application.feedback,
            visaDocument: application.uploadedFiles
        });
    } catch(error) {
        console.error('Error fetching visa documents:', error);
        res.status(500).json({message: 'Internal Server Error'});
    }
};
