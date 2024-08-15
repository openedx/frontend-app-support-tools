import '@testing-library/jest-dom/extend-expect';
import { screen, render } from '@testing-library/react';
import CustomerDetail from '../CustomerDetail';

const mockProps = {
  enterpriseCustomer: 'Ash Ketchum',
  financialIdentifier: '00k433434',
  uuid: '12345',
};

describe('CustomerDetail', () => {
  it('renders component with enterprise customer name, financial id, and uuid', () => {
    render(<CustomerDetail {...mockProps} />);
    expect(screen.getByText('Enterprise Customer / UUID')).toBeInTheDocument();
    expect(screen.getByText('Ash Ketchum / 12345')).toBeInTheDocument();
    expect(screen.getByText('Opportunity Product')).toBeInTheDocument();
    expect(screen.getByText('00k433434')).toBeInTheDocument();
  });
});
