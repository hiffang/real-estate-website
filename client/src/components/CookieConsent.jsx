// src/CookieConsent.js
import React, { useState, useEffect } from 'react';

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const isAccepted = localStorage.getItem('cookie-consent');
    if (!isAccepted) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setIsVisible(false);
    // Initialize analytics or other services here
  };

  const handleDecline = () => {
    localStorage.setItem('cookie-consent', 'declined');
    setIsVisible(false);
    // Disable analytics or other services here
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white p-4 rounded-lg shadow-lg z-50">
      <div className="text-center">
        <p className="mb-4">We use cookies to improve your experience on our site. By accepting, you agree to our use of cookies.</p>
        <button
          onClick={handleAccept}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mr-2"
        >
          Accept
        </button>
        <button
          onClick={handleDecline}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
        >
          Decline
        </button>
      </div>
    </div>
  );
};

export default CookieConsent;
