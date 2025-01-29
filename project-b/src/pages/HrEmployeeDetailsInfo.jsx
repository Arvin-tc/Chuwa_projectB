import React from 'react';
import { useLocation } from 'react-router-dom';
const PORT = 3001;

const EmployeeProfileDetails = () => {
    const location = useLocation();
    const { details, uploadedFiles } = location.state || {};

    console.log('details:', details);
    console.log('uploadedFiles:', uploadedFiles);
    if (!details || !uploadedFiles) return <p>Loading...</p>;

    return (
        <div className="container mx-auto p-6">
            <p style={{ marginTop: '50px' }}/>
            <h1 className="text-2xl font-bold mb-6">Employee Profile</h1>
            <div className="bg-white p-6 rounded-md shadow-md space-y-6">
                {/* Name Section */}
                <div className="mb-6">
                    <h2 className="text-lg font-bold">Name</h2>
                    <p>{details.firstName} {details.lastName}</p>
                    <p><strong>Cell Phone:</strong> {details.cellPhone}</p>
                    <p><strong>Gender:</strong> {details.gender}</p>
                    <p><strong>Citizenship:</strong> {details.citizenship}</p>
                    <p><strong>SSN:</strong> {details.ssn}</p>
                    <p><strong>Date of Birth:</strong> {details.dob ? details.dob.split('T')[0] : 'N/A'}</p>
                </div>

                {/* Employment Section */}
                <div className="mb-6">
                    <h2 className="text-lg font-bold">Employment</h2>
                    {details.citizenship === 'Work Authorization' && (
                        <div>
                            <p><strong>Visa Type:</strong> {details.visaType || 'N/A'}</p>
                            <p><strong>Start Date:</strong> {details.visaStartDate ? details.visaStartDate.split('T')[0] : 'N/A'}</p>
                            <p><strong>End Date:</strong> {details.visaEndDate ? details.visaEndDate.split('T')[0] : 'N/A'}</p>
                        </div>
                    )}
                </div>

                {/* Address Section */}
                <div className="mb-6">
                    <h2 className="text-lg font-bold">Address</h2>
                    {Object.keys(details.address).map((field) => (
                        <p key={field}><strong>{field.charAt(0).toUpperCase() + field.slice(1)}:</strong> {details.address[field]}</p>
                    ))}
                </div>

                {/* Contact Info Section */}
                <div className="mb-6">
                    <h2 className="text-lg font-bold">Contact Info</h2>
                    <p><strong>Cell Phone:</strong> {details.cellPhone}</p>
                </div>

                {/* Reference Section */}
                <div className="mb-6">
                    <h2 className="text-lg font-bold">Reference</h2>
                    {details.reference ? (Object.keys(details.reference).map((field) => (
                        <p key={field}><strong>{field.charAt(0).toUpperCase() + field.slice(1)}:</strong> {details.reference[field]}</p>
                    ))
                    ) : (
                        <p>No reference provided</p>
                    )
                    }
                </div>

                {/* Emergency Contacts Section */}
                <div className="mb-6">
                    <h2 className="text-lg font-bold">Emergency Contacts</h2>
                    {details.emergencyContacts.lenth === 0 ? (details.emergencyContacts.map((contact, index) => (
                        <div key={contact._id || index} className="mb-4 border p-4 rounded-md">
                            {Object.keys(contact).map((field) =>
                                field !== '_id' ? (
                                    <p key={`${index}-${field}`}><strong>{field.charAt(0).toUpperCase() + field.slice(1)}:</strong> {contact[field]}</p>
                                ) : null
                            )}
                        </div>
                    ))
                    ) : (
                        <p>No emergency contact provided</p>
                    )
                    }
                </div>

                {/* Uploaded Documents */}
                <h2 className="text-lg font-bold">Uploaded Documents</h2>
                {uploadedFiles ? (
                    <ul>
                        {Object.entries(uploadedFiles).map(([key, filePath]) => {
                            const fileName = filePath.split('/').pop();
                            return (
                                <li key={key} className="mb-2">
                                    <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}: </span>
                                    <button
                                        className="text-blue-600 underline mr-4"
                                        onClick={() => {
                                            const url = `http://localhost:${PORT}/uploads/${fileName}`;
                                            const link = document.createElement('a');
                                            link.href = url;
                                            link.download = fileName;
                                            document.body.appendChild(link);
                                            link.click();
                                            document.body.removeChild(link);
                                        }}
                                    >
                                        Download
                                    </button>
                                    <button
                                        className="text-blue-600 underline mr-4"
                                        onClick={() => {
                                            const url = `http://localhost:${PORT}/uploads/${fileName}`;
                                            window.open(url, '_blank');
                                        }}
                                    >
                                        Preview
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                ) : (
                    <p>No documents uploaded.</p>
                )}
            </div>
        </div>
    );
};

export default EmployeeProfileDetails;
