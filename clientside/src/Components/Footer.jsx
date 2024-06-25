import React from 'react';
import '../CSS/footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-logo">
                <img src={`/logo.png`} alt="Logo" />
            </div>
            <div className="footer-content">
                <div className="footer-section about">
                    <h2>About Us</h2>
                    <p>Your text here about your company or website.</p>
                    <div className="contact">
                        <span><i className="fa fa-map-marker"></i> Address: 123 Street, City, Country</span>
                        <span><i className="fa fa-phone"></i> Phone: +1234567890</span>
                        <span><i className="fa fa-envelope"></i> Email: info@example.com</span>
                    </div>
                </div>
                <div className="footer-section links">
                    <h2>Quick Links</h2>
                    <ul>
                        <li><a href="#">Home</a></li>
                        <li><a href="#">About</a></li>
                        <li><a href="#">Services</a></li>
                        <li><a href="#">Contact</a></li>
                    </ul>
                </div>
                <div className="footer-section social">
                    <h2>Follow Us</h2>
                    <div className="social-icons">
                        <a href="#"><i className="fa fa-facebook"></i></a>
                        <a href="#"><i className="fa fa-twitter"></i></a>
                        <a href="#"><i className="fa fa-instagram"></i></a>
                        <a href="#"><i className="fa fa-linkedin"></i></a>
                    </div>
                </div>
            </div>
            <div className="footer-bottom">
                &copy; 2024 notemate.com | Designed by Siva Sankar Sahoo
            </div>
        </footer>
    );
};

export default Footer;
