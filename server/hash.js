import bcrypt from 'bcryptjs';

const hashPassword = async () => {
    const password = '123456'; // Replace with your desired password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Hashed Password:', hashedPassword);
};

hashPassword();
