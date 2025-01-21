import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';

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
    const { email } = req.body;
    try {
        const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '3h' });

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
            text: `Click the link below to register:\n\nhttp://localhost:3000/register/${token}`,
        };

        await transporter.sendMail(mailOptions);
        res.json({ message: 'Registration email sent' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const register = async (req, res) => {
    const { token, username, password, role } = req.body;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const email = decoded.email;

        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        const newUser = await User.create({ username, email, password, role });
        res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
        res.status(500).json({ message: 'Invalid or expired token' });
    }
};
