import React from 'react';
const LoadingSkeleton = ({ rows = 3, height = 16, circle = false, style = {} }) => {
  const items = Array.from({ length: rows });
  return (
    <div>
      {items.map((_, idx) => (
        <div
          key={idx}
          className={`skeleton ${circle ? 'skeleton-circle' : 'skeleton-rect'}`}
          style={{ height: circle ? (height) : height, marginBottom: 12, ...style }}
        />
      ))}
    </div>
  );
};

export default LoadingSkeleton;
