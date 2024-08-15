import { mount } from 'enzyme';
import React from 'react';
import PropTypes from 'prop-types';
import { MemoryRouter } from 'react-router-dom';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import UserMessagesProvider from '../userMessages/UserMessagesProvider';
import SupportToolsTab from './SupportToolsTab';
import { TAB_PATH_MAP } from './constants';

const mockedNavigator = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigator,
}));

const SupportToolsTabWrapper = ({ pathName }) => (
  <IntlProvider locale="en">
    <MemoryRouter initialEntries={[`${pathName}`]}>
      <UserMessagesProvider>
        <SupportToolsTab />
      </UserMessagesProvider>
    </MemoryRouter>
  </IntlProvider>
);

SupportToolsTabWrapper.propTypes = {
  pathName: PropTypes.string,
};

SupportToolsTabWrapper.defaultProps = {
  pathName: '/',
};

describe('Support Tools Main tab', () => {
  let wrapper;

  afterEach(() => {
    wrapper.unmount();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('default page render', () => {
    wrapper = mount(<SupportToolsTabWrapper />);

    const tabs = wrapper.find('nav.support-tools-tab.nav-tabs a');
    expect(tabs.at(0).text()).toEqual('Learner Information');
    expect(tabs.at(1).text()).toEqual('Feature Based Enrollment');
    expect(tabs.at(2).text()).toEqual('Program Information');

    expect(wrapper.find('h2').text()).toEqual('Support Tools');
    expect(wrapper.find('p').text()).toEqual(
      'Suite of tools used by support team to help triage and resolve select learner issues.',
    );
  });

  it('Path changes on Tab switch', () => {
    wrapper = mount(<SupportToolsTabWrapper />);

    let tabs = wrapper.find('nav.nav-tabs a');

    tabs.at(1).simulate('click');
    tabs = wrapper.find('nav.support-tools-tab.nav-tabs a');
    const fbeTab = wrapper.find('div.tab-content div#support-tools-tab-tabpane-feature-based-enrollment');
    expect(mockedNavigator).toHaveBeenCalledWith(TAB_PATH_MAP['feature-based-enrollment'], { replace: true });
    expect(tabs.at(0).html()).not.toEqual(expect.stringContaining('active'));
    expect(tabs.at(1).html()).toEqual(expect.stringContaining('active'));
    expect(tabs.at(2).html()).not.toEqual(expect.stringContaining('active'));
    expect(fbeTab.html()).toEqual(expect.stringContaining('active'));
    expect(fbeTab.find('label').text()).toEqual('Course ID');

    tabs.at(0).simulate('click');
    tabs = wrapper.find('nav.support-tools-tab.nav-tabs a');
    const learnerTab = wrapper.find('div.tab-content div#support-tools-tab-tabpane-learner-information');
    expect(mockedNavigator).toHaveBeenCalledWith(TAB_PATH_MAP['learner-information'], { replace: true });
    expect(tabs.at(0).html()).toEqual(expect.stringContaining('active'));
    expect(tabs.at(1).html()).not.toEqual(expect.stringContaining('active'));
    expect(tabs.at(2).html()).not.toEqual(expect.stringContaining('active'));
    expect(learnerTab.html()).toEqual(expect.stringContaining('active'));
    expect(learnerTab.find('label').text()).toEqual('Username, Email or LMS User ID');

    tabs.at(2).simulate('click');
    tabs = wrapper.find('nav.support-tools-tab.nav-tabs a');
    expect(mockedNavigator).toHaveBeenCalledWith(TAB_PATH_MAP.programs, { replace: true });
    expect(tabs.at(0).html()).not.toEqual(expect.stringContaining('active'));
    expect(tabs.at(1).html()).not.toEqual(expect.stringContaining('active'));
    expect(tabs.at(2).html()).toEqual(expect.stringContaining('active'));
  });

  it('default tab changes based on feature-based-enrollment pathname', () => {
    wrapper = mount(<SupportToolsTabWrapper pathName={`${TAB_PATH_MAP['feature-based-enrollment']}`} />);
    const tabs = wrapper.find('nav.support-tools-tab.nav-tabs a');

    expect(tabs.at(0).html()).not.toEqual(expect.stringContaining('active'));
    expect(tabs.at(1).html()).toEqual(expect.stringContaining('active'));
    expect(tabs.at(2).html()).not.toEqual(expect.stringContaining('active'));
  });

  it('default tab changes based on learner-information pathname', () => {
    wrapper = mount(<SupportToolsTabWrapper pathName={`${TAB_PATH_MAP['learner-information']}`} />);
    const tabs = wrapper.find('nav.support-tools-tab.nav-tabs a');

    expect(tabs.at(0).html()).toEqual(expect.stringContaining('active'));
    expect(tabs.at(1).html()).not.toEqual(expect.stringContaining('active'));
    expect(tabs.at(2).html()).not.toEqual(expect.stringContaining('active'));
  });

  it('default tab changes based on programs pathname', () => {
    wrapper = mount(<SupportToolsTabWrapper pathName={`${TAB_PATH_MAP.programs}`} />);
    const tabs = wrapper.find('nav.support-tools-tab.nav-tabs a');

    expect(tabs.at(0).html()).not.toEqual(expect.stringContaining('active'));
    expect(tabs.at(1).html()).not.toEqual(expect.stringContaining('active'));
    expect(tabs.at(2).html()).toEqual(expect.stringContaining('active'));
  });
});
