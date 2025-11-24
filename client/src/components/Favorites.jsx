import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { toast } from '../utils/toast';
import { useNavigate } from 'react-router-dom';
import './Favorites.css';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const res = await api.get('/api/v1/favorites');
      setFavorites(res.data.data || []);
    } catch (error) {
      toast.error('Failed to load favorites');
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (operatorId, planId) => {
    try {
      await api.delete('/api/v1/favorites', {
        data: { operatorId, planId },
      });
      toast.success('Removed from favorites');
      loadFavorites();
    } catch (error) {
      toast.error('Failed to remove favorite');
    }
  };

  const handleQuickRecharge = (favorite) => {
    navigate('/payment', {
      state: {
        operatorId: favorite.operatorId?._id || favorite.operatorId,
        operator: favorite.operatorId?.name || 'Operator',
        amount: favorite.plan.amount,
        validity: favorite.plan.validity,
        data: favorite.plan.data,
        description: favorite.plan.description,
        planId: favorite.planId,
      },
    });
  };

  if (loading) {
    return <div className="favorites-loading">Loading favorites...</div>;
  }

  return (
    <div className="favorites-page">
      <h2>Favorite Plans</h2>
      {favorites.length === 0 ? (
        <div className="no-favorites">
          <p>You haven't added any plans to favorites yet.</p>
          <p>Browse plans and click the heart icon to add them to favorites!</p>
        </div>
      ) : (
        <div className="favorites-grid">
          {favorites.map((favorite, idx) => (
            <div key={idx} className="favorite-card">
              <div className="favorite-header">
                <h3>{favorite.operatorId?.name || 'Operator'}</h3>
                <button
                  onClick={() =>
                    removeFavorite(
                      favorite.operatorId?._id || favorite.operatorId,
                      favorite.planId
                    )
                  }
                  className="btn-remove"
                >
                  ❌
                </button>
              </div>
              <div className="favorite-amount">₹{favorite.plan.amount}</div>
              <div className="favorite-details">
                <p>{favorite.plan.description}</p>
                {favorite.plan.validity && (
                  <div>Validity: {favorite.plan.validity}</div>
                )}
                {favorite.plan.data && <div>Data: {favorite.plan.data}</div>}
              </div>
              <button
                onClick={() => handleQuickRecharge(favorite)}
                className="btn-quick-recharge"
              >
                Quick Recharge
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;

