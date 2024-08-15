/* eslint-disable react/prop-types */
import { renderWithRouter } from '@edx/frontend-enterprise-utils';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import ProvisioningFormSubmissionButton from '../ProvisioningFormSubmissionButton';
import PROVISIONING_PAGE_TEXT from '../../data/constants';
import { initialStateValue, ProvisioningContext } from '../../../testData/Provisioning';
import ROUTES from '../../../../data/constants/routes';
import {
  sampleMultiplePolicyFormData,
  sampleSingleEmptyData,
  sampleSinglePolicyCustomCatalogQueryFormData,
  sampleSinglePolicyPredefinedCatalogQueryFormData,
} from '../../../testData/constants';
import {
  getOrCreateCatalog,
  createPolicy,
  createSubsidy,
} from '../../data/utils';

const { CONFIGURATION: { SUB_DIRECTORY: { PROVISIONING } } } = ROUTES;
const { BUTTON } = PROVISIONING_PAGE_TEXT.FORM;

const mockedNavigator = jest.fn();

jest.mock('../../data/utils', () => {
  const originalModule = jest.requireActual('../../data/utils');
  return {
    ...originalModule,
    getOrCreateCatalog: jest.fn(),
    createPolicy: jest.fn(),
    createSubsidy: jest.fn(),
    determineInvalidFields: jest.fn().mockReturnValue([
      [{ subsidyTitle: false }],
      [{ accountName: false }],
    ]),
  };
});

jest.mock('@edx/frontend-platform/auth', () => ({
  ...jest.requireActual('@edx/frontend-platform/auth'),
  getAuthenticatedHttpClient: jest.fn(() => ({
    get: jest.fn(() => Promise.resolve({ data: { results: [] } })),
    post: jest.fn(() => Promise.resolve({
      uuid: 'test-uuid',
    })),
  })),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigator,
}));

global.scrollTo = jest.fn();

const ProvisioningFormSubmissionButtonWrapper = ({
  value = initialStateValue,
}) => (
  <ProvisioningContext value={value}>
    <ProvisioningFormSubmissionButton />
  </ProvisioningContext>
);

describe('ProvisioningFormSubmissionButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  const sampleDataSets = {
    sampleMultiplePolicyFormData,
    sampleSinglePolicyPredefinedCatalogQueryFormData,
    sampleSinglePolicyCustomCatalogQueryFormData,
  };
  it('renders', () => {
    renderWithRouter(<ProvisioningFormSubmissionButtonWrapper />);

    expect(screen.getByText(BUTTON.submit)).toBeTruthy();
    expect(screen.getByText(BUTTON.cancel)).toBeTruthy();
  });
  it('calls handleSubmit error state when clicked with no data', async () => {
    renderWithRouter(<ProvisioningFormSubmissionButtonWrapper />);

    const submitButton = screen.getByText(BUTTON.submit);
    fireEvent.click(submitButton);

    await waitFor(() => expect(screen.getByText(BUTTON.error)).toBeTruthy());
  });
  it('calls handleCancel when clicked', () => {
    renderWithRouter(<ProvisioningFormSubmissionButtonWrapper />);

    const cancelButton = screen.getByText(BUTTON.cancel);
    fireEvent.click(cancelButton);

    expect(mockedNavigator).toHaveBeenCalledWith(`${PROVISIONING.HOME}`);
  });
  Object.keys(sampleDataSets).forEach(dataSetName => {
    it(`calls handleSubmit complete state when clicked with ${dataSetName} data`, async () => {
      getOrCreateCatalog.mockResolvedValue({ uuid: 'test-uuid' });
      createSubsidy.mockResolvedValue({ uuid: 'test-uuid' });
      createPolicy.mockResolvedValue({ uuid: 'test-uuid' });
      const value = {
        ...initialStateValue,
        formData: sampleDataSets[dataSetName],
      };
      renderWithRouter(<ProvisioningFormSubmissionButtonWrapper value={value} />);

      const submitButton = screen.getByText(BUTTON.submit);
      fireEvent.click(submitButton);

      await waitFor(() => expect(screen.getByText(BUTTON.success)).toBeTruthy());
    });
  });
  it('confirming rejected catalog creation handles error via API', async () => {
    const error = new Error('Internal Server Error');
    error.customAttributes = {
      httpErrorStatus: 500,
    };
    getOrCreateCatalog.mockRejectedValue(error);
    const value = {
      ...initialStateValue,
      formData: sampleMultiplePolicyFormData,
    };
    renderWithRouter(<ProvisioningFormSubmissionButtonWrapper value={value} />);

    const submitButton = screen.getByText(BUTTON.submit);
    fireEvent.click(submitButton);

    await waitFor(() => expect(screen.getByText(BUTTON.error)).toBeTruthy());
  });
  it('confirming rejected subsidy creation handles error via API', async () => {
    const error = new Error('Internal Server Error');
    error.customAttributes = {
      httpErrorStatus: 500,
    };
    getOrCreateCatalog.mockResolvedValue({ uuid: 'test-catalog-uuid' });
    createSubsidy.mockRejectedValue(error);
    const value = {
      ...initialStateValue,
      formData: sampleMultiplePolicyFormData,
    };
    renderWithRouter(<ProvisioningFormSubmissionButtonWrapper value={value} />);

    const submitButton = screen.getByText(BUTTON.submit);
    fireEvent.click(submitButton);

    await waitFor(() => expect(screen.getByText(BUTTON.error)).toBeTruthy());
  });
  it('confirming rejected policy creation handles error via API', async () => {
    const error = new Error('Internal Server Error');
    error.customAttributes = {
      httpErrorStatus: 500,
    };
    getOrCreateCatalog.mockResolvedValue({ uuid: 'test-catalog-uuid' });
    createSubsidy.mockResolvedValue({ uuid: 'test-subsidy-uuid' });
    createPolicy.mockRejectedValue(error);

    const value = {
      ...initialStateValue,
      formData: sampleMultiplePolicyFormData,
    };
    renderWithRouter(<ProvisioningFormSubmissionButtonWrapper value={value} />);

    const submitButton = screen.getByText(BUTTON.submit);
    fireEvent.click(submitButton);

    await waitFor(() => expect(screen.getByText(BUTTON.error)).toBeTruthy());
  });
  it('failed data validation code path', async () => {
    const value = {
      ...initialStateValue,
      formData: sampleSingleEmptyData,
    };

    renderWithRouter(<ProvisioningFormSubmissionButtonWrapper value={value} />);
    const submitButton = screen.getByText(BUTTON.submit);
    await waitFor(() => fireEvent.click(submitButton));
    expect(screen.getByText(BUTTON.error)).toBeTruthy();
  });
});
