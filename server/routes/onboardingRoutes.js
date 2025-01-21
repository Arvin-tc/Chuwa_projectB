import express from 'express';
import { getOnboardingStatus, submitOnboarding } from '../controllers/onboardingController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import upload from '../middleware/multer.js';

const router = express.Router();

router.get('/', authenticate, getOnboardingStatus);

router.post(
    '/',
    authenticate,
    upload.fields([  // when dealing multiple files use fields() to specify name of each file field and its maxcount
        { name: 'profilePicture', maxCount: 1 },  
        { name: 'driverLicense', maxCount: 1 },
        { name: 'workAuthorization', maxCount: 1 },
        { name: 'optReceipt', maxCount: 1 },
    ]),
    submitOnboarding
);

export default router;
