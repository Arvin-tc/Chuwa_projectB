import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await axios.get('/api/hrOperation/dashboard-summary');
        setSummary(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">HR Dashboard</h1>
      <div className="mb-4">
        <h2 className="font-bold">Summary</h2>
        <p>Total Employees: {summary.totalEmployees}</p>
        <p>Pending Applications: {summary.pendingApplications}</p>
        <p>Approved Applications: {summary.approvedApplications}</p>
        <p>Rejected Applications: {summary.rejectedApplications}</p>
      </div>
      <div>
        <h2 className="font-bold">Quick Links</h2>
        <ul>
          <li>
            <Link to="/hr/employee-profiles" className="text-blue-500 hover:underline">
              Employee Profiles
            </Link>
          </li>
          <li>
            <Link to="/hr/hiring-management" className="text-blue-500 hover:underline">
              Hiring Management
            </Link>
          </li>
          <li>
            <Link to="/hr/visa-status" className="text-blue-500 hover:underline">
              Visa Status Management
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Home;
