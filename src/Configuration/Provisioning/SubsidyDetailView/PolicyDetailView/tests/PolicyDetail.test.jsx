import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import PolicyDetail from '../PolicyDetail';

const mockProps = {
  displayName: 'Ash Ketchum',
  spendLimit: 10000,
};

describe('PolicyDetail', () => {
  it('renders the component and formats spend limit', () => {
    render(<PolicyDetail {...mockProps} />);
    expect(screen.getByText('Budget details')).toBeInTheDocument();
    expect(screen.getByText('Display name')).toBeInTheDocument();
    expect(screen.getByText('Ash Ketchum')).toBeInTheDocument();
    expect(screen.getByText('Budget starting balance ($)')).toBeInTheDocument();
    expect(screen.getByText('$100')).toBeInTheDocument();
    expect(screen.getByText('Not editable')).toBeTruthy();
  });
});
