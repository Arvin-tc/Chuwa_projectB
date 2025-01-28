import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchEmployeeById } from '../redux/slices/employeeSlice';

const EmployeeProfileView = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { profile: employee, loading, error } = useSelector((state) => state.employees);

  useEffect(() => {
    dispatch(fetchEmployeeById(id));
  }, [dispatch, id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  if (!employee) return <p>No employee data found.</p>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">
        {employee.details.firstName} {employee.details.lastName}'s Profile
      </h1>
      <div className="mb-4">
        <h2 className="font-bold">Personal Information</h2>
        <p>SSN: {employee.details.ssn}</p>
        <p>Date of Birth: {new Date(employee.details.dob).toLocaleDateString()}</p>
        <p>Gender: {employee.details.gender}</p>
        <p>Citizenship: {employee.details.citizenship}</p>
        {employee.details.visaType && <p>Visa Type: {employee.details.visaType}</p>}
      </div>
      <div className="mb-4">
        <h2 className="font-bold">Contact Information</h2>
        <p>
          Address: {employee.details.address.building},{' '}
          {employee.details.address.street}, {employee.details.address.city},{' '}
          {employee.details.address.state} {employee.details.address.zip}
        </p>
        <p>Cell Phone: {employee.details.cellPhone}</p>
      </div>
      <div className="mb-4">
        <h2 className="font-bold">Emergency Contacts</h2>
        {employee.details.emergencyContacts.map((contact, index) => (
          <div key={index}>
            <p>
              {contact.firstName} {contact.lastName} ({contact.relationship})
            </p>
            <p>Phone: {contact.phone}</p>
            <p>Email: {contact.email}</p>
          </div>
        ))}
      </div>
      <div className="mb-4">
        <h2 className="font-bold">Uploaded Documents</h2>
        <p>
          <a href={`/uploads/${employee.uploadedFiles.profilePicture}`} target="_blank" rel="noopener noreferrer">
            Profile Picture
          </a>
        </p>
        <p>
          <a href={`/uploads/${employee.uploadedFiles.driverLicense}`} target="_blank" rel="noopener noreferrer">
            Driver's License
          </a>
        </p>
        <p>
          <a href={`/uploads/${employee.uploadedFiles.workAuthorization}`} target="_blank" rel="noopener noreferrer">
            Work Authorization
          </a>
        </p>
      </div>
    </div>
  );
};

export default EmployeeProfileView;
