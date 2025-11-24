import React from 'react';
import { renderWithProviders, screen, waitFor } from '../../test-utils/test-utils';
import OperatorsList from '../OperatorsList';
import axios from 'axios';
import { vi } from 'vitest';

beforeEach(() => {
  axios.get.mockResolvedValue({ data: { data: [{ _id: 'op1', name: 'Airtel', circle: 'All India' }] } });
});

describe('OperatorsList', () => {
  it('renders operator items when fetched', async () => {
    renderWithProviders(<OperatorsList />);

    // wait for the async fetch and render; assert operator appears
    await waitFor(() => expect(screen.getByText(/Airtel/i)).toBeInTheDocument());
  });
});
