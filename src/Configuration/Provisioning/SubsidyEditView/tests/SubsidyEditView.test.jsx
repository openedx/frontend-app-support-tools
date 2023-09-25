/* eslint-disable react/prop-types */
import Router from 'react-router-dom';
import { renderWithRouter } from '@edx/frontend-enterprise-utils';
import {
  act,
  fireEvent,
  screen,
  waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProvisioningContext, hydratedInitialState } from '../../../testData/Provisioning/ProvisioningContextWrapper';
import PROVISIONING_PAGE_TEXT from '../../data/constants';
import SubsidyEditView from '../SubsidyEditView';
import '@testing-library/jest-dom/extend-expect';

const { FORM } = PROVISIONING_PAGE_TEXT;

const mockConfig = () => ({
  FEATURE_CONFIGURATION_EDIT_ENTERPRISE_PROVISION: 'true',
  PREDEFINED_CATALOG_QUERIES: {
    everything: 1,
    open_courses: 2,
    executive_education: 3,
  },
});

jest.mock('@edx/frontend-platform', () => ({
  ...jest.requireActual('@edx/frontend-platform'),
  getConfig: () => mockConfig(),
}));

const mockData = {
  data: {
    results: [
      {
        title: 'TestTest',
        content_filter: {
          content_type: 'courses',
          availability: [
            'Current',
            'Starting Soon',
            'Upcoming',
          ],
          partner: 'edx',
        },
      },
    ],
  },
  catalogTitle: '5c0ced09-db71-438f-bfb5-fac49644e26d - TestTest',
};

const mocks = {
  enterpriseCustomerCatalogsMock: {
    data: {
      results: [{
        enterprise_customer: '4a67c952-8eb1-44ba-9ab3-2faa5d0905de',
        title: '4a67c952-8eb1-44ba-9ab3-2faa5d0905de - Open Courses budget',
        uuid: '69035754-fa48-4519-92d8-a723ae0f6e58',
        enterprise_catalog_query: 29,
      }],
    },
  },
  customersBasicListMock: {
    data: [{
      id: '3d9b73dc-590a-48b3-81e2-fd270618b80e',
      name: 'Dunder mifflin',
    }],
  },
  singleSubsidyMock: {
    data: {
      results: [{
        uuid: '0196e5c3-ba08-4798-8bf1-019d747c27bf',
        title: 'Paper company',
        enterprise_customer_uuid: '3d9b73dc-590a-48b3-81e2-fd270618b80e',
        active_datetime: '2023-06-20T00:00:00Z',
        expiration_datetime: '2023-06-22T00:00:00Z',
        reference_id: '00k12sdf4',
        current_balance: 4000,
        starting_balance: 9900,
        internal_only: true,
        revenue_category: 'partner-no-rev-prepay',
        is_active: false,
      }],
    },
  },
  policyMock: {
    data: {
      results: [
        {
          uuid: '1fedab07-8872-4795-8f8c-e4035b1f41b7',
          description: 'description',
          enterprise_customer_uuid: '3d9b73dc-590a-48b3-81e2-fd270618b80e',
          catalog_uuid: '69035754-fa48-4519-92d8-a723ae0f6e58',
          subsidy_uuid: '0196e5c3-ba08-4798-8bf1-019d747c27bf',
          per_learner_enrollment_limit: null,
          per_learner_spend_limit: 50,
          spend_limit: 500,
          subsidy_active_datetime: '2023-06-20T00:00:00Z',
          subsidy_expiration_datetime: '2023-06-22T00:00:00Z',
          is_subsidy_active: false,
        },
      ],
    },
  },
};

jest.mock('../../../../data/services/EnterpriseApiService', () => ({
  fetchEnterpriseCustomerCatalogs: jest.fn(() => Promise.resolve(mocks.enterpriseCustomerCatalogsMock)),
  fetchSubsidyAccessPolicies: jest.fn(() => Promise.resolve(mocks.policyMock)),
  fetchEnterpriseCustomersBasicList: jest.fn(() => Promise.resolve(mocks.customersBasicListMock)),
  fetchEnterpriseCatalogQueries: jest.fn(() => Promise.resolve(mockData)),
}));

jest.mock('../../../../data/services/SubsidyApiService', () => ({
  fetchSingleSubsidy: jest.fn(() => Promise.resolve(mocks.singleSubsidyMock)),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
}));

const SubsidyEditViewWrapper = ({
  value = hydratedInitialState,
}) => (
  <ProvisioningContext value={value}>
    <SubsidyEditView />
  </ProvisioningContext>
);

