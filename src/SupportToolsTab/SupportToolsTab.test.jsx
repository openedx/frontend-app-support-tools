import React from 'react';
import PropTypes from 'prop-types';
import { MemoryRouter } from 'react-router-dom';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UserMessagesProvider from '../userMessages/UserMessagesProvider';
import SupportToolsTab from './SupportToolsTab';
import { TAB_PATH_MAP } from './constants';

jest.mock('../FeatureBasedEnrollments/FeatureBasedEnrollmentIndexPage', () => () => (
  <div data-testid="mock-fbe">Mocked FeatureBasedEnrollmentIndexPage</div>
));

jest.mock('../users/UserPage', () => () => (
  <div data-testid="mock-user">Mocked UserPage</div>
));

jest.mock('../ProgramEnrollments/ProgramEnrollmentsIndexPage', () => () => (
  <div data-testid="mock-program">Mocked ProgramEnrollmentsIndexPage</div>
));

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

    expect(screen.getByText('Support Tools')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Suite of tools used by support team to help triage and resolve select learner issues.',
      ),
    ).toBeInTheDocument();

    expect(screen.getByRole('tab', { name: /Learner Information/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /Feature Based Enrollment/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /Program Information/i })).toBeInTheDocument();
  });

  it('Path changes on Tab switch', async () => {
    render(<SupportToolsTabWrapper />);

    const learnerTab = screen.getByRole('tab', { name: /Learner Information/i });
    const fbeTab = screen.getByRole('tab', { name: /Feature Based Enrollment/i });
    const programTab = screen.getByRole('tab', { name: /Program Information/i });

    await userEvent.click(fbeTab);
    expect(mockedNavigator).toHaveBeenCalledWith(TAB_PATH_MAP['feature-based-enrollment'], { replace: true });

    await userEvent.click(learnerTab);
    expect(mockedNavigator).toHaveBeenCalledWith(TAB_PATH_MAP['learner-information'], { replace: true });

    await userEvent.click(programTab);
    expect(mockedNavigator).toHaveBeenCalledWith(TAB_PATH_MAP.programs, { replace: true });
  });

  it('default tab changes based on feature-based-enrollment pathname', () => {
    render(<SupportToolsTabWrapper pathName={TAB_PATH_MAP['feature-based-enrollment']} />);
    expect(screen.getByRole('tab', { name: /Feature Based Enrollment/i })).toHaveAttribute('aria-selected', 'true');
  });

  it('default tab changes based on learner-information pathname', () => {
    render(<SupportToolsTabWrapper pathName={TAB_PATH_MAP['learner-information']} />);
    expect(screen.getByRole('tab', { name: /Learner Information/i })).toHaveAttribute('aria-selected', 'true');
  });

  it('default tab changes based on programs pathname', () => {
    render(<SupportToolsTabWrapper pathName={TAB_PATH_MAP.programs} />);
    expect(screen.getByRole('tab', { name: /Program Information/i })).toHaveAttribute('aria-selected', 'true');
  });
});
