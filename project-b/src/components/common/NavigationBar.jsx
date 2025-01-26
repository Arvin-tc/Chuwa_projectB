import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('jwt');
        navigate('/login');
    };

    return (
        <nav className='bg-blue-500 text-white py-2'>
            <div className='container mx-auto flex justify-between items-center'>
                <div className='flex space-x-4'>
                    <Link
                        to='/personal-info'
                        className='hover:text-blue-300 text-lg font-medium'
                    >
                        Personal Information
                    </Link>
                    <Link
                        to='/visa-status'
                        className='hover:text-blue-300 text-lg font-medium'
                    >
                        Visa Status Management
                    </Link>
                </div>
                <button
                    onClick={handleLogout}
                    className='bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md text-white font-medium'
                >
                    Logout
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
