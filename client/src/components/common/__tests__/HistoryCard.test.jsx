import React from 'react';
import { renderWithProviders, screen } from '../../../test-utils/test-utils';
import HistoryCard from '../HistoryCard';

describe('HistoryCard', () => {
  it('renders operator, mobile and amount', () => {
    const item = { operator: 'Airtel', mobile: '9876543210', amount: 199, createdAt: '2025-11-01T10:00:00.000Z', status: 'Success' };
    renderWithProviders(<HistoryCard item={item} />);
    expect(screen.getByText(/Airtel/i)).toBeInTheDocument();
    expect(screen.getByText(/9876543210/)).toBeInTheDocument();
    expect(screen.getByText(/₹199/)).toBeInTheDocument();
    expect(screen.getByText(/Success/)).toBeInTheDocument();
  });
});
