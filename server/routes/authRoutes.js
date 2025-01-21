import express from 'express';
import { login, sendRegistrationEmail, register } from '../controllers/authController.js';

const router = express.Router();

router.post('/login', login);
router.post('/send-registration-email', sendRegistrationEmail);
router.post('/register', register);

export default router;