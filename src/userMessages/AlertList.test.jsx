import React from 'react';
import PropTypes from 'prop-types';
import { render, screen, fireEvent } from '@testing-library/react';
import AlertList from './AlertList';
import UserMessagesContext from './UserMessagesContext';

const MockAlert = ({ onDismiss, children }) => (
  <div>
    <span>{children}</span>
    <button type="button" onClick={onDismiss}>
      Dismiss
    </button>
  </div>
);

MockAlert.propTypes = {
  onDismiss: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

describe('AlertList', () => {
  const mockRemove = jest.fn();
  const mockSetIsDismissed = jest.fn();

  const renderWithContext = (props = {}) => {
    const defaultMessages = [
      {
        id: '1',
        code: 'test',
        type: 'info',
        text: 'Test alert',
        dismissible: true,
        topic: 'general',
      },
    ];

    return render(
      <UserMessagesContext.Provider value={{ remove: mockRemove, messages: defaultMessages }}>
        <AlertList
          customAlerts={{ test: MockAlert }}
          isDismissed={false}
          setIsDismissed={mockSetIsDismissed}
          {...props}
        />
      </UserMessagesContext.Provider>,
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls remove and setIsDismissed on dismiss', () => {
    renderWithContext();

    fireEvent.click(screen.getByText('Dismiss'));

    expect(mockRemove).toHaveBeenCalledWith('1');
    expect(mockSetIsDismissed).toHaveBeenCalledWith(true);
  });

  it('does not call setIsDismissed if already dismissed', () => {
    renderWithContext({ isDismissed: true });

    fireEvent.click(screen.getByText('Dismiss'));

    expect(mockRemove).toHaveBeenCalledWith('1');
    expect(mockSetIsDismissed).not.toHaveBeenCalled();
  });
});