describe('SubsidyEditView', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  it('renders on true multiple funds', async () => {
    jest.spyOn(Router, 'useParams').mockReturnValue({ id: '0196e5c3-ba08-4798-8bf1-019d747c27bf' });
    await act(async () => renderWithRouter(<SubsidyEditViewWrapper value={{ ...hydratedInitialState }} />));
    expect(screen.getByText(FORM.SUB_TITLE)).toBeTruthy();
  });

  it('should render policy container given a sample catalog query', async () => {
    const updatedStateValue = {
      ...hydratedInitialState,
      alertMessage: '',
      multipleFunds: true,
    };
    await act(async () => renderWithRouter(<SubsidyEditViewWrapper value={updatedStateValue} />));
    expect(screen.queryByText(FORM.ALERTS.unselectedAccountType)).toBeFalsy();
  });
  it('renders with data', async () => {
    const updatedStateValue = {
      ...hydratedInitialState,
      multipleFunds: false,
    };
    jest.spyOn(Router, 'useParams').mockReturnValue({ id: '0196e5c3-ba08-4798-8bf1-019d747c27bf' });
    await act(async () => renderWithRouter(<SubsidyEditViewWrapper value={updatedStateValue} />));
    expect(screen.getByText('Plan Details')).toBeInTheDocument();
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByTestId('customer-plan-title').value).toBe('Paper company');
    expect(screen.getByText('Enterprise Customer / UUID')).toBeInTheDocument();
    expect(screen.getByText('Dunder mifflin / 3d9b73dc-590a-48b3-81e2-fd270618b80e')).toBeInTheDocument();
    expect(screen.getByText('Opportunity Product')).toBeInTheDocument();
    expect(screen.getByText('00k12sdf4')).toBeInTheDocument();
    expect(screen.getByText('Term')).toBeInTheDocument();
    expect(screen.getByTestId('start-date').value).toBe('2023-06-20');
    expect(screen.getByTestId('end-date').value).toBe('2023-06-22');
    expect(screen.getByTestId('internal-only-checkbox').checked).toBeTruthy();
    expect(screen.getByTestId('Yes (bulk enrollment prepay)').checked).toBeTruthy();
    expect(screen.getByText('No, create one Learner Credit budget')).toBeInTheDocument();
    expect(screen.getByTestId('account-name').value).toBe('Paper company --- Open Courses');
    expect(screen.getByText(
      'The maximum USD value a single learner may redeem from the budget. This value should be less than the budget starting balance.',
    )).toBeInTheDocument();
    expect(screen.getByText('Save Edits')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });
  it('should call beforeunload of window and show alert to user', async () => {
    jest.spyOn(Router, 'useParams').mockReturnValue({ id: '0196e5c3-ba08-4798-8bf1-019d747c27bf' });
    jest.spyOn(window, 'addEventListener');
    await act(async () => renderWithRouter(<SubsidyEditViewWrapper value={{ ...hydratedInitialState }} />));
    const enableBeforeUnload = jest.fn();
    function setupEventListener() {
      window.addEventListener('beforeunload', enableBeforeUnload);
    }
    setupEventListener();
    window.dispatchEvent(new Event('beforeunload'));
    expect(window.addEventListener).toHaveBeenCalledWith('beforeunload', enableBeforeUnload);
  });

  describe('updating form', () => {
    beforeEach(() => {
      const updatedStateValue = {
        ...hydratedInitialState,
        isEditMode: true,
      };
      jest.spyOn(Router, 'useParams').mockReturnValue({ id: '0196e5c3-ba08-4798-8bf1-019d747c27bf' });
      renderWithRouter(<SubsidyEditViewWrapper value={updatedStateValue} />);
    });
    const checksForCancelConfirmation = async () => {
      const button = screen.getByRole('button', {
        name: FORM.CANCEL.description,
      });
      expect(button).toBeInTheDocument();
      userEvent.click(button);
      await waitFor(() => expect(screen.getByText(FORM.CANCEL.MODAL.TITLE)).toBeInTheDocument());
    };
    it('shows confirmation modal when there are edits to date input', async () => {
      const startDateInput = screen.getByTestId('start-date');
      expect(startDateInput.value).toBe('2023-10-01');
      fireEvent.change(startDateInput, { target: { value: '2021-01-01' } });
      expect(startDateInput.value).toBe('2021-01-01');
      await checksForCancelConfirmation();
    });
    it('shows confirmation modal when there are edits subsidy type selection', async () => {
      const yesButton = screen.getByTestId(FORM.SUBSIDY_TYPE.OPTIONS.yes);
      expect(yesButton.checked).toBeTruthy();
      const noButton = screen.getByTestId(FORM.SUBSIDY_TYPE.OPTIONS.no);
      fireEvent.click(noButton);
      await checksForCancelConfirmation();
    });
    it('shows confirmation modal when there are edits to the description', async () => {
      const input = screen.getByTestId('account-description');
      fireEvent.change(input, { target: { value: 'test' } });
      await checksForCancelConfirmation();
    });
    it('shows confirmation modal when there are edits to the learner cap selection', async () => {
      const yesButton = screen.getByTestId(FORM.LEARNER_CAP.OPTIONS.yes);
      expect(yesButton.checked).toBeTruthy();
      const noButton = screen.getByTestId(FORM.LEARNER_CAP.OPTIONS.no);
      fireEvent.click(noButton);
      await checksForCancelConfirmation();
    });
    it('shows confirmation modal when there are edits to learner cap amount', async () => {
      const input = screen.getByTestId('per-learner-spend-cap-amount');
      fireEvent.change(input, { target: { value: '100.50' } });
      await checksForCancelConfirmation();
    });
    it('shows confirmation modal when there are edits checkbox is selected/unselected', async () => {
      const checkbox = screen.getByTestId('internal-only-checkbox');
      fireEvent.click(checkbox);
      await checksForCancelConfirmation();
    });
  });
});
