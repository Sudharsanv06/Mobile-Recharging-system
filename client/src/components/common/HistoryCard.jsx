import React from 'react';

const HistoryCard = ({ item }) => {
  const date = item.date || item.createdAt || item.rechargedAt || item.timestamp;
  const d = date ? new Date(date) : null;
  
  // Handle operator - can be object or string
  const operatorName = (item.operator && typeof item.operator === 'object') 
    ? item.operator.name 
    : (item.operator || item.operatorName || 'Unknown');
  
  return (
    <div className="history-card">
      <div className="history-left">
        <div className="operator">{operatorName}</div>
        <div className="mobile">{item.mobile || item.phone || item.to || item.mobileNumber || ''}</div>
      </div>
      <div className="history-mid">
        <div className="amount">₹{item.amount}</div>
        <div className={`status ${item.status?.toLowerCase() || 'success'}`}>{item.status || 'Success'}</div>
      </div>
      <div className="history-right">{d ? d.toLocaleString() : '—'}</div>
    </div>
  );
};

export default HistoryCard;
