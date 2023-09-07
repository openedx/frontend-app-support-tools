/* eslint-disable react/prop-types */
import { renderWithRouter } from '@edx/frontend-enterprise-utils';
import { screen } from '@testing-library/react';
import { ProvisioningContext, hydratedInitialState } from '../../../testData/Provisioning/ProvisioningContextWrapper';
import PROVISIONING_PAGE_TEXT from '../../data/constants';
import SubsidyEditView from '../SubsidyEditView';
import '@testing-library/jest-dom/extend-expect';

const { FORM } = PROVISIONING_PAGE_TEXT;

const SubsidyEditViewWrapper = ({
  value = hydratedInitialState,
}) => (
  <ProvisioningContext value={value}>
    <SubsidyEditView />
  </ProvisioningContext>
);

describe('SubsidyEditView', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  it('renders on true multiple funds', () => {
    renderWithRouter(<SubsidyEditViewWrapper value={{
      ...hydratedInitialState,
      multipleFunds: true,
    }}
    />);
    expect(screen.getByText(FORM.SUB_TITLE)).toBeTruthy();
  });
  it('renders on false multiple funds', () => {
    renderWithRouter(<SubsidyEditViewWrapper value={{
      ...hydratedInitialState,
      multipleFunds: false,
    }}
    />);
    expect(screen.getByText(FORM.SUB_TITLE)).toBeTruthy();
  });
  it('should render policy container given a sample catalog query', () => {
    const updatedStateValue = {
      ...hydratedInitialState,
      alertMessage: '',
      multipleFunds: true,
    };
    renderWithRouter(<SubsidyEditViewWrapper value={updatedStateValue} />);
    expect(screen.queryByText(FORM.ALERTS.unselectedAccountType)).toBeFalsy();
  });
  it('renders with data', () => {
    const updatedStateValue = {
      ...hydratedInitialState,
      multipleFunds: false,
    };
    renderWithRouter(<SubsidyEditViewWrapper value={updatedStateValue} />);
    expect(screen.getByText('Plan Details')).toBeInTheDocument();
    expect(screen.getByText('Plan Details')).toBeInTheDocument();
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByTestId('customer-plan-title').value).toBe('Paper company');
    expect(screen.getByText('Enterprise Customer / UUID')).toBeInTheDocument();
    expect(screen.getByText('Dunder mifflin / 3d9b73dc-590a-48b3-81e2-fd270618b80e')).toBeInTheDocument();
    expect(screen.getByText('Opportunity Product')).toBeInTheDocument();
    expect(screen.getByText('00k12sdf4')).toBeInTheDocument();
    expect(screen.getByText('Term')).toBeInTheDocument();
    expect(screen.getByTestId('start-date').value).toBe('2023-10-01');
    expect(screen.getByTestId('end-date').value).toBe('2023-11-01');
    expect(screen.getByTestId('end-date').value).toBe('2023-11-01');
    expect(screen.getByTestId('internal-only-checkbox').checked).toBeTruthy();
    expect(screen.getByTestId('Yes (bulk enrollment prepay)').checked).toBeTruthy();
    expect(screen.getByText('No, create one Learner Credit budget')).toBeInTheDocument();
    expect(screen.getByTestId('account-name').value).toBe('Paper company --- Open Courses');
    expect(screen.getByTestId('Yes').checked).toBeTruthy();
    expect(screen.getByTestId('per-learner-spend-cap-amount').value).toBe('99');
    expect(screen.getByText(
      'The maximum USD value a single learner may redeem from the budget. This value should be less then the budget starting balance.',
    )).toBeInTheDocument();
    expect(screen.getByText('Save Edits')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByTestId('Open Courses').checked).toBeTruthy();
  });
});
