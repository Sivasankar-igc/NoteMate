import React from 'react';
import "../CSS/popWindow.css"; // Style for the popup window
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';

export default ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="popup-wrapper">
      <div className="popup-overlay" onClick={onClose}></div>
      <div className="popup-content">
        <button className="close-btn" onClick={onClose}>
          <FontAwesomeIcon icon={faClose}/>
        </button>
        {children}
      </div>
    </div>
  );
};