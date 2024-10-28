import React from 'react';

const Shimmer = () => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, idx) => (
                <div
                    key={idx}
                    className="bg-gradient-to-br from-blue-800 to-purple-800 p-4 shadow-lg rounded-lg animate-pulse"
                >
                    <div className="h-32 bg-gray-700 rounded-t-md mb-2"></div>
                    <div className="h-6 bg-gray-600 rounded mb-2"></div>
                    <div className="h-4 bg-gray-600 rounded mb-2"></div>
                    <div className="h-4 bg-gray-600 rounded mb-2"></div>
                    <div className="h-4 bg-gray-600 rounded mb-2"></div>
                </div>
            ))}
        </div>
    );
};

export default Shimmer;