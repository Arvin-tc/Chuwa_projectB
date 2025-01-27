import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/login';
import Register from './pages/Register';
import Onboarding from './pages/Onboarding';
import PersonalInfo from './pages/PersonalInfo';
import ProtectedRoute from './components/ProtectedRoute';
import './index.css';
import VisaStatus from './pages/VisaStatus';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register/:token" element={<Register />} />
                <Route 
                    path="/onboarding"
                    element={
                        <ProtectedRoute>
                            <Onboarding />
                        </ProtectedRoute>
                    }
                />
                <Route 
                    path="/personal-info"
                    element={
                        <ProtectedRoute>
                            <PersonalInfo />
                        </ProtectedRoute>
                    }
                />
                <Route 
                    path="/visa-status"
                    element={
                        <ProtectedRoute>
                            <VisaStatus />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </Router>
    );
};

export default App;
