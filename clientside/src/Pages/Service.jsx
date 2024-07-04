import React from 'react';
import '../CSS/services.css';

const Services = () => {
    return (
        <section className="services-section">
            <div className="container">
                <h1>Our Services</h1>
                <p>
                    Explore how we can assist you in your journey of knowledge sharing and community building.
                </p>
                <div className="services-content">
                    <div className="service-item">
                        <img src={`/postNotes.jpg`} alt="Service 1" />
                        <h2>Post Notes</h2>
                        <p>
                            Share your insights and expertise on various subjects. Post notes, articles, and updates to engage with your audience and contribute to the community's knowledge base.
                        </p>
                    </div>
                    <div className="service-item">
                        <img src={`/connectWithOthers.jpg`} alt="Service 1" />
                        <h2>Connect with Others</h2>
                        <p>
                            Connect with like-minded individuals, professionals, and learners from around the world. Build your network, collaborate on projects, and discover new opportunities for growth and learning.
                        </p>
                    </div>
                    <div className="service-item">
                        <img src={`/discoverKnowledge.jpg`} alt="Service 1" />
                        <h2>Discover Knowledge</h2>
                        <p>
                            Explore a wealth of knowledge shared by others. Discover new perspectives, learn from experts in various fields, and stay updated with the latest trends and insights relevant to your interests.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Services;
