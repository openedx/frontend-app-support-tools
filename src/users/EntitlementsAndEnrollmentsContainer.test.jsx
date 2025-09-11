import React from 'react';
import {
  render,
  screen,
  fireEvent,
  waitFor,
} from '@testing-library/react';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import UserMessagesProvider from '../userMessages/UserMessagesProvider';
import EntitlementsAndEnrollmentsContainer from './EntitlementsAndEnrollmentsContainer';
import * as api from './data/api';
import { enrollmentsData } from './data/test/enrollments';
import { entitlementsData } from './data/test/entitlements';

const Wrapper = (props) => (
  <IntlProvider locale="en">
    <UserMessagesProvider>
      <EntitlementsAndEnrollmentsContainer {...props} />
    </UserMessagesProvider>
  </IntlProvider>
);

describe('Entitlements and Enrollments component', () => {
  const props = { user: 'edx' };

  beforeEach(() => {
    jest.spyOn(api, 'getEntitlements').mockResolvedValue(entitlementsData);
    jest.spyOn(api, 'getEnrollments').mockResolvedValue(enrollmentsData);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', async () => {
    render(<Wrapper {...props} />);

    await waitFor(() => {
      expect(screen.getByText(/Entitlements \(2\)/)).toBeInTheDocument();
      expect(screen.getByText(/Enrollments \(2\)/)).toBeInTheDocument();
    });
  });

  it('filters entitlements and enrollments based on search key', async () => {
    render(<Wrapper {...props} />);

    const input = screen.getByPlaceholderText(/Course ID or Name/i);
    fireEvent.change(input, { target: { value: 'course-v1' } });

    await waitFor(() => {
      expect(screen.getByText(/Entitlements \(1\)/)).toBeInTheDocument();
      expect(screen.getByText(/Enrollments \(2\)/)).toBeInTheDocument();
    });
  });
});
