import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PolicyDescription from '../PolicyDescription';

const mockDescription = 'I want to be the very best';

describe('PolicyDescription', () => {
  it('renders the component', () => {
    render(<PolicyDescription description={mockDescription} />);
    expect(screen.getByText('I want to be the very best')).toBeInTheDocument();
  });
});
