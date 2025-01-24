import express from 'express';
import { uploadFile } from '../controllers/uploadController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import upload from '../middleware/multer.js';

const router = express.Router();

router.patch(
    '/',
    authenticate,
    upload.single('file'),
    uploadFile
);

export default router;
