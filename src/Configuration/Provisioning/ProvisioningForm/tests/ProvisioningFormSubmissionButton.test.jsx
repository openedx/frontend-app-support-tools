/* eslint-disable react/prop-types */
import { renderWithRouter } from '@edx/frontend-enterprise-utils';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { Router } from 'react-router-dom';
import ProvisioningFormSubmissionButton from '../ProvisioningFormSubmissionButton';
import PROVISIONING_PAGE_TEXT from '../../data/constants';
import { ProvisioningContext, initialStateValue } from '../../../testData/Provisioning';
import ROUTES from '../../../../data/constants/routes';
import {
  sampleMultiplePolicyFormData,
  sampleSingleEmptyData,
  sampleSinglePolicyCustomCatalogQueryFormData,
  sampleSinglePolicyPredefinedCatalogQueryFormData,
} from '../../../testData/constants';
import { createCatalogs, createPolicy, createSubsidy } from '../../data/utils';

const { CONFIGURATION: { SUB_DIRECTORY: { PROVISIONING } } } = ROUTES;
const { BUTTON } = PROVISIONING_PAGE_TEXT.FORM;

const useHistoryPush = jest.fn();
const historyMock = {
  push: useHistoryPush,
  location: jest.fn(),
  listen: jest.fn(),
  replace: jest.fn(),
};

jest.mock('../../data/utils', () => {
  const originalModule = jest.requireActual('../../data/utils');
  return {
    ...originalModule,
    createCatalogs: jest.fn(),
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

global.scrollTo = jest.fn();

const ProvisioningFormSubmissionButtonWrapper = ({
  value = initialStateValue,
}) => (
  <Router history={historyMock}>
    <ProvisioningContext value={value}>
      <ProvisioningFormSubmissionButton />
    </ProvisioningContext>
  </Router>
);

describe('ProvisioningFormSubmissionButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  const sampleDataSet = [
    { sampleMultiplePolicyFormData },
    { sampleSinglePolicyPredefinedCatalogQueryFormData },
    { sampleSinglePolicyCustomCatalogQueryFormData },
  ];
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

    expect(useHistoryPush).toHaveBeenCalledWith(`${PROVISIONING.HOME}`);
  });
  for (let i = 0; i < sampleDataSet.length; i++) {
    it(`calls handleSubmit complete state when clicked with ${Object.keys(sampleDataSet[i])} data`, async () => {
      createCatalogs.mockResolvedValue({ uuid: 'test-uuid' });
      createSubsidy.mockResolvedValue({ uuid: 'test-uuid' });
      createPolicy.mockResolvedValue({ uuid: 'test-uuid' });
      const value = {
        ...initialStateValue,
        formData: sampleDataSet[i][Object.keys(sampleDataSet[i])],
      };
      renderWithRouter(<ProvisioningFormSubmissionButtonWrapper value={value} />);

      const submitButton = screen.getByText(BUTTON.submit);
      fireEvent.click(submitButton);

      await waitFor(() => expect(screen.getByText(BUTTON.success)).toBeTruthy());
    });
  }
  it('confirming rejected catalog creation handles error via API', async () => {
    const error = new Error('Internal Server Error');
    error.customAttributes = {
      httpErrorStatus: 500,
    };
    createCatalogs.mockRejectedValue(error);
    const value = {
      ...initialStateValue,
      formData: sampleDataSet[0][Object.keys(sampleDataSet[0])],
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
    createCatalogs.mockResolvedValue({ uuid: 'test-catalog-uuid' });
    createSubsidy.mockRejectedValue(error);
    const value = {
      ...initialStateValue,
      formData: sampleDataSet[0][Object.keys(sampleDataSet[0])],
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
    createCatalogs.mockResolvedValue({ uuid: 'test-catalog-uuid' });
    createSubsidy.mockResolvedValue({ uuid: 'test-subsidy-uuid' });
    createPolicy.mockRejectedValue(error);

    const value = {
      ...initialStateValue,
      formData: sampleDataSet[0][Object.keys(sampleDataSet[0])],
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
