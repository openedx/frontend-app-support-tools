import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import VerifiedName from './VerifiedName';
import verifiedNameHistory from './data/test/verifiedNameHistory';

import * as api from './data/api';

const VerifiedNameWrapper = (props) => (
  <IntlProvider locale="en">
    <VerifiedName {...props} />
  </IntlProvider>
);

describe('Verified Name', () => {
  const props = {
    username: 'edX',
  };

  it('displays error when failing to fetch the data', async () => {
    jest.spyOn(api, 'getVerifiedNameHistory').mockImplementationOnce(
      () => Promise.resolve(new Error()),
    );
    render(<VerifiedNameWrapper {...props} />);

    await screen.findByText(/error while fetching data/i);
  });

  it('displays history when prompted', async () => {
    const verifiedNameData = {
      verifiedName: 'Jonathan Doe',
      status: 'approved',
      verificationType: 'Proctoring',
      history: verifiedNameHistory.results,
    };

    jest.spyOn(api, 'getVerifiedNameHistory').mockResolvedValueOnce(verifiedNameData);
    render(<VerifiedNameWrapper {...props} />);

    const historyButton = await screen.findByText('Show');

    await act(async () => {
      fireEvent.click(historyButton);
    });

    // Profile name and denied verified name are visible in history modal
    const profileName = await screen.findAllByText(/jon doe/i);
    expect(profileName.length).toEqual(3);
    await screen.findByText(/j doe/i);
  });

  it('displays hover popup to show ID Verification details', async () => {
    const verifiedNameData = {
      verifiedName: 'Jonathan Doe',
      status: 'approved',
      verificationType: 'Proctoring',
      history: verifiedNameHistory.results,
    };
    jest.spyOn(api, 'getVerifiedNameHistory').mockResolvedValueOnce(verifiedNameData);
    await act(async () => {
      render(<VerifiedNameWrapper {...props} />);
    });

    const historyButton = await screen.findByText('Show');
    await act(async () => {
      fireEvent.click(historyButton);
    });

    const hoverLink = await screen.getByText(verifiedNameHistory.results[1].verification_attempt_id);
    await act(async () => {
      fireEvent.mouseOver(hoverLink);
    });

    await screen.getByTestId('verificationAttemptTooltipTitle');

    expect(screen.getByText('must_retry')).toBeTruthy();
  });

  it('displays hover popup to show Platform Verification Attempt details', async () => {
    const verifiedNameData = {
      verifiedName: 'Jonathan Doe',
      status: 'approved',
      verificationType: 'Proctoring',
      history: verifiedNameHistory.results,
    };
    jest.spyOn(api, 'getVerifiedNameHistory').mockResolvedValueOnce(verifiedNameData);
    await act(async () => {
      render(<VerifiedNameWrapper {...props} />);
    });

    const historyButton = await screen.findByText('Show');
    await act(async () => {
      fireEvent.click(historyButton);
    });

    const hoverLink = await screen.getByText(verifiedNameHistory.results[2].platform_verification_attempt_id);
    await act(async () => {
      fireEvent.mouseOver(hoverLink);
    });

    await screen.getByTestId('platformVerificationAttemptTooltipTitle');

    expect(screen.getByText('pending')).toBeTruthy();
  });
});
