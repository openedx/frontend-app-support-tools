import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import ProgramEnrollmentsIndexPage from './ProgramEnrollmentsIndexPage';
import UserMessagesProvider from '../userMessages/UserMessagesProvider';
import samlProvidersResponseValues from './ProgramInspector/data/test/samlProviders';
import * as samlApi from './ProgramInspector/data/api';

const renderWithProviders = (location) => {
  return render(
    <MemoryRouter initialEntries={[location.pathname + location.search]}>
      <UserMessagesProvider>
        <ProgramEnrollmentsIndexPage location={location} />
      </UserMessagesProvider>
    </MemoryRouter>
  );
};

describe('Program Enrollments Index Page', () => {
  let location;
  let samlMock;

  beforeEach(() => {
    location = { pathname: '/programs', search: '' };
    samlMock = jest
      .spyOn(samlApi, 'getSAMLProviderList')
      .mockImplementation(() => Promise.resolve(samlProvidersResponseValues));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', async () => {
    renderWithProviders(location);

    expect(await screen.findByText('Program Inspector')).toBeInTheDocument();
    expect(screen.getByText('Link Program Enrollments')).toBeInTheDocument();
  });

  it('Link Program Enrollments Tab', async () => {
    renderWithProviders(location);

    const tabs = screen.getAllByRole('tab');
    fireEvent.click(tabs[0]);

    await waitFor(() => {
      expect(tabs[0].className).toMatch(/active/);
      expect(tabs[1].className).not.toMatch(/active/);
    });

    expect(screen.getByRole('heading', { level: 3, name: /Link Program Enrollments/i })).toBeInTheDocument();
  });

  it('Program Inspector Tab', async () => {
    renderWithProviders(location);

    const tabs = screen.getAllByRole('tab');
    fireEvent.click(tabs[1]);

    await waitFor(() => {
      expect(tabs[1].className).toMatch(/active/);
      expect(tabs[0].className).not.toMatch(/active/);
    });

    expect(screen.getByRole('heading', { level: 3, name: /Program Enrollments Inspector/i })).toBeInTheDocument();
  });

  it('page renders without query', async () => {
    renderWithProviders(location);

    const tabs = screen.getAllByRole('tab');
    expect(tabs[0].className).toMatch(/active/);
    expect(tabs[1].className).not.toMatch(/active/);
  });

  it('page renders with query', async () => {
    location.search = '?edx_user=&org_key=testX&external_user_key=';
    renderWithProviders(location);

    const tabs = screen.getAllByRole('tab');
    expect(tabs[0].className).toMatch(/active/);
    expect(tabs[1].className).not.toMatch(/active/);
  });
});
