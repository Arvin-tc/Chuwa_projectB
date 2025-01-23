import Application from '../models/application.js';

// disable email edit for now
export const getPersonalInfo = async (req, res) => {
    try {
        const userId = req.user.id;
        const application = await Application.findOne({ userId: userId });

        if(!application) {
            return res.status(404).json({ message: 'Application not found.' });
        }

        res.status(200).json(application.details);
    } catch (error) {
        console.error('Error fetching personal info:', error);
        res.status(500).json({message: 'Internal Server Errror'});
    }
};

export const updatePersonalInfo = async (req, res) => {
    try {
        const userId = req.user.id;
        const updates = req.body;
        const application = await Application.findOneAndUpdate(
            {userId: userId}, 
            { $set: { details: updates } },
            { new: true, runValidators: true }
        );

        if(!application) {
            return res.status(404).json({message: 'Application not found.'});
        }

        res.status(200).json(application.details);
    } catch (error) {
        console.error('Error updating personal info:', error);
        res.status(500).json({message: 'Internal Server Error'});
    }
};
