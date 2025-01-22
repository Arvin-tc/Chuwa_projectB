import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/login';
import Register from './pages/Register';
import Onboarding from './pages/Onboarding';
import ProtectedRoute from './components/ProtectedRoute';
import './index.css';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route 
                    path='/onboarding'
        element={
            <ProtectedRoute>
                <Onboarding />
            </ProtectedRoute>
        }
        />
            </Routes>
        </Router>
    );
};

export default App;
