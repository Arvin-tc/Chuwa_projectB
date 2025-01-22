import React from 'react';

const LoadingPage = ({ message = 'Loading...' }) => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-background text-foreground">
            <div className="text-center">
                {/* Spinner */}
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-primary border-solid border-opacity-50 mx-auto mb-4"></div>
                {/* Message */}
                <p className="text-lg font-medium">{message}</p>
            </div>
        </div>
    );
};

export default LoadingPage;
