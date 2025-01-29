import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVisaApplications, updateDocumentStatus, sendReminder } from '../redux/slices/hrVisaSlice';
import Navbar from '../components/common/NavigationBar';
const PORT = 3001;

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

    const filteredApplicationsForAll = applications.filter((app) =>
        `${app.details.firstName} ${app.details.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const renderDocumentLinks = (uploadedFiles, currentStatus) => {
        const fileSequence = ['optReceipt', 'optEAD', 'i983', 'i20'];

        // Find the last file that is logically valid based on current status
        const lastValidIndex = fileSequence.findIndex((file) => !uploadedFiles[file]);
        const validFiles = fileSequence.slice(0, lastValidIndex + (currentStatus === 'Approved' ? 1 : 0));

        // Render links for valid files, excluding rejected ones
        return validFiles
            .filter((fileKey) => uploadedFiles[fileKey] && currentStatus !== 'Rejected')
            .map((fileKey) => (
                <div key={fileKey} className="mb-2">
                    <a
                        href={`http://localhost:3001/uploads/${uploadedFiles[fileKey]}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline mr-4"
                    >
                        Preview {fileKey.replace(/([A-Z])/g, ' $1')}
                    </a>
                    <button
                        onClick={() => {
                            const link = document.createElement('a');
                            link.href = `http://localhost:${PORT}/uploads/${uploadedFiles[fileKey]}`;
                            link.download = uploadedFiles[fileKey];
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                        }}
                        className="text-blue-600 underline"
                    >
                        Download
                    </button>
                </div>
            ));
    };

    console.log('fetched apps: ', applications);
    return (
        <div className="container mx-auto p-6">
            <Navbar />
            <p style={{ marginTop: '50px' }}></p>
            <h1 className="text-2xl font-bold mb-6">Visa Status Management</h1>

            {/* In-progress Employees Table */}
            <h2 className="text-lg font-bold mb-4">In-Progress Employees</h2>

            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p className="text-red-500">Error: {error}</p>
            ) : (
                <div>
                    {applications.length === 0 ? (
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
                                    <th className="border border-gray-300 px-4 py-2">Next Step</th>
                                    <th className="border border-gray-300 px-4 py-2">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {applications.map((app) => (
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
                                            {app.nextStep.includes('approval') && app.pendingDocuments ? (
                                                Object.entries(app.pendingDocuments)
                                                    .filter(([docType]) => app.nextStep.toLowerCase().includes(docType.toLowerCase()))
                                                    .map(([docType, docPath]) => (
                                                        <div key={docType} className="mb-4">
                                                            <a
                                                                href={`http://localhost:${PORT}/uploads/${docPath.split('/').pop()}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-blue-600 underline mr-4"
                                                            >
                                                                Preview {docType}
                                                            </a>
                                                            <button
                                                                onClick={() => handleApprove(app._id, docType)}
                                                                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 mr-2"
                                                            >
                                                                Approve
                                                            </button>
                                                            <button
                                                                onClick={() => handleReject(app._id, docType)}
                                                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                                                            >
                                                                Reject
                                                            </button>
                                                        </div>
                                                    ))
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

                    <p style={{ marginTop: '50px' }}></p>
                    {/* All Employees Table */}
                    <div className="mb-6">
                        <input
                            type="text"
                            placeholder="Search by name"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full p-2 border rounded-md"
                        />
                    </div>

                    <h2 className="text-lg font-bold mb-4">All Employees</h2>
                    {filteredApplicationsForAll.length === 0 ? (
                        <p>No employees found.</p>
                    ) : (
                        <table className="table-auto w-full border-collapse border border-gray-200">
                            <thead>
                                <tr>
                                    <th className="border border-gray-300 px-4 py-2">Name</th>
                                    <th className="border border-gray-300 px-4 py-2">Work Authorization</th>
                                    <th className="border border-gray-300 px-4 py-2">Start Date</th>
                                    <th className="border border-gray-300 px-4 py-2">End Date</th>
                                    <th className="border border-gray-300 px-4 py-2">Remaining Days</th>
                                    <th className="border border-gray-300 px-4 py-2">Uploaded Documents</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredApplicationsForAll.map((app) => (
                                    <tr key={app._id}>
                                        <td className="border border-gray-300 px-4 py-2">
                                            {`${app.details.firstName} ${app.details.lastName}`}
                                        </td>
                                        <td className="border border-gray-300 px-4 py-2">{app.details.citizenship}</td>
                                        <td className="border border-gray-300 px-4 py-2">
                                            {app.details.visaStartDate ? new Date(app.details.visaStartDate).toLocaleDateString() : 'N/A'}
                                        </td>
                                        <td className="border border-gray-300 px-4 py-2">
                                            {app.details.visaEndDate ? new Date(app.details.visaEndDate).toLocaleDateString() : 'N/A'}
                                        </td>
                                        <td className="border border-gray-300 px-4 py-2">
                                            {app.daysRemaining || 'N/A'}
                                        </td>
                                        <td className="border border-gray-300 px-4 py-2">
                                            {renderDocumentLinks(app.uploadedFiles, app.status)}
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
