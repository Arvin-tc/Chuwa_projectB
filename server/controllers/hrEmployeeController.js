import Application from '../models/application.js';

export const getEmployeeProfiles = async (req, res) => {
    try {
        const employees = await Application.find({}, 'userEmail details uploadedFiles')
            .sort({ 'details.lastName':1 })
            .exec();

        console.log(employees);
        res.status(200).json(employees);
    } catch (err) {
        console.error('Error fetching employee profiles:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
