import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { Input } from '../components/ui/input'; // Using shadcn Input
import { Button } from '../components/ui/button'; // Using shadcn Button

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [token, setToken] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const location = useLocation();


    useEffect(() => {
        const tokenFromUrl = location.pathname.split('/register/')[1];
        console.log('token:', tokenFromUrl);
        if(tokenFromUrl) {
            setToken(tokenFromUrl);
        }
    }, [location]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:3001/auth/register', {
                token,
                username,
                password,
            });
            navigate('/login');
        } catch (err) {
            console.error('Registration error:', err);
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-6 rounded shadow-md w-full max-w-md"
            >
                <h2 className="text-xl font-bold mb-4 text-center">Register</h2>

                {/* Username Input */}
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2" htmlFor="username">
                        Username
                    </label>
                    <Input
                        type="text"
                        id="username"
                        placeholder="Enter your username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full"
                        required
                    />
                </div>

                {/* Password Input */}
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2" htmlFor="password">
                        Password
                    </label>
                    <Input
                        type="password"
                        id="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full"
                        required
                    />
                </div>

                {/* Token Input */}
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2" htmlFor="token">
                        Registration Token
                    </label>
                    <Input
                        type="text"
                        id="token"
                        placeholder="Enter your registration token"
                        value={token}
                        onChange={(e) => setToken(e.target.value)}
                        className="w-full"
                        required
                        readOnly
                    />
                </div>

                {/* Error Message */}
                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                {/* Submit Button */}
                <Button
                    type="submit"
                    variant="default"
                    className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
                >
                    Register
                </Button>
            </form>
        </div>
    );
};

export default Register;
