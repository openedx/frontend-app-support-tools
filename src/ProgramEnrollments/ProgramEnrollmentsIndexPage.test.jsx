import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
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
  let wrapper;
  let location;
  let samlMock;

  beforeEach(() => {
    location = { pathname: '/programs', search: '' };
    samlMock = jest
      .spyOn(samlApi, 'getSAMLProviderList')
      .mockImplementationOnce(() => Promise.resolve(samlProvidersResponseValues));
  });

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount();
    }
    if (samlMock) {
      samlMock.mockReset();
    }
  });

  it('renders correctly', async () => {
    const { unmount } = render(<ProgramEnrollmentsIndexPageWrapper location={location} />);
    const tabs = document.querySelectorAll('nav.pgn__tabs.nav-tabs a');

    expect(tabs[0].textContent).toEqual('Program Inspector');
    expect(tabs[1].textContent).toEqual('Link Program Enrollments');
    unmount();
  });

  it('Link Program Enrollments Tab', async () => {
    const { unmount } = render(<ProgramEnrollmentsIndexPageWrapper location={location} />);

    let tabs = document.querySelectorAll('nav.nav-tabs a');

    fireEvent.click(tabs[0]);
    tabs = document.querySelectorAll('nav.nav-tabs a');
    expect(tabs[0].outerHTML).toEqual(expect.stringContaining('active'));
    expect(tabs[1].outerHTML).not.toEqual(expect.stringContaining('active'));
    expect(document.querySelectorAll('h3')[1].textContent).toEqual(
      'Link Program Enrollments',
    );
    unmount();
  });

  it('Program Inspector Tab', async () => {
    const { unmount } = render(<ProgramEnrollmentsIndexPageWrapper location={location} />);

    let tabs = document.querySelectorAll('nav.nav-tabs a');

    fireEvent.click(tabs[1]);
    tabs = document.querySelectorAll('nav.nav-tabs a');
    expect(tabs[0].outerHTML).not.toEqual(expect.stringContaining('active'));
    expect(tabs[1].outerHTML).toEqual(expect.stringContaining('active'));
    expect(document.querySelectorAll('h3')[0].textContent).toEqual(
      'Program Enrollments Inspector',
    );
    unmount();
  });

  it('page renders without query', async () => {
    const { unmount } = render(<ProgramEnrollmentsIndexPageWrapper location={location} />);
    const tabs = document.querySelectorAll('nav.nav-tabs a');

    expect(tabs[0].outerHTML).toEqual(expect.stringContaining('active'));
    expect(tabs[1].outerHTML).not.toEqual(expect.stringContaining('active'));
    unmount();
  });

  it('page renders with query', async () => {
    location.search = '?edx_user=&org_key=testX&external_user_key=';
    const { unmount } = render(<ProgramEnrollmentsIndexPageWrapper location={location} />);
    const tabs = document.querySelectorAll('nav.nav-tabs a');

    expect(tabs[0].outerHTML).toEqual(expect.stringContaining('active'));
    expect(tabs[1].outerHTML).not.toEqual(expect.stringContaining('active'));
    unmount();
  });
});
