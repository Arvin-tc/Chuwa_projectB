import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVisaApplications, updateDocumentStatus, sendReminder } from '../redux/slices/hrVisaSlice';

const HRVisaManagementPage = () => {
    const dispatch = useDispatch();
    const { applications, loading, error } = useSelector((state) => state.hrVisa);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        dispatch(fetchVisaApplications());
    }, [dispatch]);

    const handleApprove = (applicationId, documentType) => {
        dispatch(updateDocumentStatus({ applicationId, documentType, status: 'Approved' }));
    };

    const handleReject = (applicationId, documentType) => {
        const feedback = prompt('Enter feedback for rejection:');
        if (feedback) {
            dispatch(updateDocumentStatus({ applicationId, documentType, status: 'Rejected', feedback }));
        }
    };

    const handleSendReminder = (applicationId) => {
        dispatch(sendReminder(applicationId));
    };

    const filteredApplications = applications.filter((app) =>
        `${app.details.firstName} ${app.details.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Visa Status Management</h1>

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
                    {filteredApplications.length === 0 ? (
                        <p>No employee found.</p>
                    ) : (
                        <table className="table-auto w-full border-collapse border border-gray-200">
                            <thead>
                                <tr>
                                    <th className="border border-gray-300 px-4 py-2">Name</th>
                                    <th className="border border-gray-300 px-4 py-2">Work Authorization</th>
                                    <th className="border border-gray-300 px-4 py-2">Start Date</th>
                                    <th className="border border-gray-300 px-4 py-2">End Date</th>
                                    <th className="border border-gray-300 px-4 py-2">Remaining Days</th>
                                    <th className="border border-gray-300 px-4 py-2">Next Steps</th>
                                    <th className="border border-gray-300 px-4 py-2">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredApplications.map((app) => (
                                    <tr key={app._id}>
                                        <td className="border border-gray-300 px-4 py-2">
                                            {`${app.details.firstName} ${app.details.lastName}`}
                                        </td>
                                        <td className="border border-gray-300 px-4 py-2">{app.details.visaType}</td>
                                        <td className="border border-gray-300 px-4 py-2">
                                            {app.details.visaStartDate ? new Date(app.details.visaStartDate).toLocaleDateString() : 'N/A'}
                                        </td>
                                        <td className="border border-gray-300 px-4 py-2">
                                            {app.details.visaEndDate ? new Date(app.details.visaEndDate).toLocaleDateString() : 'N/A'}
                                        </td>
                                        <td className="border border-gray-300 px-4 py-2">
                                            {app.daysRemaining || 'N/A'}
                                        </td>
                                        <td className="border border-gray-300 px-4 py-2">{app.nextStep}</td>
                                        <td className="border border-gray-300 px-4 py-2">
                                            {app.nextStep.includes('approval') ? (
                                                <div>
                                                    {Object.entries(app.pendingDocuments || {}).map(
                                                        ([docType, docPath]) => (
                                                            <div key={docType} className="mb-4">
                                                                <a
                                                                    href={docPath}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="text-blue-600 underline mr-4"
                                                                >
                                                                    Preview
                                                                </a>
                                                                <button
                                                                    onClick={() =>
                                                                        handleApprove(app._id, docType)
                                                                    }
                                                                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 mr-2"
                                                                >
                                                                    Approve
                                                                </button>
                                                                <button
                                                                    onClick={() =>
                                                                        handleReject(app._id, docType)
                                                                    }
                                                                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                                                                >
                                                                    Reject
                                                                </button>
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => handleSendReminder(app._id)}
                                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                                >
                                                    Send Reminder
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}
        </div>
    );
};

export default HRVisaManagementPage;
