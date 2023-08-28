import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import PolicyDetailHeader from '../PolicyDetailHeader';

describe('PolicyHeader', () => {
  it('renders the component with Budget detail header if policies length is 1', () => {
    const mockProps = {
      accountType: 'Executive Education budget',
      policiesLength: 1,
    };

    render(<PolicyDetailHeader {...mockProps} />);
    expect(screen.getByText('Budget')).toBeInTheDocument();
    expect(screen.queryByText('Executive Education')).toBeNull();
  });

  it('renders Executive Education if policies length is greater than 1', () => {
    const mockProps = {
      accountType: 'Executive Education budget',
      policiesLength: 2,
    };

    render(<PolicyDetailHeader {...mockProps} />);
    expect(screen.getByText('Executive Education budget')).toBeInTheDocument();
    expect(screen.queryByText('Open Courses budget')).toBeNull();
  });
});
