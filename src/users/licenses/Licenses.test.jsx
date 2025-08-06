import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { camelCaseObject } from '@edx/frontend-platform';
import Licenses from './Licenses';
import licensesData from '../data/test/licenses';
import * as api from '../data/api';

describe('Single Sign On Records', () => {
  const props = {
    userEmail: 'user@example.com',
  };

  beforeEach(() => {
    jest.spyOn(api, 'getLicense').mockImplementation(() => (
      Promise.resolve(camelCaseObject(licensesData))
    ));
  });

  it('Licenses props', () => {
    render(<Licenses {...props} />);
    expect(props.userEmail).toEqual('user@example.com');
  });

  it('Licenses Data', async () => {
    const { container } = render(<Licenses {...props} />);

    await waitFor(() => {
      const title = screen.getByRole('heading', {
        level: 3,
        name: /Licenses Subscription/i,
      });
      expect(title).toBeInTheDocument();

      const cards = container.querySelectorAll('.pgn__card');
      expect(cards.length).toBe(licensesData.results.length);
    });
  });

  it('No Licenses Data', async () => {
    jest.spyOn(api, 'getLicense').mockImplementationOnce(() => (
      Promise.resolve({
        ...licensesData,
        results: [],
        status: 'No records found.',
      })
    ));

    const { container } = render(<Licenses {...props} />);

    await waitFor(() => {
      const title = screen.getByRole('heading', {
        level: 3,
        name: /Licenses Subscription/i,
      });
      expect(title).toBeInTheDocument();

      const noCards = container.querySelectorAll('.pgn__card');
      expect(noCards.length).toBe(0);

      const noRecordMessage = screen.getByText(/No records found./i);
      expect(noRecordMessage).toBeInTheDocument();
    });
  });
});
