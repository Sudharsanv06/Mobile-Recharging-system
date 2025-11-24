import React, { useEffect, useState } from "react";
import api from "../utils/api";
import { Link } from "react-router-dom";
import "./OperatorsList.css";

export default function OperatorsList() {
  const [ops, setOps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const fetchOps = async () => {
      try {
        const res = await api.get('/api/v1/operators');
        if (mounted) {
          setOps(res.data?.data || []);
          setLoading(false);
        }
      } catch (err) {
        console.error('operators fetch error', err);
        if (mounted) {
          setLoading(false);
          setOps([]);
        }
      }
    };
    fetchOps();
    return () => { mounted = false; };
  }, []);

  if (loading) return <div className="operators-list-container">Loading operators</div>;
  if (!ops.length) return (
    <div className="operators-list-container">No operators found. <button onClick={() => window.location.reload()}>Retry</button></div>
  );

  return (
    <div className="operators-list-container">
      <div className="operators-grid">
        {ops.map((op) => {
          const routeId = op.slug || op._id;
          return (
            <Link key={routeId} to={`/operators/${routeId}`} className="operator-card">
              <div className="operator-name">{op.name}</div>
              <div className="operator-circle">{op.circle || 'All India'}</div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
