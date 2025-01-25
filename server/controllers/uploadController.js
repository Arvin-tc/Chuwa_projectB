import Application from '../models/application.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const uploadFile = async (req, res) => {
    try {
        const userId = req.user.id;
        const fileType = req.body.fileType;
        const filePath = req.file?.path;
        const isVisaDoc = req.body.isVisaDoc;

        if(!fileType || !filePath) {
            return res.status(400).json({ message: 'Invalid file upload request.' });
        }

        if(isVisaDoc && !['optReceipt', 'optEAD', 'i983', 'i20'].includes(fileType)) {
            return res.status(400).json({message: 'Invalid visa document type'});
        }

        const application = await Application.findOne({userId: userId});
        if(!application) {
            return res.status(404).json({message: 'Application not found.'});
        }

        if (application.uploadedFiles[fileType]) {
            fs.unlink(path.join(__dirname, '../', application.uploadedFiles[fileType]), (err) => {
                if(err) console.error('Error deleting old file: ', err);
            });
        }

        application.uploadedFiles[fileType] = filePath;
        await application.save();
        res.status(200).json({message: 'File uploaded successfully', uploadFile: filePath});
    } catch (error) {
        console.error('Error updating uploaded files:', error);
        res.status(500).json({message:'Server error.'});
    }
};
