import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchApplicationById, updateApplicationStatus } from '../redux/slices/hrManagementSlice';
const PORT = 3001;

const ViewApplicationPage = () => {
    const { applicationId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { application, loading, error } = useSelector((state) => state.hr);
    const [feedback, setFeedback] = useState('');

    useEffect(() => {
        if (applicationId) {
            dispatch(fetchApplicationById(applicationId));
        }
    }, [applicationId, dispatch]);

    const handleStatusUpdate = (status) => {
        if (status === 'Rejected' && !feedback.trim()) {
            alert('Please provide feedback for rejection.');
            return;
        }

        dispatch(updateApplicationStatus({ applicationId, status, feedback }));
        navigate('/applications'); // Redirect to applications list
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p className="text-red-500">Error: {error}</p>;


    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">View Application</h1>

            {application ? (
                <div className="bg-white p-6 rounded-md shadow-md space-y-6">
                    <h2 className="text-lg font-bold">Personal Information</h2>
                    <p><strong>Name:</strong> {`${application.details.firstName} ${application.details.lastName}`}</p>
                    <p><strong>Email:</strong> {application.userId.email}</p>
                    <p><strong>Phone:</strong> {application.details.cellPhone}</p>
                    <p><strong>Gender:</strong> {application.details.gender}</p>
                    <p><strong>Date of Birth:</strong> {new Date(application.details.dob).toLocaleDateString()}</p>

                    <h2 className="text-lg font-bold">Address</h2>
                    <p>{`${application.details.address.apt}, ${application.details.address.street}, ${application.details.address.city}, ${application.details.address.state} - ${application.details.address.zip}`}</p>

                    <h2 className="text-lg font-bold">Citizenship</h2>
                    <p><strong>Status:</strong> {application.details.citizenship}</p>
                    {application.details.citizenship === 'Work Authorization' && (
                        <div>
                            <p><strong>Visa Type:</strong> {application.details.visaType}</p>
                            <p><strong>Start Date:</strong> {new Date(application.details.visaStartDate).toLocaleDateString()}</p>
                            <p><strong>End Date:</strong> {new Date(application.details.visaEndDate).toLocaleDateString()}</p>
                        </div>
                    )}

                    <h2 className="text-lg font-bold">Uploaded Documents</h2>
                    <ul>
                        {Object.entries(application.uploadedFiles).map(([key, filePath]) => (
                            <li key={key} className="mb-2">
                                <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}: </span>
                                <a
                                    href={`http://localhost:${PORT}/uploads/${filePath.split('/').pop()}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 underline"
                                >
                                    View
                                </a>
                            </li>
                        ))}
                    </ul>

                    <h2 className="text-lg font-bold">Actions</h2>
                    <textarea
                        placeholder="Provide feedback for rejection (if applicable)"
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        className="w-full p-2 border rounded-md mb-4"
                    />
                    <div className="flex space-x-4">
                        <button
                            onClick={() => handleStatusUpdate('Approved')}
                            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                        >
                            Approve
                        </button>
                        <button
                            onClick={() => handleStatusUpdate('Rejected')}
                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                        >
                            Reject
                        </button>
                    </div>
                </div>
            ) : (
                <p>No application data found.</p>
            )}
        </div>
    );
};

export default ViewApplicationPage;
