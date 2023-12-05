/* eslint-disable react/prop-types */
import '@testing-library/jest-dom/extend-expect';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { renderWithRouter } from '@edx/frontend-enterprise-utils';
import SaveEditsButton from '../SaveEditsButton';
import PROVISIONING_PAGE_TEXT from '../../data/constants';
import { hydratedInitialState, ProvisioningContext } from '../../../testData/Provisioning/ProvisioningContextWrapper';
import { patchPolicy, patchSubsidy, getOrCreateCatalog } from '../../data/utils';
import {
  sampleMultiplePolicyFormData,
  sampleSingleEmptyData,
  sampleSinglePolicyCustomCatalogQueryFormData,
  sampleSinglePolicyPredefinedCatalogQueryFormData,
} from '../../../testData/constants';

const { SAVE_BUTTON } = PROVISIONING_PAGE_TEXT.FORM;

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('../../data/utils', () => {
  const originalModule = jest.requireActual('../../data/utils');
  return {
    ...originalModule,
    getOrCreateCatalog: jest.fn(),
    patchPolicy: jest.fn(),
    patchSubsidy: jest.fn(),
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
    patch: jest.fn(() => Promise.resolve({
      uuid: 'test-uuid',
    })),
  })),
}));

const SaveEditsButtonWrapper = ({
  value = hydratedInitialState,
}) => (
  <ProvisioningContext value={value}>
    <SaveEditsButton />
  </ProvisioningContext>
);

global.scrollTo = jest.fn();

describe('Save edits button', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  const sampleDataSet = [
    { sampleMultiplePolicyFormData },
    { sampleSinglePolicyPredefinedCatalogQueryFormData },
    { sampleSinglePolicyCustomCatalogQueryFormData },
  ];
  it('renders', async () => {
    renderWithRouter(<SaveEditsButtonWrapper />);
    expect(screen.getByText(SAVE_BUTTON.submit)).toBeTruthy();
  });
  it('calls handleSubmit error state when clicked with no data', async () => {
    renderWithRouter(<SaveEditsButtonWrapper />);

    const submitButton = screen.getByText(SAVE_BUTTON.submit);
    fireEvent.click(submitButton);

    await waitFor(() => expect(screen.getByText(SAVE_BUTTON.error)).toBeTruthy());
  });
  for (let i = 0; i < sampleDataSet.length; i++) {
    it(`calls handleSubmit complete state when clicked with ${Object.keys(sampleDataSet[i])} data`, async () => {
      getOrCreateCatalog.mockResolvedValue({ uuid: 'test-uuid' });
      patchSubsidy.mockResolvedValue({ uuid: 'test-uuid' });
      patchPolicy.mockResolvedValue({ uuid: 'test-uuid' });
      const value = {
        ...hydratedInitialState,
        formData: sampleDataSet[i][Object.keys(sampleDataSet[i])],
      };
      renderWithRouter(<SaveEditsButtonWrapper value={value} />);

      const submitButton = screen.getByText(SAVE_BUTTON.submit);
      fireEvent.click(submitButton);

      await waitFor(() => expect(screen.getByText(SAVE_BUTTON.success)).toBeTruthy());
    });
  }
  it('confirming rejected catalog update handles error via API', async () => {
    const error = new Error('Internal Server Error');
    error.customAttributes = {
      httpErrorStatus: 500,
    };
    getOrCreateCatalog.mockRejectedValue(error);
    const value = {
      ...hydratedInitialState,
      formData: sampleDataSet[0][Object.keys(sampleDataSet[0])],
    };
    renderWithRouter(<SaveEditsButtonWrapper value={value} />);

    const submitButton = screen.getByText(SAVE_BUTTON.submit);
    fireEvent.click(submitButton);

    await waitFor(() => expect(screen.getByText(SAVE_BUTTON.error)).toBeTruthy());
  });
  it('confirming rejected subsidy update handles error via API', async () => {
    const error = new Error('Internal Server Error');
    error.customAttributes = {
      httpErrorStatus: 500,
    };
    getOrCreateCatalog.mockResolvedValue({ uuid: 'test-catalog-uuid' });
    patchSubsidy.mockRejectedValue(error);
    const value = {
      ...hydratedInitialState,
      formData: sampleDataSet[0][Object.keys(sampleDataSet[0])],
    };
    renderWithRouter(<SaveEditsButtonWrapper value={value} />);

    const submitButton = screen.getByText(SAVE_BUTTON.submit);
    fireEvent.click(submitButton);

    await waitFor(() => expect(screen.getByText(SAVE_BUTTON.error)).toBeTruthy());
  });
  it('confirming rejected policy update handles error via API', async () => {
    const error = new Error('Internal Server Error');
    error.customAttributes = {
      httpErrorStatus: 500,
    };
    getOrCreateCatalog.mockResolvedValue({ data: { uuid: 'test-catalog-uuid' } });
    patchSubsidy.mockResolvedValue({ uuid: 'test-subsidy-uuid' });
    patchPolicy.mockRejectedValue(error);

    const value = {
      ...hydratedInitialState,
      formData: sampleDataSet[0][Object.keys(sampleDataSet[0])],
    };
    renderWithRouter(<SaveEditsButtonWrapper value={value} />);

    const submitButton = screen.getByText(SAVE_BUTTON.submit);
    fireEvent.click(submitButton);

    await waitFor(() => expect(screen.getByText(SAVE_BUTTON.error)).toBeTruthy());
  });
  it('failed data validation code path', async () => {
    const value = {
      ...hydratedInitialState,
      formData: sampleSingleEmptyData,
    };

    renderWithRouter(<SaveEditsButtonWrapper value={value} />);
    const submitButton = screen.getByText(SAVE_BUTTON.submit);
    await waitFor(() => fireEvent.click(submitButton));
    expect(screen.getByText(SAVE_BUTTON.error)).toBeTruthy();
  });
});
