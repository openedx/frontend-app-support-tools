import { screen } from '@testing-library/react';
import { renderWithRouter } from '@edx/frontend-enterprise-utils';
import ErrorPageButton from '../ErrorPageButton';

describe('<ErrorPageButton />', () => {
  it('renders the button', () => {
    const buttonText = 'Test Button Text';
    const buttonInteraction = jest.fn();
    renderWithRouter(
      <ErrorPageButton
        buttonText={buttonText}
        buttonInteraction={buttonInteraction}
      />,
    );
    expect(screen.getByText(buttonText)).toBeTruthy();
  });
});
