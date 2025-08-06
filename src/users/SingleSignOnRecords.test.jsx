import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import SingleSignOnRecords from './SingleSignOnRecords';
import UserMessagesProvider from '../userMessages/UserMessagesProvider';
import ssoRecordsData from './data/test/ssoRecords';
import * as api from './data/api';

const SingleSignOnRecordsWrapper = (props) => (
  <IntlProvider locale="en">
    <UserMessagesProvider>
      <SingleSignOnRecords {...props} />
    </UserMessagesProvider>
  </IntlProvider>
);

describe('Single Sign On Records', () => {
  const ssoRecords = ssoRecordsData.map((entry) => ({
    ...entry,
    extraData: JSON.parse(entry.extraData),
  }));

  const props = {
    username: 'edX',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('SSO props', () => {
    render(<SingleSignOnRecordsWrapper {...props} />);
    expect(props.username).toEqual('edX');
  });

  it('SSO Data', async () => {
    jest.spyOn(api, 'getSsoRecords').mockResolvedValueOnce(ssoRecords);

    const { container } = render(<SingleSignOnRecordsWrapper {...props} />);

    expect(
      await screen.findByRole('heading', { name: /single sign-on records/i }),
    ).toBeInTheDocument();

    const cards = container.querySelectorAll('.card');
    expect(cards).toHaveLength(ssoRecords.length);
  });

  it('No SSO Data', async () => {
    jest.spyOn(api, 'getSsoRecords').mockResolvedValueOnce([]);

    render(<SingleSignOnRecordsWrapper {...props} />);

    expect(
      screen.getByRole('heading', { name: /single sign-on records/i }),
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(
        screen.getByText(/no sso records were found\./i),
      ).toBeInTheDocument();
    });
  });

  it('Error fetching sso data', async () => {
    // Mock the API returning an error object (not throwing)
    const ssoErrors = {
      errors: [
        {
          code: null,
          dismissible: true,
          text: 'Test Error',
          type: 'danger',
          topic: 'ssoRecords',
        },
      ],
    };

    jest.spyOn(api, 'getSsoRecords').mockResolvedValueOnce(ssoErrors);

    render(<SingleSignOnRecordsWrapper {...props} />);

    await waitFor(() => {
      expect(screen.getByText(/test error/i)).toBeInTheDocument();
    });
  });
});
