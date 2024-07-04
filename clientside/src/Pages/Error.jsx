import React from 'react';
import '../CSS/error.css';

export default ({ children }) => {
    return (
        <div className="error-container">
            {children}
        </div>
    );
};
{/* <img className="error-image" src={`/404.png`} alt="404 Error" /> */ }