import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { Input } from '../components/ui/input'; // Using shadcn Input
import { Button } from '../components/ui/button'; // Using shadcn Button

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error } = useSelector((state) => state.auth);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(login({ username, password })).then((res) => {
            if (res.type === 'auth/login/fulfilled') {
                navigate('/dashboard');
            }
        });
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
    <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md border border-gray-300"
    >
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-700">Login</h2>
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600 mb-2" htmlFor="username">
                Username
            </label>
            <Input
                type="text"
                id="username"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border border-gray-300 rounded p-2"
            />
        </div>
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600 mb-2" htmlFor="password">
                Password
            </label>
            <Input
                type="password"
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded p-2"
            />
        </div>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <Button
            type="submit"
            variant="default"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
            disabled={loading}
        >
            {loading ? 'Logging in...' : 'Login'}
        </Button>
    </form>
</div>
    );
};

export default Login;
