import { mount } from 'enzyme';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import { history } from '@edx/frontend-platform';
import UserMessagesProvider from '../userMessages/UserMessagesProvider';
import SupportToolsTab from './SupportToolsTab';
import { TAB_PATH_MAP } from './constants';

const SupportToolsTabWrapper = (props) => (
  <IntlProvider locale="en">
    <MemoryRouter>
      <UserMessagesProvider>
        <SupportToolsTab {...props} />
      </UserMessagesProvider>
    </MemoryRouter>
  </IntlProvider>
);

describe('Support Tools Main tab', () => {
  let wrapper; let location;

  beforeEach(() => {
    location = { pathname: '/', search: '' };
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it('default page render', () => {
    wrapper = mount(<SupportToolsTabWrapper location={location} />);

    const tabs = wrapper.find('nav.support-tools-tab.nav-tabs a');
    expect(tabs.length).toEqual(3);
    expect(tabs.at(0).text()).toEqual('Learner Information');
    expect(tabs.at(1).text()).toEqual('Feature Based Enrollment');
    expect(tabs.at(2).text()).toEqual('Program Information');

    expect(wrapper.find('h2').text()).toEqual('Support Tools');
    expect(wrapper.find('p').text()).toEqual(
      'Suite of tools used by support team to help triage and resolve select learner issues.',
    );
  });

  it('Path changes on Tab switch', () => {
    history.replace = jest.fn();
    wrapper = mount(<SupportToolsTabWrapper location={location} />);

    let tabs = wrapper.find('nav.nav-tabs a');

    tabs.at(1).simulate('click');
    tabs = wrapper.find('nav.support-tools-tab.nav-tabs a');
    const fbeTab = wrapper.find('div.tab-content div#support-tools-tab-tabpane-feature-based-enrollment');
    expect(history.replace).toHaveBeenCalledWith(TAB_PATH_MAP['feature-based-enrollment']);
    expect(tabs.at(0).html()).not.toEqual(expect.stringContaining('active'));
    expect(tabs.at(1).html()).toEqual(expect.stringContaining('active'));
    expect(tabs.at(2).html()).not.toEqual(expect.stringContaining('active'));
    expect(fbeTab.html()).toEqual(expect.stringContaining('active'));
    expect(fbeTab.find('label').text()).toEqual('Course ID');

    tabs.at(0).simulate('click');
    tabs = wrapper.find('nav.support-tools-tab.nav-tabs a');
    const learnerTab = wrapper.find('div.tab-content div#support-tools-tab-tabpane-learner-information');
    expect(history.replace).toHaveBeenCalledWith(TAB_PATH_MAP['learner-information']);
    expect(tabs.at(0).html()).toEqual(expect.stringContaining('active'));
    expect(tabs.at(1).html()).not.toEqual(expect.stringContaining('active'));
    expect(tabs.at(2).html()).not.toEqual(expect.stringContaining('active'));
    expect(learnerTab.html()).toEqual(expect.stringContaining('active'));
    expect(learnerTab.find('label').text()).toEqual('Username, Email or LMS User ID');

    tabs.at(2).simulate('click');
    tabs = wrapper.find('nav.support-tools-tab.nav-tabs a');
    expect(history.replace).toHaveBeenCalledWith(TAB_PATH_MAP.programs);
    expect(tabs.at(0).html()).not.toEqual(expect.stringContaining('active'));
    expect(tabs.at(1).html()).not.toEqual(expect.stringContaining('active'));
    expect(tabs.at(2).html()).toEqual(expect.stringContaining('active'));

    history.replace.mockReset();
  });

  it('default tab changes based on feature-based-enrollment pathname', () => {
    location = { pathname: TAB_PATH_MAP['feature-based-enrollment'], search: '' };

    wrapper = mount(<SupportToolsTabWrapper location={location} />);
    const tabs = wrapper.find('nav.support-tools-tab.nav-tabs a');

    expect(tabs.at(0).html()).not.toEqual(expect.stringContaining('active'));
    expect(tabs.at(1).html()).toEqual(expect.stringContaining('active'));
    expect(tabs.at(2).html()).not.toEqual(expect.stringContaining('active'));
  });

  it('default tab changes based on learner-information pathname', () => {
    location = { pathname: TAB_PATH_MAP['learner-information'], search: '' };

    wrapper = mount(<SupportToolsTabWrapper location={location} />);
    const tabs = wrapper.find('nav.support-tools-tab.nav-tabs a');

    expect(tabs.at(0).html()).toEqual(expect.stringContaining('active'));
    expect(tabs.at(1).html()).not.toEqual(expect.stringContaining('active'));
    expect(tabs.at(2).html()).not.toEqual(expect.stringContaining('active'));
  });

  it('default tab changes based on programs pathname', () => {
    location = { pathname: TAB_PATH_MAP.programs, search: '' };

    wrapper = mount(<SupportToolsTabWrapper location={location} />);
    const tabs = wrapper.find('nav.support-tools-tab.nav-tabs a');

    expect(tabs.at(0).html()).not.toEqual(expect.stringContaining('active'));
    expect(tabs.at(1).html()).not.toEqual(expect.stringContaining('active'));
    expect(tabs.at(2).html()).toEqual(expect.stringContaining('active'));
  });
});
