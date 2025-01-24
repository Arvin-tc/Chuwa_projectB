import express from 'express';
import { getPersonalInfo, updatePersonalInfo } from '../controllers/personalInfoController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = express.Router();

router.get('/', authenticate, getPersonalInfo);
router.patch('/', authenticate, updatePersonalInfo);

router.get('/files/:fileName', authenticate, (req, res) => {
    const fileName = req.params.fileName;
    const filePath = path.join(__dirname, '../uploads', fileName);

    if(fs.existsSync(filePath)) {
        res.download(filePath);
    } else {
        res.status(404).json({message: 'File not found'});
    }
});

export default router;
