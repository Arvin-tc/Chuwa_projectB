import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVisaStatus, uploadVisaDoc } from '../redux/slices/visaStatusSlice';
const PORT = 3001;

const VisaStatus = () => {
    const dispatch = useDispatch();
    const { visaDocuments, status, feedback, loading, error } = useSelector((state) => state.visa);
    const [uploading, setUploading] = useState(null);

    useEffect(() => {
        dispatch(fetchVisaStatus());
    }, [dispatch]);

    const handleUpload = (documentType, file) => {
        setUploading(documentType);
        dispatch(uploadVisaDoc({ documentType, file }));
        setUploading(null);
    };

    const getDocumentMessage = (documentType) => {
        const document = visaDocuments[documentType];
        if (!document) {
            return `Please upload your ${documentType.replace(/([A-Z])/g, ' $1')}`;
        }
        if (status === 'Pending') {
            return `Waiting for HR to approve your ${documentType.replace(/([A-Z])/g, ' $1')}`;
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
                    return 'Please send the I-983 along with all necessary documents to your school and upload the new I-20.';
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


        const dependency = dependencies[docType];
        console.log('dependency: ', dependency);
        if(!dependency) return null;

        const dependencyDoc = visaDocuments[dependency];
        if(!dependencyDoc) {
            return `${dependency.replace(/([A-Z])/g, '$1')} must be uploaded first.` ;
        }
        if(status !== 'Approved'){

            return `${dependency.replace(/([A-Z])/g, '$1')} must be approved by HR first.`;
        }
        // return !dependencyDoc || status !== 'Approved';
        return null;
    }

    const isDependant = (docType) => {
        const msg = getDependency(docType);
        if(msg) {
            alert(msg);
            return true;
        }
        return false;
    };

    const renderFileActions = (docType) => (
        <>
            <a
                href={`http://localhost:${PORT}/uploads/${visaDocuments[docType]}`}
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

    const renderI983Templates = () => (
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
                                    if(isDependant(docType)) {
                                        e.preventDefault();
                                    }
                                }}
            onChange={(event) => handleUpload('i983', event.target.files[0])}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
            disabled={isDependant('i983')}
           /> 
        </>
    );

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Visa Status Management</h1>
            <div className="bg-white p-6 rounded-md shadow-md space-y-6">
                {['optReceipt', 'optEAD', 'i983', 'i20'].map((docType) => (
                    <div key={docType} className="mb-6">
                        <h2 className="text-lg font-bold capitalize">{docType.replace(/([A-Z])/g, ' $1')}</h2>
                        <p className="mb-2 text-sm text-gray-600">{getDocumentMessage(docType)}</p>
                        {visaDocuments[docType] && docType !== 'i983' && (
                            <div className="flex items-center mb-4">{renderFileActions(docType)}</div>
                        )}
                        {docType === 'i983' ? renderI983Templates() : (
                            (!visaDocuments[docType] || status !== 'Approved') && !uploading && (
                                <input
                                    type="file"
                                    accept="image/jpeg,image/png,application/pdf"
                                onClick={(e) => {
                                    if(isDependant(docType)) {
                                        e.preventDefault();
                                    }
                                }}
                                    onChange={(event) => handleUpload(docType, event.target.files[0])}
                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
                                    disabled={isDependant(docType)}
                                />
                            )
                        )}
                        {uploading === docType && <p className="text-sm text-blue-500">Uploading...</p>}
                    </div>
                ))}
            </div>
        </div>
    );
};
export default VisaStatus;
