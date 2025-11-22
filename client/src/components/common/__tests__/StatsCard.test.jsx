import React from 'react';
import { render, screen } from '@testing-library/react';
import StatsCard from '../StatsCard';

describe('StatsCard', () => {
  it('renders title and value', () => {
    render(<StatsCard title="Total Recharges" value={5} />);
    expect(screen.getByText(/Total Recharges/i)).toBeInTheDocument();
    expect(screen.getByText(/5/)).toBeInTheDocument();
  });
});
