import { mount } from 'enzyme';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { waitForComponentToPaint } from '../setupTest';
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
    wrapper = mount(<ProgramEnrollmentsIndexPageWrapper location={location} />);
    await waitForComponentToPaint(wrapper);
    const tabs = wrapper.find('nav.pgn__tabs.nav-tabs a');

    expect(tabs.at(0).text()).toEqual('Program Inspector');
    expect(tabs.at(1).text()).toEqual('Link Program Enrollments');
  });

  it('Link Program Enrollments Tab', async () => {
    wrapper = mount(<ProgramEnrollmentsIndexPageWrapper location={location} />);
    await waitForComponentToPaint(wrapper);

    let tabs = wrapper.find('nav.nav-tabs a');

    tabs.at(0).simulate('click');
    tabs = wrapper.find('nav.nav-tabs a');
    expect(tabs.at(0).html()).toEqual(expect.stringContaining('active'));
    expect(tabs.at(1).html()).not.toEqual(expect.stringContaining('active'));
    expect(wrapper.find('h3').at(1).text()).toEqual(
      'Link Program Enrollments',
    );
  });

  it('Program Inspector Tab', async () => {
    wrapper = mount(<ProgramEnrollmentsIndexPageWrapper location={location} />);
    await waitForComponentToPaint(wrapper);

    let tabs = wrapper.find('nav.nav-tabs a');

    tabs.at(1).simulate('click');
    tabs = wrapper.find('nav.nav-tabs a');
    expect(tabs.at(0).html()).not.toEqual(expect.stringContaining('active'));
    expect(tabs.at(1).html()).toEqual(expect.stringContaining('active'));
    expect(wrapper.find('h3').at(0).text()).toEqual(
      'Program Enrollments Inspector',
    );
  });

  it('page renders without query', async () => {
    wrapper = mount(<ProgramEnrollmentsIndexPageWrapper location={location} />);
    await waitForComponentToPaint(wrapper);
    const tabs = wrapper.find('nav.nav-tabs a');

    expect(tabs.at(0).html()).toEqual(expect.stringContaining('active'));
    expect(tabs.at(1).html()).not.toEqual(expect.stringContaining('active'));
  });

  it('page renders with query', async () => {
    location.search = '?edx_user=&org_key=testX&external_user_key=';
    wrapper = mount(<ProgramEnrollmentsIndexPageWrapper location={location} />);
    await waitForComponentToPaint(wrapper);
    const tabs = wrapper.find('nav.nav-tabs a');

    expect(tabs.at(0).html()).toEqual(expect.stringContaining('active'));
    expect(tabs.at(1).html()).not.toEqual(expect.stringContaining('active'));
  });
});
