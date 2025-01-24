import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPersonalInfo, updatePersonalInfo } from '../redux/slices/personalInfoSlice';
import EditableField from '../components/common/EditableField';
const PORT = 3001;

const PersonalInfo = () => {
    const dispatch = useDispatch();
    const { details, uploadedFiles, loading, error } = useSelector((state) => state.personalInfo);

    useEffect(() => {
        dispatch(fetchPersonalInfo());
    }, [dispatch]);

    const handleUpdate = (field, value) => {
        dispatch(updatePersonalInfo({ ...details, [field]: value }));
    };

    const handleNestedUpdate = (parentField, key, value) => {
        handleUpdate(parentField, { ...details[parentField], [key]: value });
    };

    const handleArrayUpdate = (parentField, index, key, value) => {
        const updatedArray = [...details[parentField]];
        updatedArray[index] = { ...updatedArray[index], [key]: value };
        handleUpdate(parentField, updatedArray);
    };

    const handleDownload = (fileName) => {

        const url = `http://localhost:${PORT}/uploads/${fileName}`;
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handlePreview = (fileName) => {

        const url = `http://localhost:${PORT}/uploads/${fileName}`;
        window.open(url, '_blank');
    };

    const handleFileUpload = async (fileType, file) => {
        try {
            const formData = new FormData();
            formData.append('fileType', fileType);
            formData.append('file', file);

            const response = await fetch(`http://localhost:${PORT}/api/uploads`, {
                method: 'PATCH',
                headers: {

                    Authorization: `Bearer ${localStorage.getItem(('jwt'))}`,
                },
                body: formData,
            });

            if(response.ok) {
                const data = await response.json();
                console.log('File uploaded successfully:', data);
                dispatch(fetchPersonalInfo());
            } else {
                const error = await response.json();
                console.error('Error uploading file: ', error);
            }
        } catch (err) {
            console.error('Error handling file upload:', err);
        }
    }

    if (loading || !details || !uploadedFiles) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    console.log('Personal info:', details);
    console.log('UploadedFiles:', uploadedFiles);
    console.log('VisaType:', details.visaType);
    console.log('Is resident:', details.isPermanentResident);

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Personal Information</h1>
            <div className="bg-white p-6 rounded-md shadow-md space-y-6">
                {/* Name Section */}
                <div className="mb-6">
                    <h2 className="text-lg font-bold">Name</h2>
                <EditableField
                    label="First Name"
                    value={details.firstName}
                    onChange={(value) => handleUpdate('firstName', value)}
                    isEditable
                />
                <EditableField
                    label="Last Name"
                    value={details.lastName}
                    onChange={(value) => handleUpdate('lastName', value)}
                    isEditable
                />
                <EditableField
                    label="Cell Phone"
                    value={details.cellPhone}
                    onChange={(value) => handleUpdate('cellPhone', value)}
                    isEditable
                />
                <EditableField
                    label="Gender"
                    value={details.gender}
                    onChange={(value) => handleUpdate('gender', value)}
                    type="select"
                    options={['Male', 'Female', 'Prefer not to say']}
                    isEditable
                />
                <EditableField
                    label="Citizenship"
                    value={details.citizenship}
                    onChange={(value) => handleUpdate('citizenship', value)}
                    isEditable
                />
                <EditableField
                    label="SSN"
                    value={details.ssn}
                    onChange={(value) => handleUpdate('ssn', value)}
                    isEditable
                />
                <EditableField
                    label="Date of Birth"
                    value={details.dob ? details.dob.split('T')[0] : ''}
                    onChange={(value) => handleUpdate('dob', value)}
                    type="date"
                    isEditable
                />
            </div>

                {/* Citizenship Section */}

                <div className="mb-6">
                    <h2 className="text-lg font-bold">Employment</h2>
                {details.citizenship === 'Work Authorization' && (
                    <div className="mb-6">
                        <EditableField
                            label="Visa Type"
                            value={details.visaType || ''}
                            onChange={(value) => handleUpdate('visaType', value)}
                            type="select"
                            options={['H1-B', 'L2', 'F1(CPT/OPT)', 'H4', 'Other']}
                            isEditable
                        />
                        <EditableField
                            label="Start Date"
                            value={details.visaStartDate ? details.visaStartDate.split('T')[0] : ''}
                            onChange={(value) => handleUpdate('visaStartDate', value)}
                            type="date"
                            isEditable
                        />
                        <EditableField
                            label="End Date"
                            value={details.visaEndDate ? details.visaEndDate.split('T')[0] : ''}
                            onChange={(value) => handleUpdate('visaEndDate', value)}
                            type="date"
                            isEditable
                        />
                    </div>
                )}
        </div>

                {/* Address Section */}
                <div className="mb-6">
                    <h2 className="text-lg font-bold">Address</h2>
                    {Object.keys(details.address).map((field) => (
                        <EditableField
                            key={field}
                            label={field.charAt(0).toUpperCase() + field.slice(1)}
                            value={details.address[field]}
                            onChange={(value) => handleNestedUpdate('address', field, value)}
                            isEditable
                        />
                    ))}
                </div>

                {/* Contact Info Section */}
                <div className="mb-6">
                    <h2 className="text-lg font-bold">Contact Info</h2>

                <EditableField
                    label="Cell Phone"
                    value={details.cellPhone}
                    onChange={(value) => handleUpdate('cellPhone', value)}
                    isEditable
                />

                </div>



                {/* Reference Section */}
                <div className="mb-6">
                    <h2 className="text-lg font-bold">Reference</h2>
                    {Object.keys(details.reference).map((field) => (
                        <EditableField
                            key={field}
                            label={field.charAt(0).toUpperCase() + field.slice(1)}
                            value={details.reference[field]}
                            onChange={(value) => handleNestedUpdate('reference', field, value)}
                            isEditable
                        />
                    ))}
                </div>

                {/* Emergency Contacts Section */}
                <div className="mb-6">
                    <h2 className="text-lg font-bold">Emergency Contacts</h2>
                    {details.emergencyContacts.map((contact, index) => (
                        <div key={contact._id || index} className="mb-4 border p-4 rounded-md">
                            {Object.keys(contact).map((field) =>
                                field !== '_id' ? (
                                    <EditableField
                                        key={`${index}-${field}`}
                                        label={`${field.charAt(0).toUpperCase() + field.slice(1)}`}
                                        value={contact[field]}
                                        onChange={(value) =>
                                            handleArrayUpdate('emergencyContacts', index, field, value)
                                        }
                                        isEditable
                                    />
                                ) : null
                            )}
                        </div>
                    ))}
                </div>


<h2>Uploaded Documents</h2>
{uploadedFiles ? (
    <ul>
        {Object.entries(uploadedFiles).map(([key, filePath]) => {
            const fileName = filePath.split('/').pop();
            return (
                <li key={key} className="mb-2">
                    <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}: </span>
                    <button
                        className="text-blue-600 underline mr-4"
                        onClick={() => handleDownload(fileName)}
                    >
                        Download
                    </button>
                    <button
                        className="text-blue-600 underline mr-4"
                        onClick={() => handlePreview(fileName)}
                    >
                        Preview
                    </button>
                    <input
                        type="file"
                        accept="image/jpeg,image/png,application/pdf"
                        onChange={(e) => handleFileUpload(key, e.target.files[0])}
                        className="block mt-2"
                    />
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

export default PersonalInfo;
