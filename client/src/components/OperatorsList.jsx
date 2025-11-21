import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function OperatorsList() {
  const [ops, setOps] = useState([]);
  useEffect(() => {
    axios.get('/api/v1/operators').then(r => setOps(r.data?.data || r.data || [])).catch(()=>setOps([]));
  }, []);
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Operators</h2>
      <div className="grid grid-cols-2 gap-4">
        {ops.map(op => (
          <Link to={`/operators/${op._id}`} key={op._id} className="p-4 border rounded">
            <div className="font-semibold">{op.name}</div>
            <div className="text-sm">{op.circle}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
