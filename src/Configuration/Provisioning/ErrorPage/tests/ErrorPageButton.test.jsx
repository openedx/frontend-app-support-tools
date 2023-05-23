import { fireEvent, screen } from '@testing-library/react';
import { renderWithRouter } from '@edx/frontend-enterprise-utils';
import { Link } from 'react-router-dom';
import ErrorPageButton from '../ErrorPageButton';

describe('<ErrorPageButton />', () => {
  it('renders the button', () => {
    const buttonText = 'Test Button Text';
    const buttonInteraction = jest.fn();
    renderWithRouter(
      <ErrorPageButton as={Link} to="/" onClick={buttonInteraction}>
        {buttonText}
      </ErrorPageButton>,
    );
    expect(screen.getByText(buttonText)).toBeTruthy();
    const button = screen.getByText(buttonText);
    fireEvent.click(button);
    expect(buttonInteraction).toHaveBeenCalledTimes(1);
  });
});
