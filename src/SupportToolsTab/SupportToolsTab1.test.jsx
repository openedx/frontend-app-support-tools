import { render, screen, fireEvent } from '@testing-library/react';
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
    render(<SupportToolsTabWrapper />);

    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Support Tools');
    expect(screen.getByText(/Suite of tools used by support team/i)).toBeInTheDocument();

    expect(screen.getByRole('tab', { name: 'Learner Information' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Feature Based Enrollment' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Program Information' })).toBeInTheDocument();
  });

  it('Path changes on Tab switch', () => {
    render(<SupportToolsTabWrapper />);

    const learnerTab = screen.getByRole('tab', { name: 'Learner Information' });
    const fbeTab = screen.getByRole('tab', { name: 'Feature Based Enrollment' });
    const programTab = screen.getByRole('tab', { name: 'Program Information' });

    fireEvent.click(fbeTab);
    expect(mockedNavigator).toHaveBeenCalledWith(TAB_PATH_MAP['feature-based-enrollment'], { replace: true });
    expect(fbeTab.className).toMatch(/active/);
    expect(screen.getByLabelText(/Course ID/i)).toBeInTheDocument();

    fireEvent.click(learnerTab);
    expect(mockedNavigator).toHaveBeenCalledWith(TAB_PATH_MAP['learner-information'], { replace: true });
    expect(learnerTab.className).toMatch(/active/);
    expect(screen.getByLabelText(/Username, Email or LMS User ID/i)).toBeInTheDocument();

    fireEvent.click(programTab);
    expect(mockedNavigator).toHaveBeenCalledWith(TAB_PATH_MAP.programs, { replace: true });
    expect(programTab.className).toMatch(/active/);
  });

  it('default tab changes based on feature-based-enrollment pathname', () => {
    render(<SupportToolsTabWrapper pathName={TAB_PATH_MAP['feature-based-enrollment']} />);
    const fbeTab = screen.getByRole('tab', { name: 'Feature Based Enrollment' });
    expect(fbeTab.className).toMatch(/active/);
  });

  it('default tab changes based on learner-information pathname', () => {
    render(<SupportToolsTabWrapper pathName={TAB_PATH_MAP['learner-information']} />);
    const learnerTab = screen.getByRole('tab', { name: 'Learner Information' });
    expect(learnerTab.className).toMatch(/active/);
  });

  it('default tab changes based on programs pathname', () => {
    render(<SupportToolsTabWrapper pathName={TAB_PATH_MAP.programs} />);
    const programTab = screen.getByRole('tab', { name: 'Program Information' });
    expect(programTab.className).toMatch(/active/);
  });
});
