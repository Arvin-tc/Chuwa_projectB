import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/login';
import Register from './pages/Register';
import Onboarding from './pages/Onboarding';
import PersonalInfo from './pages/PersonalInfo';
import ProtectedRoute from './components/ProtectedRoute';
import './index.css';
import VisaStatus from './pages/VisaStatus';
import HrManagement from './pages/HrManagement';
import ViewApplicationPage from './pages/HrApplicationDetails';
import HRVisaManagementPage from './pages/HrVisaStatus';

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
                <Route 
                    path="/hr-visa"
                    element={
                        <ProtectedRoute>
                            <HRVisaManagementPage/>
                        </ProtectedRoute>
                    }
                />
                <Route 
                    path="/hr-management"
                    element={
                        <ProtectedRoute>
                            <HrManagement />
                        </ProtectedRoute>
                    }
                />

                <Route path="/application/:applicationId" element={<ViewApplicationPage />} />
            </Routes>
        </Router>
    );
};

export default App;
