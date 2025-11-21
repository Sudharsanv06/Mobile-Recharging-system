import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

export default function OperatorDetails() {
  const { id } = useParams();
  const [operator, setOperator] = useState(null);
  const [filterType, setFilterType] = useState('prepaid');
  useEffect(() => {
    axios.get(`/api/v1/operators/${id}`).then(r => setOperator(r.data?.data || r.data)).catch(() => setOperator(null));
  }, [id]);

  if (!operator) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-2">{operator.name}</h2>

      {/* Dropdowns above Recommended */}
      <div className="mb-4">
        <label className="block mb-1">Plan type</label>
        <select
          aria-label="plan-type"
          value={filterType}
          onChange={e => setFilterType(e.target.value)}
          className="p-2 border rounded text-black"
        >
          <option value="prepaid">Prepaid</option>
          <option value="postpaid">Postpaid</option>
          <option value="wifi">WiFi</option>
        </select>
      </div>

      {/* Recommended section */}
      <div className="mb-4">
        <h3 className="font-semibold">Recommended</h3>
        <div className="grid grid-cols-1 gap-2">
          {(operator.plans || []).slice(0, 3).map(p => (
            <div key={p.planId} className="p-3 border rounded">
              <div className="flex justify-between">
                <div>{p.description}</div>
                <div>₹{p.amount}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* All plans filtered */}
      <div>
        <h3 className="font-semibold">All Plans</h3>
        <div className="grid grid-cols-1 gap-2">
          {(operator.plans || []).map(p => (
            <div key={p.planId} className="p-3 border rounded flex justify-between">
              <div>
                <div className="font-medium">{p.description}</div>
                <div className="text-sm">{p.validity}</div>
              </div>
              <div>₹{p.amount}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
