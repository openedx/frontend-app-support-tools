import { fireEvent, render } from '@testing-library/react';
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
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('default page render', () => {
    const { unmount } = render(<SupportToolsTabWrapper />);
    const tabs = document.querySelectorAll('nav.support-tools-tab.nav-tabs a');
    expect(tabs[0].textContent).toEqual('Learner Information');
    expect(tabs[1].textContent).toEqual('Feature Based Enrollment');
    expect(tabs[2].textContent).toEqual('Program Information');

    expect(document.querySelector('h2').textContent).toEqual('Support Tools');
    expect(document.querySelector('p').textContent).toEqual(
      'Suite of tools used by support team to help triage and resolve select learner issues.',
    );
    unmount();
  });

  it('Path changes on Tab switch', () => {
    const { unmount } = render(<SupportToolsTabWrapper />);
    let tabs = document.querySelectorAll('nav.nav-tabs a');

    fireEvent.click(tabs[1]);
    tabs = document.querySelectorAll('nav.support-tools-tab.nav-tabs a');
    const fbeTab = document.querySelector('div.tab-content div#support-tools-tab-tabpane-feature-based-enrollment');
    expect(mockedNavigator).toHaveBeenCalledWith(TAB_PATH_MAP['feature-based-enrollment'], { replace: true });
    expect(tabs[0].outerHTML).not.toEqual(expect.stringContaining('active'));
    expect(tabs[1].outerHTML).toEqual(expect.stringContaining('active'));
    expect(tabs[2].outerHTML).not.toEqual(expect.stringContaining('active'));
    expect(fbeTab.outerHTML).toEqual(expect.stringContaining('active'));
    expect(fbeTab.querySelector('label').textContent).toEqual('Course ID');

    fireEvent.click(tabs[0]);
    tabs = document.querySelectorAll('nav.support-tools-tab.nav-tabs a');
    const learnerTab = document.querySelector('div.tab-content div#support-tools-tab-tabpane-learner-information');
    expect(mockedNavigator).toHaveBeenCalledWith(TAB_PATH_MAP['learner-information'], { replace: true });
    expect(tabs[0].outerHTML).toEqual(expect.stringContaining('active'));
    expect(tabs[1].outerHTML).not.toEqual(expect.stringContaining('active'));
    expect(tabs[2].outerHTML).not.toEqual(expect.stringContaining('active'));
    expect(learnerTab.outerHTML).toEqual(expect.stringContaining('active'));
    expect(learnerTab.querySelector('label').textContent).toEqual('Username, Email or LMS User ID');

    fireEvent.click(tabs[2]);
    tabs = document.querySelectorAll('nav.support-tools-tab.nav-tabs a');
    expect(mockedNavigator).toHaveBeenCalledWith(TAB_PATH_MAP.programs, { replace: true });
    expect(tabs[0].outerHTML).not.toEqual(expect.stringContaining('active'));
    expect(tabs[1].outerHTML).not.toEqual(expect.stringContaining('active'));
    expect(tabs[2].outerHTML).toEqual(expect.stringContaining('active'));
    unmount();
  });

  it('default tab changes based on feature-based-enrollment pathname', () => {
    const { unmount } = render(<SupportToolsTabWrapper pathName={`${TAB_PATH_MAP['feature-based-enrollment']}`} />);
    const tabs = document.querySelectorAll('nav.support-tools-tab.nav-tabs a');

    expect(tabs[0].outerHTML).not.toEqual(expect.stringContaining('active'));
    expect(tabs[1].outerHTML).toEqual(expect.stringContaining('active'));
    expect(tabs[2].outerHTML).not.toEqual(expect.stringContaining('active'));
    unmount();
  });

  it('default tab changes based on learner-information pathname', () => {
    const { unmount } = render(<SupportToolsTabWrapper pathName={`${TAB_PATH_MAP['learner-information']}`} />);
    const tabs = document.querySelectorAll('nav.support-tools-tab.nav-tabs a');

    expect(tabs[0].outerHTML).toEqual(expect.stringContaining('active'));
    expect(tabs[1].outerHTML).not.toEqual(expect.stringContaining('active'));
    expect(tabs[2].outerHTML).not.toEqual(expect.stringContaining('active'));
    unmount();
  });

  it('default tab changes based on programs pathname', () => {
    const { unmount } = render(<SupportToolsTabWrapper pathName={`${TAB_PATH_MAP.programs}`} />);
    const tabs = document.querySelectorAll('nav.support-tools-tab.nav-tabs a');

    expect(tabs[0].outerHTML).not.toEqual(expect.stringContaining('active'));
    expect(tabs[1].outerHTML).not.toEqual(expect.stringContaining('active'));
    expect(tabs[2].outerHTML).toEqual(expect.stringContaining('active'));
    unmount();
  });
});
