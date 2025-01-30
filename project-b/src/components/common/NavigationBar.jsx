import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux'; // If using Redux for auth state

const Navbar = () => {
    const navigate = useNavigate();

    // If using Redux for authentication state
    const { user } = useSelector((state) => state.auth);
    const userRole = user?.role || localStorage.getItem('userRole'); // Get role from Redux or localStorage

    const handleLogout = () => {
        localStorage.removeItem('jwt');
        localStorage.removeItem('userRole');
        navigate('/login');
    };

    // console.log('navbar user role:', userRole);
    return (
        <nav className='bg-blue-700 text-white py-2'>
            <div className='container mx-auto flex justify-between items-center'>
                <div className='flex space-x-6'>
                    {userRole === 'hr' ? (
                        <>
                            <Link to='/hr-management' className='hover:text-blue-300 text-lg font-medium'>
                                Hiring Management
                            </Link>
                            <Link to='/hr-visa' className='hover:text-blue-300 text-lg font-medium'>
                                Visa Status Management
                            </Link>
                            <Link to='/hr-profiles' className='hover:text-blue-300 text-lg font-medium'>
                                Employee Profiles
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link to='/personal-info' className='hover:text-blue-300 text-lg font-medium'>
                                Personal Information
                            </Link>
                            <Link to='/visa-status' className='hover:text-blue-300 text-lg font-medium'>
                                Visa Status Management
                            </Link>
                        </>
                    )}
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
