import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { camelCaseObject } from '@edx/frontend-platform';
import Licenses from './Licenses';
import licensesData from '../data/test/licenses';
import * as api from '../data/api';
import '@testing-library/jest-dom';

describe('Single Sign On Records', () => {
  const props = {
    userEmail: 'user@example.com',
  };

  it('Licenses props', () => {
    const getLicenseMock = jest.spyOn(api, 'getLicense').mockImplementationOnce(() => Promise.resolve(camelCaseObject(licensesData)));
    render(<Licenses {...props} />);
    expect(getLicenseMock).toBeCalledWith(props.userEmail);
  });

  it('Licenses Data', async () => {
    jest.spyOn(api, 'getLicense').mockImplementationOnce(() => Promise.resolve(camelCaseObject(licensesData)));
    const { container } = render(<Licenses {...props} />);
    const cardList = await screen.findAllByTestId('license-card');
    await waitFor(() => {
      expect(cardList).toHaveLength(licensesData.results.length);
      expect(container.querySelector('h3#licenses-title-header').textContent).toEqual('Licenses Subscription');
    });
  });

  it('No Licenses Data', async () => {
    jest.spyOn(api, 'getLicense').mockImplementationOnce(() => Promise.resolve({ ...licensesData, results: [], status: 'No records found.' }));
    const { container } = render(<Licenses {...props} />);

    expect(container.querySelector('h3#licenses-title-header').textContent).toEqual('Licenses Subscription');
    const cardList = await screen.queryByTestId('license-card');
    expect(cardList).not.toBeInTheDocument();

    await waitFor(() => {
      const noRecordMessage = container.querySelector('p');
      expect(noRecordMessage.textContent).toEqual('No records found.');
    });
  });
});
