import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faInstagram, faTwitter, faPinterestP, faYoutube } from '@fortawesome/free-brands-svg-icons';
import './Home.css';

const Home = ({ isAuthenticated, currentUser }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  const offers = [
    {
      title: 'Get ₹50 cashback on first recharge',
      description: 'New users get instant cashback',
      background: 'url(https://images.unsplash.com/photo-1556740738-b6a63e27c4df?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80)'
    },
    {
      title: 'Flat 10% off on recharges above ₹199',
      description: 'Save more on higher recharges',
      background: 'url(https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80)'
    },
    {
      title: 'Refer a friend and earn ₹30 wallet cash',
      description: 'Share the love and earn rewards',
      background: 'url(https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80)'
    },
    {
      title: 'Exclusive combo plans every weekend',
      description: 'Special weekend deals just for you',
      background: 'url(https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80)'
    }
  ];

  const operators = [
    {
      id: 'airtel',
      name: 'Airtel',
      features: ['4G/5G Network', 'High-speed data', 'Free OTT subscriptions', 'Low-cost packs'],
      path: '/airtel',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Airtel-vector-logo.svg/1200px-Airtel-vector-logo.svg.png'
    },
    {
      id: 'jio',
      name: 'Jio',
      features: ['Affordable plans', 'Nationwide 4G', 'Free Jio apps', 'Unlimited calling'],
      path: '/jio',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Reliance_Jio_Logo_%28October_2015%29.svg/1200px-Reliance_Jio_Logo_%28October_2015%29.svg.png'
    },
    {
      id: 'vi',
      name: 'Vi (Vodafone Idea)',
      features: ['Double data', 'Weekend data rollover', 'Vi Movies & TV', 'Truly unlimited calls'],
      path: '/vi',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Vi_logo.svg/1200px-Vi_logo.svg.png'
    },
    {
      id: 'bsnl',
      name: 'BSNL',
      features: ['Government-backed', 'Wider rural coverage', 'Low-cost plans', 'Stable network'],
      path: '/bsnl',
      logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/5/53/BSNL_Logo.svg/1200px-BSNL_Logo.svg.png'
    }
  ];

  // Auto-advance carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % offers.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [offers.length]);

  const handleOperatorClick = (operatorPath) => {
    if (!isAuthenticated) {
      alert('Please login to access operator services');
      navigate('/login');
      return;
    }
    navigate(operatorPath);
  };

  return (
    <div className="home">
      {/* Hero */}
      <section className="hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1>Welcome to Top It Up</h1>
          <p>Enjoy lightning-fast, secure and rewarding mobile recharges</p>
        </div>
      </section>

      {/* Carousel Section */}
      <section className="carousel-section">
        <div className="container">
          <h2>Exclusive Offers</h2>
          <div className="carousel-container">
            <div className="carousel-wrapper">
              <div 
                className="carousel-track"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {offers.map((offer, index) => (
                  <div key={index} className="carousel-slide">
                    <div 
                      className="offer-card"
                      style={{ backgroundImage: offer.background }}
                    >
                      <div className="offer-overlay"></div>
                      <div className="offer-content">
                        <h3>{offer.title}</h3>
                        <p>{offer.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Operator Features Section */}
      <section className="operator-section">
        <div className="container">
          <h2>Operator Highlights</h2>
          <div className="operator-grid">
            {operators.map((op) => (
              <div 
                key={op.id} 
                className="operator-card"
                data-operator={op.id}
                onClick={() => handleOperatorClick(op.path)}
              >
                <div className="operator-overlay"></div>
                <h3>{op.name}</h3>
                <ul>
                  {op.features.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
                <div className="click-hint">
                  {isAuthenticated ? 'Click to view plans' : 'Login to view plans'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* New Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-column">
              <h4>SUPPORT</h4>
              <ul>
                <li><a href="#">CONTACT US</a></li>
                <li><a href="#">FAQS</a></li>
                <li><a href="#">SHIPPING POLICY</a></li>
                <li><a href="#">RETURNS & EXCHANGES</a></li>
                <li><a href="#">ORDER STATUS</a></li>
              </ul>
            </div>
            <div className="footer-column">
              <h4>ABOUT US</h4>
              <ul>
                <li><a href="#">OUR STORY</a></li>
                <li><a href="#">CAREERS</a></li>
                <li><a href="#">STORE LOCATIONS</a></li>
                <li><a href="#">SUSTAINABILITY</a></li>
                <li><a href="#">PRESS</a></li>
              </ul>
            </div>
            <div className="footer-column">
              <h4>SALES & PROMOTIONS</h4>
              <ul>
                <li><a href="#">SEASON SALE</a></li>
                <li><a href="#">MEMBER DISCOUNTS</a></li>
                <li><a href="#">CLEARANCE</a></li>
                <li><a href="#">GIFT CARDS</a></li>
                <li><a href="#">REFER A FRIEND</a></li>
              </ul>
            </div>
            <div className="footer-column">
              <h4>CONNECT WITH US</h4>
              <div className="social-icons">
                <a href="#" aria-label="Facebook"><FontAwesomeIcon icon={faFacebookF} /></a>
                <a href="#" aria-label="Instagram"><FontAwesomeIcon icon={faInstagram} /></a>
                <a href="#" aria-label="Twitter"><FontAwesomeIcon icon={faTwitter} /></a>
                <a href="#" aria-label="Pinterest"><FontAwesomeIcon icon={faPinterestP} /></a>
                <a href="#" aria-label="YouTube"><FontAwesomeIcon icon={faYoutube} /></a>
              </div>
            </div>
          </div>
          <div className="copyright">
            <p>&copy; 2025 TOPITUP. ALL RIGHTS RESERVED.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;