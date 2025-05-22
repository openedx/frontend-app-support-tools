import { render, screen } from '@testing-library/react';
import PolicyDescription from '../PolicyDescription';
import '@testing-library/jest-dom';

const mockDescription = 'I want to be the very best';

describe('PolicyDescription', () => {
  it('renders the component', () => {
    render(<PolicyDescription description={mockDescription} />);
    expect(screen.getByText('I want to be the very best')).toBeInTheDocument();
  });
});
