/* eslint-disable react/prop-types */
import { renderWithRouter } from '@edx/frontend-enterprise-utils';
import { fireEvent, screen } from '@testing-library/react';
import { Router } from 'react-router-dom';
import ProvisioningFormSubmissionButton from '../ProvisioningFormSubmissionButton';
import PROVISIONING_PAGE_TEXT from '../../data/constants';
import { ProvisioningContext, initialStateValue } from '../../../testData';
import ROUTES from '../../../../data/constants/routes';

const { CONFIGURATION: { SUB_DIRECTORY: { PROVISIONING } } } = ROUTES;
const useHistoryPush = jest.fn();
const historyMock = { push: useHistoryPush, location: {}, listen: jest.fn() };

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
  it('renders', () => {
    renderWithRouter(<ProvisioningFormSubmissionButtonWrapper />);

    expect(screen.getByText(BUTTON.submit)).toBeTruthy();
    expect(screen.getByText(BUTTON.cancel)).toBeTruthy();
  });
  it('calls handleSubmit when clicked', () => {
    renderWithRouter(<ProvisioningFormSubmissionButtonWrapper />);

    const submitButton = screen.getByText(BUTTON.submit);
    fireEvent.click(submitButton);

    expect(useHistoryPush).toHaveBeenCalledWith(`${PROVISIONING.HOME}`);
  });
  it('calls handleCancel when clicked', () => {
    renderWithRouter(<ProvisioningFormSubmissionButtonWrapper />);

    const cancelButton = screen.getByText(BUTTON.cancel);
    fireEvent.click(cancelButton);

    expect(useHistoryPush).toHaveBeenCalledWith(`${PROVISIONING.HOME}`);
  });
});
