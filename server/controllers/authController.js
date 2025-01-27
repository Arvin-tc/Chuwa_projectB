import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import Token from '../models/token.js';

const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

export const login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

        const token = generateToken(user._id, user.role);
        res.json({ token, role: user.role });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const sendRegistrationEmail = async (req, res) => {
    const { email, name } = req.body;

    try {
        const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '3h' });
        const expiresAt = new Date(Date.now() + 3 * 60 * 60 * 1000); // 3 hours

        await Token.create({ token, email, name, expiresAt });

        const transporter = nodemailer.createTransport({
            host: 'smtp.mailtrap.io',
            port: 2525,
            auth: {
                user: process.env.MAILTRAP_USER,
                pass: process.env.MAILTRAP_PASS,
            },
        });

        const mailOptions = {
            from: '"HR Portal" <no-reply@hrportal.com>',
            to: email,
            subject: 'Employee Registration Link',
            text: `Hello ${name || ''}, Click the link below to register:\n\nhttp://localhost:5173/register/${token}`,
        };

        await transporter.sendMail(mailOptions);
        res.json({ message: 'Registration email sent' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const register = async (req, res) => {
    const { token, username, password } = req.body;

    try {
        // Check if token exists and is valid
        const tokenEntry = await Token.findOne({ token });
        if (!tokenEntry || tokenEntry.status !== 'valid' || new Date() > tokenEntry.expiresAt) {
            return res.status(401).json({ message: 'Invalid or expired token' });
        }

        // Decode the token to get the email
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const email = decoded.email;

        // Check if the user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create the new user
        const newUser = await User.create({
            username,
            email,
            password,
            role: 'employee',
        });

        // Mark the token as used
        tokenEntry.status = 'used';
        await tokenEntry.save();

        res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ message: 'Server error' });
    }
};



