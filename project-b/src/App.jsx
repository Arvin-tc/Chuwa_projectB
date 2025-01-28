import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/login';
import Register from './pages/Register';
import HrNav from './components/hrNav';
import EmployeeProfiles from './pages/employeeProfiles';
import HiringManagement from './pages/hiringManagement';
import EmployeeProfileView from './pages/employeeProfileView';


const App = () => {
    return (
        <Router>
            <Routes>

                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
            

        {/* HR Routes */}
        <Route
          path="/hr/*"
          element={
            <>
              <HrNav />
              <Routes>
                <Route path="/hr/employee-profiles" element={<EmployeeProfiles />} />
                <Route path="/hr/employee-profile/:id" element={<EmployeeProfileView />} />
                <Route path="/hr/hiring-management" element={<HiringManagement />} />
              </Routes>
            </>
          }
        />

            </Routes>   
        </Router>
    );
};

export default App;
