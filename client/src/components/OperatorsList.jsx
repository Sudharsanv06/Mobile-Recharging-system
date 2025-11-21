import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './OperatorsList.css';

export default function OperatorsList() {
  const [ops, setOps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOperator, setSelectedOperator] = useState(null);

  // Operator logos mapping
  const operatorLogos = {
    'Airtel': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Bharti_Airtel_Logo.svg/2560px-Bharti_Airtel_Logo.svg.png',
    'Jio': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Reliance_Jio_Logo.svg/2560px-Reliance_Jio_Logo.svg.png',
    'Vi': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Vi_logo.svg/2560px-Vi_logo.svg.png',
    'BSNL': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/BSNL_Logo.svg/2560px-BSNL_Logo.svg.png',
  };

  useEffect(() => {
    let mounted = true;
    const fetchOps = async () => {
      try {
        const res = await axios.get('/api/v1/operators');
        if (mounted) {
          // Simulate loading delay for better UX
          setTimeout(() => {
            setOps(res.data.data || []);
            setLoading(false);
          }, 800);
        }
      } catch (err) {
        console.error('operators fetch error', err);
        if (mounted) setLoading(false);
      }
    };
    fetchOps();
    return () => { mounted = false; };
  }, []);

  const handleOperatorClick = (opId) => {
    setSelectedOperator(opId);
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="operators-list-container">
        <div className="operators-content">
          <div className="operators-header">
            <h1 className="operators-title">Select Your Operator</h1>
            <p className="operators-subtitle">Choose from our available mobile operators</p>
          </div>
          <div className="operators-grid-skeleton">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="skeleton-card">
                <div className="skeleton-logo"></div>
                <div className="skeleton-name"></div>
                <div className="skeleton-circle"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (!ops.length) {
    return (
      <div className="operators-list-container">
        <div className="operators-content">
          <div className="empty-state">
            <div className="empty-state-icon">📱</div>
            <h2 className="empty-state-title">No Operators Found</h2>
            <p className="empty-state-text">We couldn't find any operators at the moment. Please try again later.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="operators-list-container">
      <div className="operators-content">
        <div className="operators-header">
          <h1 className="operators-title">Select Your Operator</h1>
          <p className="operators-subtitle">Choose from our available mobile operators</p>
        </div>
        <div className="operators-grid">
          {ops.map(op => (
            <Link
              key={op._id}
              to={`/operators/${op._id}`}
              className={`operator-card ${selectedOperator === op._id ? 'selected' : ''}`}
              onClick={() => handleOperatorClick(op._id)}
            >
              <div className="operator-badge">View Plans</div>
              <div className="operator-logo-container">
                {operatorLogos[op.name] ? (
                  <img src={operatorLogos[op.name]} alt={op.name} className="operator-logo" />
                ) : (
                  <div className="operator-logo-fallback">{op.name?.charAt(0)}</div>
                )}
              </div>
              <div className="operator-info">
                <h3 className="operator-name">{op.name}</h3>
                <p className="operator-circle">{op.circle || 'All India'}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
