import express from 'express';
import { sendRegistrationEmail } from '../controllers/authController.js';
import { 
    getTokenHistory, 
    getApplicationById,
    getApplicationByStatus,
    updateApplicationStatus,
} from '../controllers/hiringManagementController.js';

const router = express.Router();

router.post('/generate-token', sendRegistrationEmail);
router.get('/token-history', getTokenHistory);

router.get('/applications/:status', getApplicationByStatus);
router.get('/application/:applicationId', getApplicationById);
router.patch('/application/:applicationId', updateApplicationStatus);

export default router;

