import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPersonalInfo, updatePersonalInfo } from '../redux/slices/personalInfoSlice';
import EditableField from '../components/common/EditableField';

const PersonalInfo = () => {
    const dispatch = useDispatch();
    const { details, loading, error } = useSelector((state) => state.personalInfo);

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

    if (loading || !details) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    console.log('Personal info:', details);

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Personal Information</h1>
            <div className="bg-white p-6 rounded-md shadow-md space-y-6">
                {/* General Fields */}
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
            </div>
        </div>
    );
};

export default PersonalInfo;
