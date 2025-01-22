import React, {useState, useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOnboardingData, submitOnboarding } from '../redux/slices/onboardingSlice';
// TODO import Loading & Error page
import LoadingPage from '../components/LoadingPage';
import ErrorPage from '../components/ErrorPage';

const Onboarding = () => {
    const dispatch = useDispatch();
    const { status, application, feedback, loading, error } = useSelector((state) => state.onboarding);

    const [formData, setFormData] = useState({});
    const [files, setFiles] = useState({});

    useEffect(() => {
        dispatch(fetchOnboardingData());
    }, [dispatch]);

    const handleInputChange = (e) => { // event obj for onChange event fired
        const {name, value} = e.target;
        setFormData((prev) => ({...prev, [name]: value}));
    };

    const handleFileChange = (e) => {
        const { name } = e.target;
        const file = e.target.files[0];  // input can allow multiple files if the multiple attribute is present
        setFiles((prev) => ({...prev, [name]: file}));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const form = new FormData();
        Object.keys(formData).forEach((key) => form.append(key, formData[key]));
        Object.keys(files).forEach((key) => form.append(key, files[key]));

        dispatch(submitOnboarding(form));
    }

    if(loading) return <LoadingPage message="Loading data, please wait..." />;
    if(error)return <ErrorPage message={`Failed to fetch data: ${error,message}`} />;

    
return (
    <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Onboarding Application</h1>
        
        {/* Status: Pending */}
        {status === 'Pending' && (
            <div className="bg-yellow-100 text-yellow-800 p-4 rounded-md mb-6">
                <p className="text-lg">Your application is under review. Below are the submitted details:</p>
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
        {(status === '' || status === 'Rejected') && (
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-md shadow-lg">
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">Fill Your Details</h2>

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
                        required
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="profilePicture" className="block text-sm font-medium text-gray-700">Profile Picture *</label>
                    <input
                        type="file"
                        id="profilePicture"
                        name="profilePicture"
                        onChange={handleFileChange}
                        required
                        className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-md text-lg font-semibold hover:bg-blue-600"
                >
                    Submit Application
                </button>
            </form>
        )}

        {/* Status: Pending - Read-only Application */}
        {status === 'Pending' && (
            <div className="bg-gray-50 p-6 rounded-md shadow-md">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">Submitted Details</h2>
                <pre className="bg-gray-100 p-4 rounded-md text-sm text-gray-800 overflow-x-auto">
                    {JSON.stringify(application, null, 2)}
                </pre>
            </div>
        )}
    </div>
);
};

export default Onboarding;
