import React from 'react';
import {
  fireEvent, render, screen, waitFor,
} from '@testing-library/react';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import UserMessagesProvider from '../userMessages/UserMessagesProvider';
import EntitlementsAndEnrollmentsContainer from './EntitlementsAndEnrollmentsContainer';
import * as api from './data/api';
import { enrollmentsData } from './data/test/enrollments';
import { entitlementsData } from './data/test/entitlements';

const EntitlementsAndEnrollmentsContainerWrapper = (props) => (
  <IntlProvider locale="en">
    <UserMessagesProvider>
      <EntitlementsAndEnrollmentsContainer {...props} />
    </UserMessagesProvider>
  </IntlProvider>
);

describe('Entitlements and Enrollments component', () => {
  let unmountWrapper;
  const props = {
    user: 'edx',
  };

  beforeEach(async () => {
    jest.spyOn(api, 'getEntitlements').mockImplementationOnce(() => Promise.resolve(entitlementsData));
    jest.spyOn(api, 'getEnrollments').mockImplementationOnce(() => Promise.resolve(enrollmentsData));
    const { unmount } = render(<EntitlementsAndEnrollmentsContainerWrapper {...props} />);
    unmountWrapper = unmount;
  });

  afterEach(() => {
    unmountWrapper();
  });

  it('renders correctly', async () => {
    await waitFor(() => {
      const enrollmentsEntitlements = screen.getByTestId('entitlementsAndEnrollmentsContainer');
      expect(enrollmentsEntitlements.textContent).toContain('Entitlements (2)');
      expect(enrollmentsEntitlements.textContent).toContain('Enrollments (2)');
    });
  });

  it('filter entitlements and enrollments on the basis of search key', async () => {
    const courseIdInput = await screen.findByTestId('courseIdInput');
    fireEvent.change(courseIdInput, { target: { value: 'course-v1' } });
    const enrollmentsEntitlements = await screen.findByTestId('entitlementsAndEnrollmentsContainer');
    expect(enrollmentsEntitlements.textContent).toContain('Entitlements (1)');
    expect(enrollmentsEntitlements.textContent).toContain('Enrollments (2)');
  });
});
