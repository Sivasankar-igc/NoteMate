import React from 'react';
import '../CSS/about.css';

export default () => {
    return (
        <section className="about-section">
            <div className="container">
                <h1>About Us</h1>
                <p>
                    Welcome to our website! Our platform helps users post notes on different subjects. We aim to provide a seamless and collaborative environment for sharing and discovering knowledge.
                </p>
                <div className="about-content">
                    <div className="about-image">
                        <img src={`/banner.jpg`} alt="About Us" />
                    </div>
                    <div className="about-text">
                        <h2>Our Mission</h2>
                        <p>
                            Our mission is to create a community-driven platform where users can share insights, learn from one another, and connect over shared interests in various subjects. We believe in the power of collective knowledge and strive to make learning more accessible and engaging for everyone.
                        </p>
                        <h2>What We Offer</h2>
                        <ul>
                            <li>A platform to post and share notes on various subjects.</li>
                            <li>Tools to connect with like-minded individuals.</li>
                            <li>A user-friendly interface for seamless navigation.</li>
                            <li>Resources to enhance your learning experience.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
};
