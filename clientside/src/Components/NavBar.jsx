import React, { useState } from 'react';
import '../CSS//Navbar.css';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { statusCode } from '../utils/statusFile.mjs';
// import logo from '../assets/a.jpg'; // Update the path to your logo

const Navbar = () => {
    const [isMobile, setIsMobile] = useState(false);

    const { status, data } = useSelector(state => state.user)

    const handleMenuClick = () => {
        setIsMobile(!isMobile);
    };

    return (
        <nav className="navbar">
            <div className="logo">
                <img src={`/logo.png`} alt="Notemate Logo" />
            </div>
            <ul className={isMobile ? "nav-links-mobile" : "nav-links"}>
                <li><NavLink to="/">Home</NavLink></li>
                
                {
                    status === statusCode.IDLE
                    ?<li><NavLink to={`/user_account/?userId=${data._id}`}>My Account</NavLink></li>
                    :<li><NavLink to="/account/login">Login</NavLink></li>
                }
            </ul>
            <div className="hamburger" onClick={handleMenuClick}>
                <span className="bar"></span>
                <span className="bar"></span>
                <span className="bar"></span>
            </div>
        </nav>
    );
};

export default Navbar;
