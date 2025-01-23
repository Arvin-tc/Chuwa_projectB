import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';

const NavigationBar = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    return (
        <nav className="bg-gray-800 text-white p-4">
            <div className="container mx-auto flex justify-between items-center">
                <div className="flex space-x-4">
                    <Link to="/personal-information" className="hover:underline">
                        Personal Information
                    </Link>
                    <Link to="/visa-status-management" className="hover:underline">
                        Visa Status Management
                    </Link>
                </div>
                <button
                    onClick={handleLogout}
                    className="bg-red-500 px-4 py-2 rounded-md hover:bg-red-600"
                >
                    Logout
                </button>
            </div>
        </nav>
    );
};

export default NavigationBar;
