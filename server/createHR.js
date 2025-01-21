import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/userModel.js';
dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
};

const createHRUser = async () => {
    const username = "hr1";
    const email = "hr1@fake.com";
    const password = "123456"; 
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log('User with this email already exists!');
            process.exit(1);
        }

        const hrUser = await User.create({
            username,
            email,
            password, 
            role: "hr",
        });

        console.log('HR user created:', hrUser);
        process.exit(0); 
    } catch (error) {
        console.error('Error creating HR user:', error);
        process.exit(1);
    }
};

connectDB().then(() => createHRUser());
