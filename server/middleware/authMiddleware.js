import jwt from 'jsonwebtoken';

export const authenticate = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization; // No need for optional chaining
        if (!authHeader) {
            return res.status(401).json({ message: 'Authorization header is missing.' });
        }

        if (!authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Invalid authorization header format.' });
        }

        const token = authHeader.split(' ')[1]; // Extract token from "Bearer <token>"
        if (!token) {
            return res.status(401).json({ message: 'Token is missing.' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach decoded user info to req
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token or authorization denied.' });
    }
};

export const authorizeRole = (role) => {
    return (req, res, next) => {
        if (req.user.role !== role) {
            return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
        }
        next();
    };
};
