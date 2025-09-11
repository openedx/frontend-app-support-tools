import React from 'react';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from '@testing-library/react';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import Entitlements from './Entitlements';
import {
  entitlementsData,
  entitlementsErrors,
} from '../data/test/entitlements';
import CourseSummaryData from '../data/test/courseSummary';
import UserMessagesProvider from '../../userMessages/UserMessagesProvider';
import * as api from '../data/api';

const EntitlementsPageWrapper = (props) => (
  <IntlProvider locale="en">
    <UserMessagesProvider>
      <Entitlements {...props} />
    </UserMessagesProvider>
  </IntlProvider>
);

jest.mock('@edx/frontend-platform', () => ({
  ...jest.requireActual('@edx/frontend-platform'),
  getConfig: jest.fn(() => ({
    ECOMMERCE_BASE_URL: 'http://example.com',
  })),
}));

describe('Entitlements Listing', () => {
  const props = {
    user: 'edX',
    changeHandler: jest.fn(),
  };

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('Create New Entitlement button rendered by default', async () => {
    jest.spyOn(api, 'getEntitlements').mockResolvedValueOnce({ results: [] });

    render(<EntitlementsPageWrapper {...props} />);

    const entitlementButton = await screen.findByRole('button', { name: /create new entitlement/i });
    expect(entitlementButton).toBeEnabled();

    fireEvent.click(entitlementButton);

    const modal = await screen.findByRole('dialog');
    expect(modal).toBeInTheDocument();

    expect(
      within(modal).getByRole('heading', { name: /create new entitlement/i }),
    ).toBeInTheDocument();

    const closeButtons = within(modal).getAllByRole('button', { name: /^Close$/i });
    fireEvent.click(closeButtons[closeButtons.length - 1]);

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('entitlements data', async () => {
    jest.spyOn(api, 'getEntitlements').mockResolvedValueOnce(entitlementsData);
    render(<EntitlementsPageWrapper {...props} />);
    expect(await screen.findByText(/Entitlements \(2\)/)).toBeInTheDocument();
  });

  it('No entitlements data', async () => {
    jest.spyOn(api, 'getEntitlements').mockResolvedValueOnce({ results: [] });
    render(<EntitlementsPageWrapper {...props} />);
    expect(await screen.findByText(/Entitlements \(0\)/)).toBeInTheDocument();
  });

  it('Error fetching entitlements', async () => {
    jest.spyOn(api, 'getEntitlements').mockResolvedValueOnce(entitlementsErrors);
    render(<EntitlementsPageWrapper {...props} />);
    expect(await screen.findByText(entitlementsErrors.errors[0].text)).toBeInTheDocument();
  });

  it('Support Details expand/collapse', async () => {
    jest.spyOn(api, 'getEntitlements').mockResolvedValueOnce(entitlementsData);
    render(<EntitlementsPageWrapper {...props} />);

    const expandToggles = await screen.findAllByTitle(/toggle row expanded/i);

    fireEvent.click(expandToggles[0]);
    expect(expandToggles[0].querySelector('.fa-minus')).toBeInTheDocument();

    fireEvent.click(expandToggles[0]);
    expect(expandToggles[0].querySelector('.fa-plus')).toBeInTheDocument();
  });

  it('Expand All and Collapse All', async () => {
    jest.spyOn(api, 'getEntitlements').mockResolvedValueOnce(entitlementsData);
    render(<EntitlementsPageWrapper {...props} />);

    const expandAll = await screen.findByText(/expand all/i);
    fireEvent.click(expandAll);

    const collapseAll = await screen.findByText(/collapse all/i);
    expect(collapseAll).toBeInTheDocument();

    fireEvent.click(collapseAll);
    expect(await screen.findByText(/expand all/i)).toBeInTheDocument();
  });

  it('Filter entitlements with searchStr', async () => {
    jest.spyOn(api, 'getEntitlements').mockResolvedValueOnce(entitlementsData);
    render(<EntitlementsPageWrapper searchStr="course-1" {...props} />);
    expect(await screen.findByText(/Entitlements \(1\)/)).toBeInTheDocument();
  });

  it('Renders correct href for Order Number', async () => {
    jest.spyOn(api, 'getEntitlements').mockResolvedValueOnce(entitlementsData);
    render(<EntitlementsPageWrapper {...props} />);
    expect(await screen.findByRole('link', { name: /123edX456789/ })).toHaveAttribute(
      'href',
      expect.stringContaining('http://example.com/dashboard/orders/123edX456789'),
    );
  });

  it('Expire entitlement button enabled/disabled states', async () => {
    jest.spyOn(api, 'getEntitlements').mockResolvedValueOnce(entitlementsData);
    render(<EntitlementsPageWrapper {...props} />);

    const actionButtons = await screen.findAllByRole('button', { name: /actions/i });

    fireEvent.click(actionButtons[0]);
    const firstRow = actionButtons[0].closest('tr');
    const firstExpire = within(firstRow).getByRole('button', { name: /expire/i });
    expect(firstExpire).toHaveAttribute('aria-disabled', 'true');

    fireEvent.click(actionButtons[1]);
    const secondRow = actionButtons[1].closest('tr');
    const secondExpire = within(secondRow).getByRole('button', { name: /expire/i });
    expect(secondExpire).not.toHaveAttribute('aria-disabled', 'true');

    fireEvent.click(secondExpire);
    expect(await screen.findByText(/Expire Entitlement/i)).toBeInTheDocument();
  });

  it('Reissue entitlement button enabled/disabled states', async () => {
    jest.spyOn(api, 'getEntitlements').mockResolvedValueOnce(entitlementsData);
    render(<EntitlementsPageWrapper {...props} />);

    const actionButtons = await screen.findAllByRole('button', { name: /actions/i });
    fireEvent.click(actionButtons[0]);

    const reissueButton = await screen.findByRole('button', { name: /reissue/i });
    expect(reissueButton).toBeEnabled();

    fireEvent.click(reissueButton);
    expect(await screen.findByText(/Reissue Entitlement/i)).toBeInTheDocument();

    fireEvent.click(actionButtons[1]);
    expect(screen.queryByRole('button', { name: /reissue/i })).not.toBeInTheDocument();
  });

  it('Successful course summary fetch', async () => {
    jest.spyOn(api, 'getEntitlements').mockResolvedValueOnce(entitlementsData);
    jest.spyOn(api, 'getCourseData').mockResolvedValueOnce(CourseSummaryData.courseData);

    render(<EntitlementsPageWrapper {...props} />);

    const row = await screen.findByText(/course-uuid/i);
    const rowEl = row.closest('tr');
    const detailsLink = within(rowEl).getByText(/See Details/i);
    fireEvent.click(detailsLink);

    expect(await screen.findByText(new RegExp(CourseSummaryData.courseData.uuid, 'i'))).toBeInTheDocument();
  });

  it('Unsuccessful course summary fetch', async () => {
    jest.spyOn(api, 'getEntitlements').mockResolvedValueOnce(entitlementsData);
    jest.spyOn(api, 'getCourseData').mockRejectedValueOnce(new Error('Not Found'));

    render(<EntitlementsPageWrapper {...props} />);

    const row = await screen.findByText(/course-1-uuid/i);
    const rowEl = row.closest('tr');
    const detailsLink = within(rowEl).getByText(/See Details/i);

    expect(detailsLink).toBeInTheDocument();
  });
});
