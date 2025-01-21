import express from 'express';
import { login, sendRegistrationEmail, register } from '../controllers/authController.js';
import { authenticate, authorizeRole } from '../middleware/authMiddleware.js';

const router = express.Router();

console.log('Auth routes initialized at /api/auth');

router.post('/login', (req, res, next) => {
    console.log('Login route hit');
    next();
}, login);

router.post('/register', register);

router.post(
    '/send-registration-email',
    authenticate, // Middleware here
    authorizeRole('hr'), // Middleware for role check
    sendRegistrationEmail
);

export default router;