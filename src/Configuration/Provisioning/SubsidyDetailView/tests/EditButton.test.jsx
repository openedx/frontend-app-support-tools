import '@testing-library/jest-dom/extend-expect';
import { screen, waitFor } from '@testing-library/react';
import { Router } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { renderWithRouter } from '@edx/frontend-enterprise-utils';
import EditButton from '../EditButton';
import PROVISIONING_PAGE_TEXT from '../../data/constants';

const mockHistoryPush = jest.fn();
const historyMock = {
  push: mockHistoryPush,
  location: jest.fn(),
  listen: jest.fn(),
  replace: jest.fn(),
};

describe('Edit button', () => {
  it('renders the button calls history.push on click ', async () => {
    const { FORM: { EDIT_BUTTON } } = PROVISIONING_PAGE_TEXT;
    renderWithRouter(
      <Router history={historyMock}>
        <EditButton />
      </Router>,
    );

    const button = screen.getByRole('button', {
      name: EDIT_BUTTON.description,
    });
    expect(button).toBeInTheDocument();
    userEvent.click(button);
    await waitFor(() => expect(mockHistoryPush).toBeCalledTimes(1));
    expect(mockHistoryPush).toHaveBeenCalledWith('/enterprise-configuration/learner-credit/undefined/edit');
  });
});
