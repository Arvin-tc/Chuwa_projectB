import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVisaStatus, uploadVisaDoc, updateVisaStatus } from '../redux/slices/visaStatusSlice';
import Navbar from '../components/common/NavigationBar';
const PORT = 3001;

const VisaStatus = () => {
    const dispatch = useDispatch();
    const { appId, visaDocuments, status, feedback, loading, error } = useSelector((state) => state.visa);
    const [uploading, setUploading] = useState(null);

    useEffect(() => {
        dispatch(fetchVisaStatus());
    }, [dispatch]);

    const handleUpload = (fileType, file) => {
        setUploading(fileType);
        dispatch(uploadVisaDoc({ fileType, file }));
        console.log('page appId:', appId);
        dispatch(updateVisaStatus({ applicationId: appId, status: 'Pending'}));
        setUploading(null);
    };

const getDocumentMessage = (documentType) => {
        if(!visaDocuments) {
            return 'Loading visa documents...';
        }
    const dependencies = {
        optReceipt: null,
        optEAD: 'optReceipt',
        i983: 'optEAD',
        i20: 'i983',
    };
    const documentTypes = Object.keys(dependencies);
    const currentIndex = documentTypes.indexOf(documentType);
    const nextDocType = documentTypes[currentIndex + 1]; 
    const nextDocUploaded = nextDocType ? visaDocuments[nextDocType] : null; 
    // console.log('nextDoc:', nextDocUploaded);
        if(nextDocUploaded) {

            return `${documentType} is approved by HR`;
    }

        const document = visaDocuments[documentType];
        if (!document) {
            return `Please upload your ${documentType}`;
        }
        if (status === 'Pending') {
            return `Waiting for HR to approve your ${documentType}`;
        }
        if (status === 'Rejected') {
            return `HR Feedback: ${feedback || 'No feedback provided'}`;
        }
        if (status === 'Approved') {
            switch (documentType) {
                case 'optReceipt':
                    return 'Please upload a copy of your OPT EAD.';
                case 'optEAD':
                    return 'Please download and fill out the I-983 form.';
                case 'i983':
                    return 'Please upload the new I-20.';
                case 'i20':
                    return 'All documents have been approved.';
                default:
                    return '';
            }
        }
    };

    
const getDependency = (docType) => {
    const dependencies = {
        optReceipt: null,
        optEAD: 'optReceipt',
        i983: 'optEAD',
        i20: 'i983',
    };

    let dependency = dependencies[docType];


    const dependencyDoc = visaDocuments[dependency]; // Check if dependency document is uploaded

    // Find the next document in the sequence
    const documentTypes = Object.keys(dependencies);
    const currentIndex = documentTypes.indexOf(docType);
    const nextDocType = documentTypes[currentIndex + 1]; // Get next document type
    const nextDocUploaded = nextDocType ? visaDocuments[nextDocType] : null; // Check if next doc is uploaded
    // console.log('nextDoc:', nextDocUploaded);
    if(nextDocUploaded) {
        return `${docType} is already approved`;
    }

    if (!dependency) return null; // No dependency for optReceipt



    // If the required dependency is missing, return a message
    if (!dependencyDoc) {
        return `${dependency} must be uploaded first.`;
    }

    // If the dependency is uploaded but not yet approved, return an approval message
    if (status !== 'Approved' && !visaDocuments[docType]) {
        return `${dependency} must be approved by HR first.`;
    }


    return null; 
};




    const renderFileActions = (docType) => (
        <>
            <a
                href={`http://localhost:${PORT}/uploads/${visaDocuments[docType].split('/').pop()}`}
                target='_blank'
                rel='noopener noreferrer'
                className='text-blue-600 underline mr-4'
            >
                View
            </a>
            <button
        onClick={() => {
            const link = document.createElement('a');
            link.href = `http:localhost:${PORT}/uploads/${visaDocuments[docType]}`;
            link.download = visaDocuments[docType].split('/').pop();
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }}
        className='text-blue-600 underline'
        >
            Download
        </button>
        </>
    );

    const renderI983Templates = (documentMessage,dependencyMessage, isApproved) => {
        return (
        <>
            <div className='mb-4'>
                <a
                    href={`http://localhost:${PORT}/sample/i983Empty.pdf`}
                    target='_blank'
        rel='noopener noreferrer'
        className='text-blue-600 underline mr-4'
        >
            Empty i983 Template
        </a>

        <a
            href={`http://localhost:${PORT}/sample/i983Sample.pdf`}
            target='_blank'
            rel='noopener noreferrer'
            className='text-blue-600 underline'
        >
            Sample i983 Template
        </a>
            </div>

        {visaDocuments.i983 && (
            <div className='mb-4'>
                <h3 className='font-bold'>Uploaded I-983</h3>
                <div className='flex items-center'>
                    {renderFileActions('i983')}
                </div>
            </div>
        )}
        <input
            type='file'
            accept='image/jpeg,image/png,application/pdf'

                                onClick={(e) => {
                                    if(dependencyMessage || isApproved) {
                                        alert(dependencyMessage || documentMessage);
                                        e.preventDefault();
                                    }
                                }}
                                onChange={(event) =>
                                    handleUpload('i983', event.target.files[0])
                                }
                                  className={`block w-full text-sm text-gray-500
                                    file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0
                                    file:text-sm file:bg-blue-100 file:text-blue-700
                                    hover:file:bg-blue-200 ${
                                        dependencyMessage || isApproved ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}           /> 
        </>
);
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!visaDocuments) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-100">
                <div className="bg-white shadow-lg rounded-2xl p-6 flex flex-col items-center">
                    <svg className="w-16 h-16 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <h2 className="text-xl font-semibold text-gray-700 mt-4">File Uploaded Successfully!</h2>
                    <p className="text-gray-500 mt-2">Your visa documents have been uploaded.</p>
                    <button 
                        className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-all"
                        onClick={() => window.location.reload()}
                    >
                        Go back
                    </button>
                </div>
            </div>
        );
    }


return (
    <div className="container mx-auto p-6">
        <Navbar />
        <p style={{ marginTop: '50px' }} />
        <h1 className="text-2xl font-bold mb-6">Visa Status Management</h1>

        <div className="bg-white p-6 rounded-md shadow-md space-y-6">
    {['optReceipt', 'optEAD', 'i983', 'i20'].map((docType) => {

                const documentMessage = getDocumentMessage(docType);
                const isI983 = docType === 'i983';
                const isUploading = uploading === docType;
                let isApproved = status === 'Approved';
                const fileExists = visaDocuments[docType];
                if(!fileExists) isApproved = false;
                const dependencyMessage = getDependency(docType);
                console.log(`docType: ${docType}, documentMessage: ${documentMessage}, dependencyMessage: ${dependencyMessage}, fileExists:${fileExists}, isApproved:${isApproved}`);
                return (
                    <div key={docType} className="mb-6">
                        <h2 className="text-lg font-bold capitalize">
                            {docType}
                        </h2>
                        <p className="mb-2 text-sm text-gray-600">{documentMessage}</p>

                        {fileExists && !isI983 && (
                            <div className="flex items-center mb-4">{renderFileActions(docType)}</div>
                        )}

                    {isI983 ? (

                        renderI983Templates(documentMessage, dependencyMessage, isApproved)
                        ) : 
                        !uploading && (
                            <input
                                type="file"
                                accept="image/jpeg,image/png,application/pdf"
                                onClick={(e) => {
                                    if (dependencyMessage || isApproved ) {
                                        e.preventDefault();
                                        alert(dependencyMessage || documentMessage);
                                    }
                                }}
                                onChange={(event) =>
                                    handleUpload(docType, event.target.files[0])
                                }
                                className={`block w-full text-sm text-gray-500
                                    file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0
                                    file:text-sm file:bg-blue-100 file:text-blue-700
                                    hover:file:bg-blue-200 ${
                                        dependencyMessage || isApproved ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                            />
                        )}

                        {isUploading && <p className="text-sm text-blue-500">Uploading...</p>}
                    </div>
                );
            })}
        </div>
    </div>
);

};
export default VisaStatus;
