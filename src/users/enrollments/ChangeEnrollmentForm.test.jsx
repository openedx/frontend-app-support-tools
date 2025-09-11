import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  cleanup,
} from '@testing-library/react';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import * as api from '../data/api';
import ChangeEnrollmentForm from './ChangeEnrollmentForm';
import UserMessagesProvider from '../../userMessages/UserMessagesProvider';
import { changeEnrollmentFormData } from '../data/test/enrollments';
import UserMessagesContext from '../../userMessages/UserMessagesContext';

jest.mock('../../userMessages/UserMessagesProvider', () => {
  const originalModule = jest.requireActual('../../userMessages/UserMessagesProvider');
  return {
    __esModule: true,
    ...originalModule,
    useUserMessages: jest.fn(),
  };
});

jest.mock('../data/api', () => ({
  patchEnrollment: jest.fn(),
}));

const changeHandlerMock = jest.fn();

const EnrollmentFormWrapper = (props) => (
  <IntlProvider locale="en">
    <UserMessagesProvider>
      <ChangeEnrollmentForm {...props} changeHandler={changeHandlerMock} />
    </UserMessagesProvider>
  </IntlProvider>
);

describe('Enrollment Change form', () => {
  afterEach(() => {
    jest.restoreAllMocks();
    cleanup();
    changeHandlerMock.mockClear();
    api.patchEnrollment.mockClear();
  });

  it('Default form rendering', () => {
    render(<EnrollmentFormWrapper {...changeEnrollmentFormData} />);
    expect(screen.getByText(/change enrollment/i)).toBeInTheDocument();
    expect(document.getElementById('mode')).toBeInTheDocument();
    expect(document.getElementById('reason')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Explanation')).toBeInTheDocument();
    fireEvent.click(screen.getByText(/close/i));
  });

  describe('Form submission', () => {
    it('Successful form submission', async () => {
      api.patchEnrollment.mockResolvedValueOnce({});
      render(<EnrollmentFormWrapper {...changeEnrollmentFormData} />);

      fireEvent.change(document.getElementById('mode'), { target: { value: 'verified' } });
      fireEvent.change(document.getElementById('reason'), { target: { value: 'other' } });
      fireEvent.change(screen.getByPlaceholderText('Explanation'), { target: { value: 'test mode change' } });

      fireEvent.click(screen.getByText(/submit/i));

      await waitFor(() => {
        expect(changeHandlerMock).toHaveBeenCalledTimes(1);
      });

      expect(api.patchEnrollment).toHaveBeenCalledTimes(1);
    });

    it('Unsuccessful form submission', async () => {
      const addMock = jest.fn();
      const clearMock = jest.fn();
      const mockMessages = [];

      api.patchEnrollment.mockResolvedValueOnce({
        errors: [
          {
            text: 'Error changing enrollment',
            type: 'danger',
          },
        ],
      });

      const MockUserMessagesContext = ({ children }) => {
        const contextValue = useMemo(
          () => ({
            add: addMock,
            clear: clearMock,
            messages: mockMessages,
          }),
          [],
        );

        return (
          <UserMessagesContext.Provider value={contextValue}>
            {children}
          </UserMessagesContext.Provider>
        );
      };

      MockUserMessagesContext.propTypes = {
        children: PropTypes.node.isRequired,
      };

      render(
        <IntlProvider locale="en">
          <MockUserMessagesContext>
            <ChangeEnrollmentForm
              {...changeEnrollmentFormData}
              changeHandler={changeHandlerMock}
              closeHandler={jest.fn()}
              user="test-user"
            />
          </MockUserMessagesContext>
        </IntlProvider>,
      );

      fireEvent.change(document.getElementById('mode'), { target: { value: 'verified' } });
      fireEvent.change(document.getElementById('reason'), { target: { value: 'other' } });
      fireEvent.change(screen.getByPlaceholderText('Explanation'), { target: { value: 'test change' } });

      fireEvent.click(screen.getByText(/submit/i));

      await waitFor(() => expect(api.patchEnrollment).toHaveBeenCalledTimes(1));

      await waitFor(() => {
        expect(addMock).toHaveBeenCalledWith(
          expect.objectContaining({
            text: 'Error changing enrollment',
            type: 'danger',
          }),
        );
      });

      expect(changeHandlerMock).not.toHaveBeenCalled();
    });
  });
});
