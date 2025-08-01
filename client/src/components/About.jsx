import React from 'react';
import './About.css';

const About = () => {
  return (
    <div className="about">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="about-hero-overlay"></div>
        <div className="about-hero-content">
          <h1>About Top It Up</h1>
          <p>Your trusted partner for seamless mobile recharges</p>
        </div>
      </section>

      {/* Company Overview */}
      <section className="company-overview">
        <div className="container">
          <div className="overview-content">
            <h2>Who We Are</h2>
            <p>
              Top It Up is India’s leading mobile recharge platform, revolutionizing the way people
              top up their mobile connections. Since our inception in 2020, we’ve provided fast,
              secure, and convenient recharge services to millions across the country.
            </p>
            <img 
              src="https://cdn.pixabay.com/photo/2016/11/29/06/15/office-1867759_1280.jpg" 
              alt="Company Overview" 
              className="overview-img"
            />
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="mission-vision">
        <div className="container">
          <div className="mission-vision-grid">
            <div className="mission-card">
              <img src="https://cdn-icons-png.flaticon.com/512/189/189665.png" alt="Mission" width="50" />
              <h3>Our Mission</h3>
              <p>To democratize mobile recharge services with a seamless, secure experience.</p>
            </div>
            <div className="vision-card">
              <img src="https://cdn-icons-png.flaticon.com/512/1308/1308848.png" alt="Vision" width="50" />
              <h3>Our Vision</h3>
              <p>To be India's most trusted and innovative platform for telecom services.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Company Stats */}
      <section className="company-stats">
        <div className="container">
          <h2>Our Impact</h2>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">5M+</div>
              <div className="stat-label">Happy Customers</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">50M+</div>
              <div className="stat-label">Recharges Completed</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">4</div>
              <div className="stat-label">Major Operators</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">99.9%</div>
              <div className="stat-label">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="team-section">
        <div className="container">
          <h2>Leadership Team</h2>
          <div className="team-grid">
            <div className="team-member">
              <img src="https://randomuser.me/api/portraits/men/32.jpg" className="member-avatar-img" alt="CEO" />
              <h4>Prabhu Chennimalai</h4>
              <p className="member-title">Chief Executive Officer</p>
              <p className="member-desc">15+ years in fintech and telecom industry</p>
            </div>
            <div className="team-member">
              <img src="https://randomuser.me/api/portraits/women/45.jpg" className="member-avatar-img" alt="CTO" />
              <h4>Saravana M</h4>
              <p className="member-title">Chief Technology Officer</p>
              <p className="member-desc">Former Google engineer with 12+ years experience</p>
            </div>
            <div className="team-member">
              <img src="https://randomuser.me/api/portraits/men/54.jpg" className="member-avatar-img" alt="CFO" />
              <h4>Shanmuga Patel Kani</h4>
              <p className="member-title">Chief Financial Officer</p>
              <p className="member-desc">CA with 10+ years in financial services</p>
            </div>
            <div className="team-member">
              <img src="https://randomuser.me/api/portraits/women/65.jpg" className="member-avatar-img" alt="Customer" />
              <h4>Sunita Kapoor</h4>
              <p className="member-title">Head of Customer Experience</p>
              <p className="member-desc">Expert in customer success and user experience</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Experience the Future of Mobile Recharges?</h2>
            <p>Join millions of satisfied users who trust Top It Up.</p>
            <div className="cta-buttons">
              <button className="cta-primary">Get Started</button>
              <button className="cta-secondary">Talk to Us</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;