// Required Libraries
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTokenHistory, generateToken, fetchApplications, updateApplicationStatus } from '../redux/slices/hrManagementSlice';
import Navbar from '../components/common/NavigationBar';

const HiringManagementPage = () => {
    const dispatch = useDispatch();

    // Fetching state from Redux store
    const { tokenHistory, applications, loading, error } = useSelector((state) => state.hr);

    const [email, setEmail] = useState('');
    const [name, setName] = useState('');

    // Fetch data on component mount
    useEffect(() => {
        dispatch(fetchTokenHistory());
        ['Pending', 'Rejected', 'Approved'].forEach((status) => {
            dispatch(fetchApplications(status));
        });
    }, [dispatch]);

    const handleGenerateToken = () => {
        if (email && name) {
            dispatch(generateToken({ email, name }));
            setEmail('');
            setName('');
        } else if (email){
            dispatch(generateToken({ email }));
            setEmail('');
        } else {
            alert('Please provide both name and email');
        }
    };

    const handleStatusUpdate = (applicationId, status, feedback = '') => {
        dispatch(updateApplicationStatus({ applicationId, status, feedback }));
    };

    return (
        <div className="container mx-auto p-6">
            <Navbar />
            <p style={{ marginTop: '50px' }}></p>
            <h1 className="text-2xl font-bold mb-6">Hiring Management</h1>

            {/* Generate Token Section */}
            <div className="bg-white p-6 rounded-md shadow-md mb-6">
                <h2 className="text-lg font-bold mb-4">Generate Registration Token</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                        type="text"
                        placeholder="Enter Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="p-2 border rounded-md"
                    />
                    <input
                        type="email"
                        placeholder="Enter Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="p-2 border rounded-md"
                    />
                </div>
                <button
                    onClick={handleGenerateToken}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                    Generate Token and Send Email
                </button>
            </div>

            {/* Token History Table */}
            <div className="bg-white p-6 rounded-md shadow-md mb-6">
                <h3 className="text-lg font-bold mb-4">Token History</h3>
                {loading ? (
                    <p>Loading...</p>
                ) : error ? (
                    <p className="text-red-500">Error: {error}</p>
                ) : (
                    <table className="table-auto w-full border-collapse border border-gray-200">
                        <thead>
                            <tr>
                                <th className="border border-gray-300 px-4 py-2">Email</th>
                                <th className="border border-gray-300 px-4 py-2">Name</th>
                                <th className="border border-gray-300 px-4 py-2">Status</th>
                                <th className="border border-gray-300 px-4 py-2">Expires At</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tokenHistory.map((token) => (
                                <tr key={token.token}>
                                    <td className="border border-gray-300 px-4 py-2">{token.email}</td>
                                    <td className="border border-gray-300 px-4 py-2">{token.name}</td>
                                    <td className="border border-gray-300 px-4 py-2">{token.status}</td>
                                    <td className="border border-gray-300 px-4 py-2">{new Date(token.expiresAt).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Onboarding Applications Section */}
            <div className="bg-white p-6 rounded-md shadow-md">
                <h2 className="text-lg font-bold mb-4">Onboarding Applications</h2>

                {['Pending', 'Rejected', 'Approved'].map((status) => (
                    <div key={status} className="mb-6">
                        <h3 className="text-md font-bold mb-2">{status} Applications</h3>
                        {loading ? (
                            <p>Loading...</p>
                        ) : error ? (
                            <p className="text-red-500">Error: {error}</p>
                        ) : (
                            <table className="table-auto w-full border-collapse border border-gray-200">
                                <thead>
                                    <tr>
                                        <th className="border border-gray-300 px-4 py-2">Full Name</th>
                                        <th className="border border-gray-300 px-4 py-2">Email</th>
                                        <th className="border border-gray-300 px-4 py-2">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {applications
                                        .filter((app) => app.status === status)
                                        .map((application) => (
                                            <tr key={application._id}>
                                                <td className="border border-gray-300 px-4 py-2">{`${application.details.firstName} ${application.details.lastName}`}</td>
                                                <td className="border border-gray-300 px-4 py-2">{application.userEmail}</td>
                                                <td className="border border-gray-300 px-4 py-2">
                                                    {status === 'Pending' ? (
                                                        <div className="flex space-x-2">
                                                            <button
                                                                onClick={() =>
                                                                    handleStatusUpdate(
                                                                        application._id,
                                                                        'Approved'
                                                                    )
                                                                }
                                                                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                                                            >
                                                                Approve
                                                            </button>
                                                            <button
                                                                onClick={() => {
                                                                    const feedback = prompt('Enter feedback:');
                                                                    handleStatusUpdate(
                                                                        application._id,
                                                                        'Rejected',
                                                                        feedback
                                                                    );
                                                                }}
                                                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                                                            >
                                                                Reject
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <button
                                                            onClick={() =>
                                                                window.open(
                                                                    `/application/${application._id}`,
                                                                    '_blank'
                                                                )
                                                            }
                                                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                                        >
                                                            View Application
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HiringManagementPage;
