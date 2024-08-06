/* eslint-disable react/prop-types */
import {
  screen,
  render,
  waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

import { getConfig } from '@edx/frontend-platform';
import { IntlProvider } from '@edx/frontend-platform/i18n';

import {
  ApiCheck,
  CustomerDetailLink,
  LmsCheck,
  SSOCheck,
} from '../CustomerDetails';

jest.mock('@edx/frontend-platform', () => ({
  getConfig: jest.fn(),
}));

Object.assign(navigator, {
  clipboard: {
    writeText: () => {},
  },
});

describe('CustomerDetails', () => {
  const row = {
    original: {
      uuid: '123456789',
      slug: 'ash-ketchum',
      name: 'Ash Ketchum',
      activeIntegrations: [{
        channelCode: 'test-channel',
        created: 'jan 1, 1992',
        modified: 'jan 2, 1992',
        displayName: 'test channel',
        active: true,
      }],
      activeSsoConfigurations: [{
        created: 'jan 1, 1992',
        modified: 'jan 2, 1992',
        displayName: 'test channel',
        active: true,
      }],
      enableGenerationOfApiCredentials: true,
    },
  };

  it('renders LmsCheck when there are active integrations', () => {
    render(<LmsCheck row={row} />);
    expect(screen.getByText('Lms Check')).toBeInTheDocument();
  });

  it('does not render LmsCheck when there are no active integrations', () => {
    const noActiveIntegration = {
      original: {
        ...row.original,
        activeIntegrations: [],
      },
    };
    render(<LmsCheck row={noActiveIntegration} />);
    expect(screen.queryByText('Lms Check')).not.toBeInTheDocument();
  });

  it('renders SSOCheck when there are active integrations', () => {
    render(<SSOCheck row={row} />);
    expect(screen.getByText('SSO Check')).toBeInTheDocument();
  });

  it('does not render SSOCheck when there are no active integrations', () => {
    const noActiveIntegration = {
      original: {
        ...row.original,
        activeSsoConfigurations: [],
      },
    };
    render(<SSOCheck row={noActiveIntegration} />);
    expect(screen.queryByText('SSO Check')).not.toBeInTheDocument();
  });

  it('renders ApiCheck when there are active integrations', () => {
    render(<ApiCheck row={row} />);
    expect(screen.getByText('API Check')).toBeInTheDocument();
  });

  it('does not render ApiCheck when there are no active integrations', () => {
    const noActiveIntegration = {
      original: {
        ...row.original,
        enableGenerationOfApiCredentials: false,
      },
    };
    render(<ApiCheck row={noActiveIntegration} />);
    expect(screen.queryByText('API Check')).not.toBeInTheDocument();
  });

  it('renders CustomerDetailLink', async () => {
    getConfig.mockImplementation(() => ({
      ADMIN_PORTAL_BASE_URL: 'http://www.testportal.com',
    }));
    render(
      <IntlProvider locale="en">
        <CustomerDetailLink row={row} />
      </IntlProvider>,
    );
    expect(screen.getByRole('link', { name: 'Ash Ketchum' })).toHaveAttribute('href', '/enterprise-configuration/customers/123456789/view');
    expect(screen.getByRole('link', { name: '/ash-ketchum/ in a new tab' })).toHaveAttribute('href', 'http://www.testportal.com/ash-ketchum/admin/learners');
    expect(screen.getByText('123456789')).toBeInTheDocument();
    const copy = screen.getByTestId('copy');
    userEvent.click(copy);
    await waitFor(() => expect(screen.getByText('Copied to clipboard')).toBeInTheDocument());
  });
});
