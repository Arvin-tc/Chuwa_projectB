import React, {useState, useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOnboardingData, submitOnboarding } from '../redux/slices/onboardingSlice';
// TODO import Loading & Error page
import LoadingPage from '../components/LoadingPage';
import ErrorPage from '../components/ErrorPage';
import Navbar from '../components/common/NavigationBar';

const Onboarding = () => {
    const dispatch = useDispatch();
    const { status, application, feedback, loading, error, email } = useSelector((state) => state.onboarding);
    console.log('email: ', email);

    const [formData, setFormData] = useState({});
    const [files, setFiles] = useState({});



useEffect(() => {
    dispatch(fetchOnboardingData());
}, [dispatch]);

    useEffect(() => {
        if(email) {
            setFormData((prev) => ({...prev, userEmail: email}));
        }
    }, [email]);



const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(`name: ${name}, value: ${value}`);

    setFormData((prev) => {
        let updatedFormData = { ...prev, [name]: value };


        // Validation rules
        const stringFields = ["firstName", "lastName", "city", "state"];
        const specialCharPattern = /[^a-zA-Z\s]/; // Only allows letters and spaces
        const numberFields = ["zip", "cellPhone", "ssn"];

        // Validate text fields (only letters and spaces allowed)
        if (stringFields.includes(name) && specialCharPattern.test(value)) {
            alert(`${name} should only contain letters and spaces.`);
            return prev;
        }

        // Validate street (allows letters, numbers, and spaces but no special characters)
        if (name === "street" && /[^a-zA-Z0-9\s]/.test(value)) {
            alert("Street should not contain special characters.");
            return prev;
        }

        // Validate number fields (only allow numeric input while typing)
        if (numberFields.includes(name) && !/^\d*$/.test(value)) {
            alert(`${name} should only contain numbers.`);
            return prev;
        }
        if (name === "isPermanentResident") {
            updatedFormData = {
                ...updatedFormData,
                citizenship: value === "No" ? "Work Authorization" : "", 
                workAuthorization: value === "Yes" ? "" : prev.workAuthorization, 
                visaType: value === "No" ? prev.workAuthorization || "Work Authorization" : prev.citizenship || "",
            };
        }

        if (name === "citizenship" && prev.isPermanentResident === "Yes") {
            updatedFormData = {
                ...updatedFormData,
                visaType: value, 
            };
        }

        if (name === "workAuthorization" && prev.isPermanentResident === "No") {
            updatedFormData = {
                ...updatedFormData,
                visaType: value, 
            };
        }

        if (name === "visaTitle" && prev.workAuthorization === "Other") {
            updatedFormData = {
                ...updatedFormData,
                visaType: value, 
            };
        }

        return updatedFormData;
    });
};


    const handleFileChange = (e) => {
        const { name } = e.target;
        const file = e.target.files[0];  // input can allow multiple files
        setFiles((prev) => ({...prev, [name]: file}));
    };



const handleSubmit = (e) => {
    e.preventDefault();

    const form = new FormData();
    Object.keys(formData).forEach((key) => {
        if (typeof formData[key] === 'object' && !Array.isArray(formData[key])) {
            Object.keys(formData[key]).forEach((subKey) => {
                form.append(`${key}.${subKey}`, formData[key][subKey]);
            });
        } else if (Array.isArray(formData[key])) {
            formData[key].forEach((item, index) => {
                Object.keys(item).forEach((subKey) => {
                    form.append(`${key}[${index}].${subKey}`, item[subKey]);
                });
            });
        } else {
            form.append(key, formData[key]);
        }
    });

    Object.keys(files).forEach((key) => form.append(key, files[key]));

    // Debug log
    for (let pair of form.entries()) {
        console.log(`${pair[0]}: ${pair[1]}`);
    }

    dispatch(submitOnboarding(form));
};



const handleReferenceChange = (field, value) => {
    setFormData((prev) => ({
        ...prev,
        reference: {
            ...prev.reference,
            [field]: value,
        },
    }));
};
    const addEmergencyContact = () => {
        setFormData((prev) => ({
            ...prev,
            emergencyContacts: [...(prev.emergencyContacts || []), { firstName: '', lastName: '', relationship: '', phone: '', email: '' }],
        }));
    };

    const removeEmergencyContact = (index) => {
        setFormData((prev) => ({
            ...prev,
            emergencyContacts: prev.emergencyContacts.filter((_, i) => i !== index),
        }));
    };

    const handleEmergencyContactChange = (index, field, value) => {
        setFormData((prev) => ({
            ...prev,
            emergencyContacts: prev.emergencyContacts.map((contact, i) =>
                i === index ? { ...contact, [field]: value } : contact
            ),
        }));
    };

    if(loading) return <LoadingPage message="Loading data, please wait..." />;
    if (error) return <ErrorPage message={`Failed to fetch data: ${error?.message || error}`} />;
    console.log('Status:', status);
    console.log('Form data:', formData);

    
