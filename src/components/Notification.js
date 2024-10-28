// Notification.js
import React from 'react';

const Notification = ({ message, type, onClose }) => {
    const notificationStyles = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        info: 'bg-blue-500',
    };

    return (
        <div className={`fixed top-4 pt-20 right-4 p-4 rounded shadow-lg ${notificationStyles[type]} text-white`}>
            <div className="flex justify-between items-center">
                <span>{message}</span>
                <button onClick={onClose} className="ml-4 text-white font-bold">
                    ×
                </button>
            </div>
        </div>
    );
};

export default Notification;
