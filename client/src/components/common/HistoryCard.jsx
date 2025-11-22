import React from 'react';

const HistoryCard = ({ item }) => {
  const date = item.date || item.createdAt || item.rechargedAt || item.timestamp;
  const d = date ? new Date(date) : null;
  return (
    <div className="history-card">
      <div className="history-left">
        <div className="operator">{item.operator || item.operatorName || 'Unknown'}</div>
        <div className="mobile">{item.mobile || item.phone || item.to || ''}</div>
      </div>
      <div className="history-mid">
        <div className="amount">₹{item.amount}</div>
        <div className="status {item.status}">{item.status || 'Success'}</div>
      </div>
      <div className="history-right">{d ? d.toLocaleString() : '—'}</div>
    </div>
  );
};

export default HistoryCard;
