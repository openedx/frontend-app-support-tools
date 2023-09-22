import '@testing-library/jest-dom/extend-expect';
import PropTypes from 'prop-types';
import { act, screen, waitFor } from '@testing-library/react';
import Router from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { renderWithRouter } from '@edx/frontend-enterprise-utils';
import CancelButton from '../CancelButton';
import PROVISIONING_PAGE_TEXT from '../../data/constants';
import { hydratedInitialState, ProvisioningContext } from '../../../testData/Provisioning/ProvisioningContextWrapper';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const CancelButtonWrapper = ({
  value = hydratedInitialState,
}) => (
  <ProvisioningContext value={value}>
    <CancelButton />
  </ProvisioningContext>
);

describe('Cancel button', () => {
  it('renders the button and opens modal when hasEdits is true ', async () => {
    const { FORM: { CANCEL } } = PROVISIONING_PAGE_TEXT;
    jest.spyOn(Router, 'useParams').mockReturnValue({ id: '0196e5c3-ba08-4798-8bf1-019d747c27bf' });
    await act(async () => renderWithRouter(
      <CancelButtonWrapper value={{ ...hydratedInitialState, hasEdits: false }} />,
    ));

    const button = screen.getByRole('button', {
      name: CANCEL.description,
    });
    expect(button).toBeInTheDocument();
    userEvent.click(button);
    await waitFor(() => expect(screen.getByText(CANCEL.MODAL.TITLE)).toBeInTheDocument());
    expect(button).toBeInTheDocument();
    expect(screen.getByText(CANCEL.MODAL.BODY)).toBeInTheDocument();
    expect(screen.getByRole('button', {
      name: CANCEL.MODAL.FOOTER.options.leave,
    })).toBeInTheDocument();
    expect(screen.getByRole('button', {
      name: CANCEL.MODAL.FOOTER.options.stay,
    })).toBeInTheDocument();
  });
  it('renders the button and navigates to view screen when hasEdits is false ', async () => {
    const { FORM: { CANCEL } } = PROVISIONING_PAGE_TEXT;
    jest.spyOn(Router, 'useParams').mockReturnValue({ id: '0196e5c3-ba08-4798-8bf1-019d747c27bf' });
    await act(async () => renderWithRouter(<CancelButtonWrapper value={hydratedInitialState} />));
    const button = screen.getByRole('button', {
      name: CANCEL.description,
    });
    expect(button).toBeInTheDocument();
    userEvent.click(button);
    await waitFor(() => expect(mockNavigate).toBeCalledTimes(1));
    expect(mockNavigate).toHaveBeenCalledWith('/enterprise-configuration/learner-credit/0196e5c3-ba08-4798-8bf1-019d747c27bf/view');
  });
});

CancelButtonWrapper.propTypes = {
  value: PropTypes.shape().isRequired,
};
