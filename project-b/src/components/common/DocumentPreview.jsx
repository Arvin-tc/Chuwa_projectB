import React from 'react';

const DocumentPreview = ({ fileName, fileUrl }) => {
    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = fileUrl;
        link.download = fileName;
        link.click();
    };

    return (
        <div className="flex items-center justify-between p-4 border border-gray-300 rounded-md">
            <span className="text-gray-700">{fileName}</span>
            <div className="space-x-2">
                <a
                    href={fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                >
                    Preview
                </a>
                <button
                    onClick={handleDownload}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                    Download
                </button>
            </div>
        </div>
    );
};

export default DocumentPreview;
