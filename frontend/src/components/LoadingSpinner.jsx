import React from 'react';

const LoadingSpinner = ({ size = 'default', message = '' }) => {
    const sizeClasses = {
        small: 'h-6 w-6',
        default: 'h-12 w-12',
        large: 'h-16 w-16'
    };

    return (
        <div className="flex flex-col items-center justify-center py-12">
            <div className="relative">
                {/* Outer ring */}
                <div className={`${sizeClasses[size]} rounded-full border-4 border-timberwolf-200`}></div>

                {/* Spinning ring */}
                <div className={`absolute inset-0 ${sizeClasses[size]} rounded-full border-4 border-transparent border-t-flame-600 animate-spin`}></div>
            </div>

            {message && (
                <p className="mt-4 text-black-olive-600 text-sm">{message}</p>
            )}
        </div>
    );
};

export default LoadingSpinner;