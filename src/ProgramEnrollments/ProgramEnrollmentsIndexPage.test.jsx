import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';

import ProgramEnrollmentsIndexPage from './ProgramEnrollmentsIndexPage';
import UserMessagesProvider from '../userMessages/UserMessagesProvider';
import samlProvidersResponseValues from './ProgramInspector/data/test/samlProviders';
import * as samlApi from './ProgramInspector/data/api';

const ProgramEnrollmentsIndexPageWrapper = (props) => (
  <MemoryRouter>
    <UserMessagesProvider>
      <ProgramEnrollmentsIndexPage {...props} />
    </UserMessagesProvider>
  </MemoryRouter>
);

describe('Program Enrollments Index Page', () => {
  let location;
  let samlMock;

  beforeEach(() => {
    location = {
      pathname: '/programs',
      search: '',
    };

    samlMock = jest
      .spyOn(samlApi, 'getSAMLProviderList')
      .mockImplementation(() => Promise.resolve(samlProvidersResponseValues));
  });

  afterEach(() => {
    samlMock.mockReset();
  });

  it('renders correctly', async () => {
    const testLocation = {
      pathname: '/programs',
      search: '',
    };

    render(
      <ProgramEnrollmentsIndexPageWrapper location={testLocation} />,
    );

    expect(await screen.findByText(/Program Inspector/i)).toBeInTheDocument();

    const tabs = await screen.findAllByText(/Link Program Enrollments/i);
    expect(tabs.length).toBeGreaterThan(0);
  });

  it('Link Program Enrollments Tab', async () => {
    const testLocation = {
      pathname: '/programs',
      search: '',
    };

    render(
      <ProgramEnrollmentsIndexPageWrapper location={testLocation} />,
    );

    const tabs = await screen.findAllByText(/Link Program Enrollments/i);
    expect(tabs.length).toBeGreaterThan(0);

    await userEvent.click(tabs[0]);

    await waitFor(() => {
      expect(tabs[0].classList.contains('active')).toBe(true);
      expect(tabs[1].classList.contains('active')).toBe(false);
      expect(
        screen.getByRole('heading', { level: 3, name: /Link Program Enrollments/i }),
      ).toBeInTheDocument();
    });
  });

  it('Program Inspector Tab', async () => {
    render(
      <ProgramEnrollmentsIndexPageWrapper location={location} />,
    );

    const tabElements = await screen.findAllByRole('tab');
    expect(tabElements.length).toBeGreaterThan(1);

    await userEvent.click(tabElements[1]);

    await waitFor(() => {
      expect(tabElements[0]).not.toHaveClass('active');
      expect(tabElements[1]).toHaveClass('active');

      const heading = screen.queryByText(/Program Enrollments Inspector/i);
      expect(heading).toBeInTheDocument();
    });
  });

  it('page renders without query', async () => {
    render(
      <ProgramEnrollmentsIndexPageWrapper location={location} />,
    );

    const tabElements = await screen.findAllByRole('tab');
    expect(tabElements.length).toBeGreaterThan(0);

    await waitFor(() => {
      expect(tabElements[0]).toHaveClass('active');
      expect(tabElements[1]).not.toHaveClass('active');
    });
  });

  it('page renders with query', async () => {
    location.search = '?edx_user=&org_key=testX&external_user_key=';

    render(
      <ProgramEnrollmentsIndexPageWrapper location={location} />,
    );

    const tabs = await screen.findAllByRole('tab');
    expect(tabs.length).toBeGreaterThan(0);

    await waitFor(() => {
      expect(tabs[0].className).toMatch('active');
      expect(tabs[1].className).not.toMatch('active');
    });
  });
});
