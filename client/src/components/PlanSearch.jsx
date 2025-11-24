import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { toast } from '../utils/toast';
import { useNavigate } from 'react-router-dom';
import './PlanSearch.css';

const PlanSearch = () => {
  const [query, setQuery] = useState('');
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');
  const [validity, setValidity] = useState('');
  const [data, setData] = useState('');
  const [operator, setOperator] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (query) params.append('q', query);
      if (minAmount) params.append('min', minAmount);
      if (maxAmount) params.append('max', maxAmount);
      if (validity) params.append('validity', validity);
      if (data) params.append('data', data);
      if (operator) params.append('operator', operator);

      const res = await api.get(`/api/v1/plans/search?${params.toString()}`);
      setResults(res.data.data || []);
    } catch (error) {
      toast.error('Failed to search plans');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPlan = (plan) => {
    navigate('/payment', {
      state: {
        operatorId: plan.operatorId,
        operator: plan.operatorName,
        amount: plan.amount,
        validity: plan.validity,
        data: plan.data,
        description: plan.description,
        planId: plan.planId,
      },
    });
  };

  return (
    <div className="plan-search">
      <h2>Search Plans</h2>
      
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search plans..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button onClick={handleSearch} disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
        <button onClick={() => setShowFilters(!showFilters)}>
          {showFilters ? 'Hide' : 'Show'} Filters
        </button>
      </div>

      {showFilters && (
        <div className="filters-panel">
          <div className="filter-group">
            <label>Min Amount</label>
            <input
              type="number"
              value={minAmount}
              onChange={(e) => setMinAmount(e.target.value)}
              placeholder="₹"
            />
          </div>
          <div className="filter-group">
            <label>Max Amount</label>
            <input
              type="number"
              value={maxAmount}
              onChange={(e) => setMaxAmount(e.target.value)}
              placeholder="₹"
            />
          </div>
          <div className="filter-group">
            <label>Validity</label>
            <input
              type="text"
              value={validity}
              onChange={(e) => setValidity(e.target.value)}
              placeholder="e.g., 28 days"
            />
          </div>
          <div className="filter-group">
            <label>Data</label>
            <input
              type="text"
              value={data}
              onChange={(e) => setData(e.target.value)}
              placeholder="e.g., 2GB/day"
            />
          </div>
          <div className="filter-group">
            <label>Operator</label>
            <input
              type="text"
              value={operator}
              onChange={(e) => setOperator(e.target.value)}
              placeholder="e.g., Airtel"
            />
          </div>
        </div>
      )}

      {results.length > 0 && (
        <div className="search-results">
          <h3>Found {results.length} plans</h3>
          <div className="plans-grid">
            {results.map((plan, idx) => (
              <div key={idx} className="plan-card">
                <div className="plan-header">
                  <h4>{plan.operatorName}</h4>
                  <div className="plan-amount">₹{plan.amount}</div>
                </div>
                <div className="plan-details">
                  <p>{plan.description}</p>
                  {plan.validity && <div>Validity: {plan.validity}</div>}
                  {plan.data && <div>Data: {plan.data}</div>}
                </div>
                <button
                  onClick={() => handleSelectPlan(plan)}
                  className="btn-select-plan"
                >
                  Select Plan
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PlanSearch;

