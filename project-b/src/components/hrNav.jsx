import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux'; // Corrected import
import { logout } from '../redux/slices/authSlice'; // Ensure the correct path for logout

const HrNav = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    // Clear user session by dispatching logout action
    dispatch(logout());
    // Redirect to the login page
    navigate('/login');
  };

  return (
    <nav className="bg-gray-800 text-white p-4">
      <ul className="flex space-x-4">
        <li>
          <Link to="/hr/home" className="hover:underline">
            Home
          </Link>
        </li>
        <li>
          <Link to="/hr/employee-profiles" className="hover:underline">
            Employee Profiles
          </Link>
        </li>
        <li>
          <Link to="/hr/visa-status" className="hover:underline">
            Visa Status Management
          </Link>
        </li>
        <li>
          <Link to="/hr/hiring-management" className="hover:underline">
            Hiring Management
          </Link>
        </li>
        <li>
          <button className="hover:underline" onClick={handleLogout}>
            Logout
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default HrNav;