return (
    <div className="container mx-auto p-6">
        <Navbar />
        <p style={{ marginTop: '50px' }}></p>
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Onboarding Application</h1>
        
        {/* Status: Approved */}
        {status === 'Approved' && (
            <div className="bg-yellow-100 text-yellow-800 p-4 rounded-md mb-6">
                <p className="text-lg">Your application is approved! </p>
            </div>
        )}

        {/* Status: Pending */}
        {status === 'Pending' && (
            <div className="bg-yellow-100 text-yellow-800 p-4 rounded-md mb-6">
                <p className="text-lg">Your application is under review. </p>
            </div>
        )}
        
        {/* Status: Rejected */}
        {status === 'Rejected' && (
            <div className="bg-red-100 text-red-800 p-4 rounded-md mb-6">
                <h2 className="text-xl font-semibold">Application Rejected</h2>
                <p className="mt-2">Feedback from HR:</p>
                <p className="mt-2 bg-red-50 p-3 rounded">{feedback}</p>
            </div>
        )}

        {/* Form: New or Rejected */}
        {(!status || status === 'Rejected') && (
            
<form onSubmit={handleSubmit} className="bg-white p-6 rounded-md shadow-lg">
    <h2 className="text-2xl font-semibold text-gray-700 mb-4">Fill Your Details</h2>

    {/* First Name and Last Name */}
    <div className="mb-4">
        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name *</label>
        <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName || ''}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
    </div>
    <div className="mb-4">
        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name *</label>
        <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName || ''}
            onChange={handleInputChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
    </div>


    {/* Address */}
    <div className="mb-4">
        <label htmlFor="apt" className="block text-sm font-medium text-gray-700">Apt*</label>
        <input
            type="text"
            id="apt"
            name="apt"
            value={formData.apt|| ''}
            onChange={handleInputChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
    </div>
    <div className="mb-4">
        <label htmlFor="street" className="block text-sm font-medium text-gray-700">Street *</label>
        <input
            type="text"
            id="street"
            name="street"
            value={formData.street || ''}
            onChange={handleInputChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
    </div>
    <div className="mb-4">
        <label htmlFor="city" className="block text-sm font-medium text-gray-700">City *</label>
        <input
            type="text"
            id="city"
            name="city"
            value={formData.city || ''}
            onChange={handleInputChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
    </div>
    <div className="mb-4">
        <label htmlFor="state" className="block text-sm font-medium text-gray-700">State *</label>
        <input
            type="text"
            id="state"
            name="state"
            value={formData.state || ''}
            onChange={handleInputChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
    </div>
    <div className="mb-4">
        <label htmlFor="zip" className="block text-sm font-medium text-gray-700">ZIP Code *</label>
        <input
            type="text"
            id="zip"
            name="zip"
            value={formData.zip || ''}
            onChange={handleInputChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
    </div>

    {/* Contact Information */}
    <div className="mb-4">
        <label htmlFor="cellPhone" className="block text-sm font-medium text-gray-700">Cell Phone *</label>
        <input
            type="text"
            id="cellPhone"
            name="cellPhone"
            value={formData.cellPhone || ''}
            onChange={handleInputChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
    </div>

{/* Email Field */}
<div className="mb-4">
    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email *</label>
    <input
        type="email"
        id="email"
        name="email"
        value={email || ''}
        readOnly
        className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-gray-100 text-gray-700 focus:ring-blue-500 focus:border-blue-500 cursor-not-allowed"
    />
</div>

    {/* SSN */}
    <div className="mb-4">
        <label htmlFor="ssn" className="block text-sm font-medium text-gray-700">SSN *</label>
        <input
            type="text"
            id="ssn"
            name="ssn"
            value={formData.ssn || ''}
            onChange={handleInputChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
    </div>

    {/* Date of Birth */}
    <div className="mb-4">
        <label htmlFor="dob" className="block text-sm font-medium text-gray-700">Date of Birth *</label>
        <input
            type="date"
            id="dob"
            name="dob"
            value={formData.dob || ''}
            onChange={handleInputChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
    </div>

    {/* Gender */}
    <div className="mb-4">
        <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Gender *</label>
        <select
            id="gender"
            name="gender"
            value={formData.gender || ''}
            onChange={handleInputChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        >
            <option value="" disabled>Select your gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Prefer not to say">Prefer not to say</option>
        </select>
    </div>


{/* Citizenship Section */}
<div className="mb-4">
    <label htmlFor="isPermanentResident" className="block text-sm font-medium text-gray-700">
        Are you a permanent resident or citizen of the U.S.? *
    </label>
    <select
        id="isPermanentResident"
        name="isPermanentResident"
        value={formData.isPermanentResident || ''}
        onChange={(e) => handleInputChange(e)}
        className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
    >
        <option value="" disabled>Select an option</option>
        <option value="Yes">Yes</option>
        <option value="No">No</option>
    </select>
</div>

{/* If Yes: Show Green Card or Citizen */}
{formData.isPermanentResident === 'Yes' && (
    <div className="mb-4">
        <label htmlFor="citizenship" className="block text-sm font-medium text-gray-700">
            Please select your status *
        </label>
        <select
            id="citizenship"
            name="citizenship"
            value={formData.citizenship || ''}
            onChange={(e) => handleInputChange(e)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        >
            <option value="" disabled>Select your status</option>
            <option value="Citizen">Citizen</option>
            <option value="Green Card">Green Card</option>
        </select>
    </div>
)}

{/* If No: Work Authorization Section */}
{formData.isPermanentResident === 'No' && (
    <>
        <div className="mb-4">
            <label htmlFor="workAuthorization" className="block text-sm font-medium text-gray-700">
                What is your work authorization? *
            </label>
            <select
                id="workAuthorization"
                name="workAuthorization"
                value={formData.workAuthorization || ''}
                onChange={(e) => handleInputChange(e)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
                <option value="" disabled>Select an option</option>
                <option value="H1-B">H1-B</option>
                <option value="L2">L2</option>
                <option value="F1(CPT/OPT)">F1(CPT/OPT)</option>
                <option value="H4">H4</option>
                <option value="Other">Other</option>
            </select>
        </div>

        {/* If F1(CPT/OPT): Show OPT Receipt Upload */}
        {formData.workAuthorization === 'F1(CPT/OPT)' && (
            <div className="mb-4">
                <label htmlFor="optReceipt" className="block text-sm font-medium text-gray-700">
                    Upload your OPT Receipt *
                </label>
                <input
                    type="file"
                    id="optReceipt"
                    name="optReceipt"
                    onChange={handleFileChange}
                    className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
                />
            </div>
        )}

        {/* If Other: Show Visa Title Input */}
        {formData.workAuthorization === 'Other' && (
            <div className="mb-4">
                <label htmlFor="visaTitle" className="block text-sm font-medium text-gray-700">
                    Specify your visa title *
                </label>
                <input
                    type="text"
                    id="visaTitle"
                    name="visaTitle"
                    value={formData.visaTitle || ''}
                    onChange={handleInputChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
            </div>
        )}

        {/* Start and End Dates */}
        <div className="mb-4">
            <label htmlFor="visaStartDate" className="block text-sm font-medium text-gray-700">
                Start Date *
            </label>
            <input
                type="date"
                id="visaStartDate"
                name="visaStartDate"
                value={formData.visaStartDate || ''}
                onChange={handleInputChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
        </div>
        <div className="mb-4">
            <label htmlFor="visaEndDate" className="block text-sm font-medium text-gray-700">
                End Date *
            </label>
            <input
                type="date"
                id="visaEndDate"
                name="visaEndDate"
                value={formData.visaEndDate || ''}
                onChange={handleInputChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
        </div>
    </>
)}

    {/* Additional Fields */}

{/* Reference Section */}
<div className="mb-4 bg-gray-100 p-4 rounded-md">
    <h3 className="text-xl font-semibold mb-2">Reference *</h3>
    <div className="mb-2">
        <label htmlFor="reference.firstName" className="block text-sm font-medium text-gray-700">First Name *</label>
        <input
            type="text"
            id="reference.firstName"
            name="reference.firstName"
            value={formData.reference?.firstName || ''}
            onChange={(e) => handleReferenceChange('firstName', e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
    </div>
    <div className="mb-2">
        <label htmlFor="reference.lastName" className="block text-sm font-medium text-gray-700">Last Name *</label>
        <input
            type="text"
            id="reference.lastName"
            name="reference.lastName"
            value={formData.reference?.lastName || ''}
            onChange={(e) => handleReferenceChange('lastName', e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
    </div>
    <div className="mb-2">
        <label htmlFor="reference.relationship" className="block text-sm font-medium text-gray-700">Relationship *</label>
        <input
            type="text"
            id="reference.relationship"
            name="reference.relationship"
            value={formData.reference?.relationship || ''}
            onChange={(e) => handleReferenceChange('relationship', e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
    </div>
    <div className="mb-2">
        <label htmlFor="reference.phone" className="block text-sm font-medium text-gray-700">Phone Number *</label>
        <input
            type="text"
            id="reference.phone"
            name="reference.phone"
            value={formData.reference?.phone || ''}
            onChange={(e) => handleReferenceChange('phone', e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
    </div>
    <div className="mb-2">
        <label htmlFor="reference.email" className="block text-sm font-medium text-gray-700">Email *</label>
        <input
            type="email"
            id="reference.email"
            name="reference.email"
            value={formData.reference?.email || ''}
            onChange={(e) => handleReferenceChange('email', e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
    </div>
</div>


{/* Emergency Contacts */}
    <div className="mb-4">
        <h3 className="text-xl font-semibold mb-2">Emergency Contacts *</h3>
        {formData.emergencyContacts?.map((contact, index) => (
            <div key={index} className="mb-4 bg-gray-100 p-4 rounded-md">
                <div className="mb-2">
                    <label htmlFor={`emergencyContacts[${index}].firstName`} className="block text-sm font-medium text-gray-700">
                        First Name *
                    </label>
                    <input
                        type="text"
                        id={`emergencyContacts[${index}].firstName`}
                        name={`emergencyContacts[${index}].firstName`}
                        value={contact.firstName || ''}
                        onChange={(e) =>
                            handleEmergencyContactChange(index, 'firstName', e.target.value)
                        }
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div className="mb-2">
                    <label htmlFor={`emergencyContacts[${index}].lastName`} className="block text-sm font-medium text-gray-700">
                        Last Name *
                    </label>
                    <input
                        type="text"
                        id={`emergencyContacts[${index}].lastName`}
                        name={`emergencyContacts[${index}].lastName`}
                        value={contact.lastName || ''}
                        onChange={(e) =>
                            handleEmergencyContactChange(index, 'lastName', e.target.value)
                        }
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div className="mb-2">
                    <label htmlFor={`emergencyContacts[${index}].relationship`} className="block text-sm font-medium text-gray-700">
                        Relationship *
                    </label>
                    <input
                        type="text"
                        id={`emergencyContacts[${index}].relationship`}
                        name={`emergencyContacts[${index}].relationship`}
                        value={contact.relationship || ''}
                        onChange={(e) =>
                            handleEmergencyContactChange(index, 'relationship', e.target.value)
                        }
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div className="mb-2">
                    <label htmlFor={`emergencyContacts[${index}].phone`} className="block text-sm font-medium text-gray-700">
                        Phone Number *
                    </label>
                    <input
                        type="text"
                        id={`emergencyContacts[${index}].phone`}
                        name={`emergencyContacts[${index}].phone`}
                        value={contact.phone || ''}
                        onChange={(e) =>
                            handleEmergencyContactChange(index, 'phone', e.target.value)
                        }
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div className="mb-2">
                    <label htmlFor={`emergencyContacts[${index}].email`} className="block text-sm font-medium text-gray-700">
                        Email *
                    </label>
                    <input
                        type="email"
                        id={`emergencyContacts[${index}].email`}
                        name={`emergencyContacts[${index}].email`}
                        value={contact.email || ''}
                        onChange={(e) =>
                            handleEmergencyContactChange(index, 'email', e.target.value)
                        }
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <button
                    type="button"
                    onClick={() => removeEmergencyContact(index)}
                    className="text-red-600 hover:underline mt-2"
                >
                    Remove Contact
                </button>
            </div>
        ))}
        <button
            type="button"
            onClick={addEmergencyContact}
            className="bg-blue-500 text-white py-2 px-4 rounded-md mt-2"
        >
            Add Emergency Contact
        </button>
    </div>

    {/* File Uploads */}
    <div className="mb-4">
        <h3 className="text-xl font-semibold mb-2">Uploaded Files *</h3>
        <div className="mb-4">
            <label htmlFor="profilePicture" className="block text-sm font-medium text-gray-700">Profile Picture *</label>
            <input
                type="file"
                id="profilePicture"
                name="profilePicture"
                onChange={handleFileChange}
                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
            />
        </div>
        <div className="mb-4">
            <label htmlFor="driverLicense" className="block text-sm font-medium text-gray-700">Driver License *</label>
            <input
                type="file"
                id="driverLicense"
                name="driverLicense"
                onChange={handleFileChange}
                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
            />
        </div>
        <div className="mb-4">
            <label htmlFor="workAuthorization" className="block text-sm font-medium text-gray-700">Work Authorization *</label>
            <input
                type="file"
                id="workAuthorization"
                name="workAuthorization"
                onChange={handleFileChange}
                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
            />
        </div>
    </div>

    {/* Submit */}
    <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 px-4 rounded-md text-lg font-semibold hover:bg-blue-600"
    >
        Submit Application
    </button>
</form>
        )}


    </div>
);
};

export default Onboarding;
