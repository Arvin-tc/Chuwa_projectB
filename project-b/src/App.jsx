import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/login';
import Register from './pages/Register';
import Onboarding from './pages/Onboarding';
import PersonalInfo from './pages/PersonalInfo';
import ProtectedRoute from './components/ProtectedRoute';
import AuthProtect from './components/AuthProtect';
import './index.css';
import VisaStatus from './pages/VisaStatus';
import HrManagement from './pages/HrManagement';
import ViewApplicationPage from './pages/HrApplicationDetails';
import HRVisaManagementPage from './pages/HrVisaStatus';
import HrEmployeeProfiles from './pages/HrEmployeeProfiles';
import EmployeeProfileDetails from './pages/HrEmployeeDetailsInfo';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register/:token" element={<Register />} />
                <Route 
                    path="/onboarding"
                    element={
                        <ProtectedRoute>
                            <AuthProtect role = 'employee'>
                            <Onboarding />
                            </AuthProtect>
                        </ProtectedRoute>
                    }
                />
                <Route 
                    path="/personal-info"
                    element={
                        <ProtectedRoute>
                            <AuthProtect role = 'employee'>
                            <PersonalInfo />
                            </AuthProtect>
                        </ProtectedRoute>
                    }
                />
                <Route 
                    path="/visa-status"
                    element={
                        <ProtectedRoute>
                            <AuthProtect role = 'employee'>
                            <VisaStatus />
                            </AuthProtect>
                        </ProtectedRoute>
                    }
                />
                <Route 
                    path="/hr-visa"
                    element={
                        <ProtectedRoute>
                            <AuthProtect role = 'hr'>
                                <HRVisaManagementPage/>
                            </AuthProtect>
                        </ProtectedRoute>
                    }
                />
                <Route 
                    path="/hr-profiles"
                    element={
                        <ProtectedRoute>
                            <AuthProtect role = 'hr'>
                                <HrEmployeeProfiles/>
                            </AuthProtect>
                        </ProtectedRoute>
                    }
                />
                <Route 
                    path="/hr-profiles/employee/:id"
                    element={
                        <ProtectedRoute>
                            <AuthProtect role = 'hr'>
                                <EmployeeProfileDetails />
                            </AuthProtect>
                        </ProtectedRoute>
                    }
                />
                <Route 
                    path="/hr-management"
                    element={
                        <ProtectedRoute>
                            <AuthProtect role = 'hr'>
                                <HrManagement />
                            </AuthProtect>
                        </ProtectedRoute>
                    }
                />
                <Route path="/application/:applicationId" element={<ViewApplicationPage />} />
            </Routes>
        </Router>
    );
};

export default App;
