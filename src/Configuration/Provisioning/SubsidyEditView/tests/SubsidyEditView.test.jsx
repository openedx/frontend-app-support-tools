/* eslint-disable react/prop-types */
import { renderWithRouter } from '@edx/frontend-enterprise-utils';
import '@testing-library/jest-dom';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { initialStateValue, ProvisioningContext } from '../../../testData/Provisioning/ProvisioningContextWrapper';
import PROVISIONING_PAGE_TEXT from '../../data/constants';
import SubsidyEditView from '../SubsidyEditView';
import { MOCK_PREDEFINED_CATALOG_QUERIES } from '../../../testData/constants';

const { FORM } = PROVISIONING_PAGE_TEXT;

// Patch frontend-platform to serve a custom version of PREDEFINED_CATALOG_QUERIES.
jest.mock('@edx/frontend-platform', () => {
  const actualModule = jest.requireActual('@edx/frontend-platform');
  return ({
    ...actualModule,
    getConfig: jest.fn(() => ({
      ...actualModule.getConfig(),
      FEATURE_CONFIGURATION_EDIT_ENTERPRISE_PROVISION: 'true',
      PREDEFINED_CATALOG_QUERIES: MOCK_PREDEFINED_CATALOG_QUERIES,
    })),
  });
});

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
        uuid: '69035754-fa48-4519-92d8-a723ae0f6e58',
        title: '4a67c952-8eb1-44ba-9ab3-2faa5d0905de - Open Courses',
        enterprise_customer: '4a67c952-8eb1-44ba-9ab3-2faa5d0905de',
        enterprise_catalog_query: MOCK_PREDEFINED_CATALOG_QUERIES.open_courses,
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
          policy_type: 'PerLearnerSpendCreditAccessPolicy',
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
  useParams: () => ({ id: '0196e5c3-ba08-4798-8bf1-019d747c27bf' }),
}));

const SubsidyEditViewWrapper = ({
  value = initialStateValue,
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

  it('renders with data', async () => {
    renderWithRouter(<SubsidyEditViewWrapper />);
    await waitFor(() => expect(screen.getByText('Plan Details')).toBeInTheDocument());
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
    expect(screen.getByTestId('partner-no-rev-prepay').checked).toBeTruthy();
    expect(screen.getByText('No, create one Learner Credit budget')).toBeInTheDocument();
    expect(screen.getByText('Open Courses budget')).toBeInTheDocument();
    expect(screen.getByTestId('account-name').value).toBe('Paper company --- Open Courses');
    expect(screen.getByText(
      'The maximum USD value a single learner may redeem from the budget. This value should be less than the budget starting balance.',
    )).toBeInTheDocument();
    expect(screen.getByText('Save Edits')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('should call beforeunload of window and show alert to user', () => {
    jest.spyOn(window, 'addEventListener');
    renderWithRouter(<SubsidyEditViewWrapper />);
    const enableBeforeUnload = jest.fn();
    function setupEventListener() {
      window.addEventListener('beforeunload', enableBeforeUnload);
    }
    setupEventListener();
    window.dispatchEvent(new Event('beforeunload'));
    expect(window.addEventListener).toHaveBeenCalledWith('beforeunload', enableBeforeUnload);
  });

  describe('updating form', () => {
    beforeEach(async () => {
      renderWithRouter(<SubsidyEditViewWrapper />);
      // Wait for the loading phase, during which API calls are made to hydrate form data and the view is empty.
      await waitFor(() => expect(screen.getByText('Plan Details')).toBeInTheDocument());
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
      expect(startDateInput.value).toBe('2023-06-20');
      fireEvent.change(startDateInput, { target: { value: '2021-01-01' } });
      expect(startDateInput.value).toBe('2021-01-01');
      await checksForCancelConfirmation();
    });
    it('shows confirmation modal when there are edits subsidy type selection', async () => {
      const yesButton = screen.getByTestId('partner-no-rev-prepay');
      expect(yesButton.checked).toBeTruthy();
      const noButton = screen.getByTestId('bulk-enrollment-prepay');
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
