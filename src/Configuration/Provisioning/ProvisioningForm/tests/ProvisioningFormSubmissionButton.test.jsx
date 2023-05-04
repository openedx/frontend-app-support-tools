/* eslint-disable react/prop-types */
import { renderWithRouter } from '@edx/frontend-enterprise-utils';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { Router } from 'react-router-dom';
import ProvisioningFormSubmissionButton from '../ProvisioningFormSubmissionButton';
import PROVISIONING_PAGE_TEXT from '../../data/constants';
import { ProvisioningContext, initialStateValue } from '../../../testData';
import ROUTES from '../../../../data/constants/routes';
import {
  sampleMultiplePolicyFormData,
  sampleSinglePolicyCustomCatalogQueryFormData,
  sampleSinglePolicyPredefinedCatalogQueryFormData,
} from '../../../testData/constants';

const { CONFIGURATION: { SUB_DIRECTORY: { PROVISIONING } } } = ROUTES;
const useHistoryPush = jest.fn();
const historyMock = { push: useHistoryPush, location: {}, listen: jest.fn() };

jest.mock('@edx/frontend-platform/auth', () => ({
  ...jest.requireActual('@edx/frontend-platform/auth'),
  getAuthenticatedHttpClient: jest.fn(() => ({
    get: jest.fn(() => Promise.resolve({ data: { results: [] } })),
    post: jest.fn(() => Promise.resolve({
      data: {
        uuid: 'test-uuid',
      },
    })),
  })),
}));

jest.mock('@edx/frontend-platform/logging', () => ({
  ...jest.requireActual('@edx/frontend-platform/logging'),
  logError: jest.fn(),
}));

const { BUTTON } = PROVISIONING_PAGE_TEXT.FORM;

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
});
