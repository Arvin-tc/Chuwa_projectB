import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchEmployeeProfiles } from '../redux/slices/hrEmployeeSlice';

const HrEmployeeProfiles = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();  
    const { employees, loading, error } = useSelector((state) => state.hrEmployee);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        dispatch(fetchEmployeeProfiles());
    }, [dispatch]);

    const filteredEmployees = employees.filter((employee) =>
        `${employee.details.firstName} ${employee.details.lastName}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
    );

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Employee Profiles</h1>

            {/* Search Bar */}
            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Search by name"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full p-2 border rounded-md"
                />
            </div>

            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p className="text-red-500">Error: {error}</p>
            ) : (
                <div>
                    <h2 className="text-lg font-bold mb-4">Total Employees: {employees.length}</h2>
                    <table className="table-auto w-full border-collapse border border-gray-200">
                        <thead>
                            <tr>
                                <th className="border border-gray-300 px-4 py-2">Name</th>
                                <th className="border border-gray-300 px-4 py-2">SSN</th>
                                <th className="border border-gray-300 px-4 py-2">Work Authorization</th>
                                <th className="border border-gray-300 px-4 py-2">Phone Number</th>
                                <th className="border border-gray-300 px-4 py-2">Email</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredEmployees.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="border border-gray-300 px-4 py-2 text-center">
                                        No employees found.
                                    </td>
                                </tr>
                            ) : (
                                filteredEmployees.map((employee) => (
                                    <tr key={employee._id}>
                                        <td
                                            className="border border-gray-300 px-4 py-2 text-blue-600 underline cursor-pointer"
                                            onClick={() =>
                                                navigate(`/hr-profiles/employee/${employee._id}`, {
                                                    state: { details: employee.details, uploadedFiles: employee.uploadedFiles }
                                                })
                                            }
                                        >
                                            {`${employee.details.firstName} ${employee.details.lastName}`}
                                        </td>
                                        <td className="border border-gray-300 px-4 py-2">{employee.details.ssn || 'N/A'}</td>
                                        <td className="border border-gray-300 px-4 py-2">{employee.details.visaType}</td>
                                        <td className="border border-gray-300 px-4 py-2">{employee.details.cellPhone || 'N/A'}</td>
                                        <td className="border border-gray-300 px-4 py-2">{employee.userEmail}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default HrEmployeeProfiles;
