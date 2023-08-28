import '@testing-library/jest-dom/extend-expect';
import { screen, render } from '@testing-library/react';
import TermDetail from '../TermDetail';

const mockProps = {
  startDate: '2023-06-20T00:00:00Z',
  endDate: '2023-06-22T00:00:00Z',
};

describe('TermDetail', () => {
  it('renders component', () => {
    render(<TermDetail {...mockProps} />);
    expect(screen.getByText('Term')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Plan activation tooltip' })).toBeInTheDocument();
    expect(screen.getByText('Start Date'));
    expect(screen.getByText('June 20, 2023'));
    expect(screen.getByText('End Date'));
    expect(screen.getByText('June 22, 2023'));
  });
});
