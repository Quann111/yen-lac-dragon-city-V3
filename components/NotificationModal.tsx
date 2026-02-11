import React, { useEffect } from 'react';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'success' | 'error';
  message: string;
}

const NotificationModal: React.FC<NotificationModalProps> = ({ isOpen, onClose, type, message }) => {
  useEffect(() => {
    if (isOpen) {
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-all duration-300">
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 transform transition-all duration-300 scale-100 animate-fade-in-up"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex flex-col items-center text-center">
          {/* Icon */}
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
            type === 'success' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
          }`}>
            {type === 'success' ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </div>

          {/* Title */}
          <h3 className={`text-xl font-bold mb-2 ${
            type === 'success' ? 'text-green-800' : 'text-red-800'
          }`}>
            {type === 'success' ? 'Thành Công' : 'Thông Báo'}
          </h3>

          {/* Message */}
          <p className="text-gray-600 mb-6 font-body leading-relaxed">
            {message}
          </p>

          {/* Button */}
          <button
            onClick={onClose}
            className={`px-6 py-2.5 rounded-full font-bold text-white shadow-lg transform transition-all duration-300 hover:-translate-y-1 ${
              type === 'success' 
                ? 'bg-gradient-to-r from-green-500 to-green-700 hover:shadow-green-500/30' 
                : 'bg-gradient-to-r from-red-500 to-red-700 hover:shadow-red-500/30'
            }`}
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;
