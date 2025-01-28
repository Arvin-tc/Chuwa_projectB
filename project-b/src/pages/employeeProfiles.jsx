import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchEmployees } from '../redux/slices/employeeSlice';

const EmployeeProfiles = () => {
  const dispatch = useDispatch();
  const { data: employees, loading, error } = useSelector((state) => state.employees);

  useEffect(() => {
    dispatch(fetchEmployees());
  }, [dispatch]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Employee Profiles</h1>
      <table className="table-auto w-full border-collapse border border-gray-200">
        <thead>
          <tr>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">SSN</th>
            <th className="border px-4 py-2">Work Authorization</th>
            <th className="border px-4 py-2">Phone</th>
            <th className="border px-4 py-2">Email</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee._id}>
              <td className="border px-4 py-2">
                <a href={`/employee/${employee._id}`} target="_blank" rel="noopener noreferrer">
                  {employee.details.firstName} {employee.details.lastName}
                </a>
              </td>
              <td className="border px-4 py-2">{employee.details.ssn}</td>
              <td className="border px-4 py-2">{employee.details.citizenship}</td>
              <td className="border px-4 py-2">{employee.details.cellPhone}</td>
              <td className="border px-4 py-2">{employee.details.address.city}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeProfiles;
