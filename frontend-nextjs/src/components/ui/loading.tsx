import React from 'react';

const Loading: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center p-8">
            <svg className="animate-spin h-12 w-12 mb-2" viewBox="0 0 24 24">
                <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="#2b82d9"
                    strokeWidth="4"
                ></circle>
                <path
                    className="opacity-75"
                    fill="#2b82d9"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
            </svg>
            <span className="text-lg font-medium text-white animate-pulse text-center">
                Loading<span className="text-[#2b82d9]">...</span>
            </span>
        </div>
    );
};

export default Loading;

