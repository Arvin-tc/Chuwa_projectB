import React from 'react';

const ErrorPage = ({ message = 'Something went wrong.', onRetry }) => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-destructive/10 text-destructive">
            <div className="text-center">
                {/* Dynamic Error Message */}
                <p className="text-lg font-bold mb-4">{message}</p>
                {/* Retry Button */}
                {onRetry && (
                    <button
                        onClick={onRetry}
                        className="bg-destructive text-white px-4 py-2 rounded hover:bg-destructive-foreground hover:text-destructive transition"
                    >
                        Retry
                    </button>
                )}
            </div>
        </div>
    );
};

export default ErrorPage;
