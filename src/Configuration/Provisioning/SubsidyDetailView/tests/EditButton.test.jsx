import '@testing-library/jest-dom/extend-expect';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithRouter } from '@edx/frontend-enterprise-utils';
import EditButton from '../EditButton';
import PROVISIONING_PAGE_TEXT from '../../data/constants';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('Edit button', () => {
  it('renders the button calls history.push on click ', async () => {
    const { FORM: { EDIT_BUTTON } } = PROVISIONING_PAGE_TEXT;
    renderWithRouter(<EditButton />);

    const button = screen.getByRole('button', {
      name: EDIT_BUTTON.description,
    });
    expect(button).toBeInTheDocument();
    userEvent.click(button);
    await waitFor(() => expect(mockNavigate).toBeCalledTimes(1));
    expect(mockNavigate).toHaveBeenCalledWith('/enterprise-configuration/learner-credit/undefined/edit');
  });
});
