import React from 'react';
import { renderWithProviders, screen } from '../../../test-utils/test-utils';
import StatsCard from '../StatsCard';

describe('StatsCard', () => {
  it('renders title and value', () => {
    renderWithProviders(<StatsCard title="Total Recharges" value={5} />);
    expect(screen.getByText(/Total Recharges/i)).toBeInTheDocument();
    expect(screen.getByText(/5/)).toBeInTheDocument();
  });
});
