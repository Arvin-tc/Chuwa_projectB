import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchApplicationsByStatus, updateApplicationStatus } from '../redux/slices/applicationSlice';

const HiringManagement = () => {
  const dispatch = useDispatch();
  const { pending, rejected, approved, loading, error } = useSelector((state) => state.applications);

  useEffect(() => {
    dispatch(fetchApplicationsByStatus('Pending'));
    dispatch(fetchApplicationsByStatus('Rejected'));
    dispatch(fetchApplicationsByStatus('Approved'));
  }, [dispatch]);

  const handleStatusChange = (id, status, feedback = '') => {
    dispatch(updateApplicationStatus({ id, status, feedback }));
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Hiring Management</h1>

      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}

      <h2 className="font-bold mt-4">Pending Applications</h2>
      <ul>
        {pending.map((app) => (
          <li key={app._id}>
            {app.details.firstName} {app.details.lastName} - {app.userId.email}
            <button onClick={() => handleStatusChange(app._id, 'Approved')}>Approve</button>
            <button onClick={() => handleStatusChange(app._id, 'Rejected', 'Insufficient documents')}>Reject</button>
          </li>
        ))}
      </ul>

      <h2 className="font-bold mt-4">Rejected Applications</h2>
      <ul>
        {rejected.map((app) => (
          <li key={app._id}>
            {app.details.firstName} {app.details.lastName} - Feedback: {app.feedback}
          </li>
        ))}
      </ul>

      <h2 className="font-bold mt-4">Approved Applications</h2>
      <ul>
        {approved.map((app) => (
          <li key={app._id}>
            {app.details.firstName} {app.details.lastName}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HiringManagement;
