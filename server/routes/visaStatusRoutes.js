import express from 'express';
import { getVisaStatus, updateVisaStatus } from '../controllers/visaStatusController.js';
import {authenticate} from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', authenticate, getVisaStatus);
router.patch('/:applicationId', authenticate, updateVisaStatus);

export default router;
