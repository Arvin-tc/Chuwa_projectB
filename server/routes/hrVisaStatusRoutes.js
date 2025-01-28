import express from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import { hrUpdateVisaDoc, hrGetVisaApplications, hrSendEmailNotification } from '../controllers/hrVisaController.js';

const router = express.Router();

router.get('/employees', authenticate, hrGetVisaApplications);
router.patch('/:applicationId/document/:docType', authenticate, hrUpdateVisaDoc);
router.post('/:applicationId/notify', authenticate, hrSendEmailNotification);

export default router;

