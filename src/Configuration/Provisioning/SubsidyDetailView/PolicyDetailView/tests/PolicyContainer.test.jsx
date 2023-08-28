import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import PolicyContainer from '../PolicyContainer';

const mockData = {
  subsidy: {
    title: 'TestTest',
  },
  policies: [{
    catalog_uuid: '69035754-fa48-4519-92d8-a723ae0f6e58',
    spend_limit: 10000,
    per_learner_spend_limit: 1000,
    description: 'I want to be the very best',
  }],
  catalogs: [{
    title: '4a67c952-8eb1-44ba-9ab3-2faa5d0905de - Open Courses budget',
    uuid: '69035754-fa48-4519-92d8-a723ae0f6e58',
  }],
};

describe('PolicyContainer', () => {
  it('renders the component wih details', () => {
    render(<PolicyContainer data={mockData} />);
    expect(screen.getByText('Budget')).toBeInTheDocument();
    expect(screen.getByText('Budget details')).toBeInTheDocument();
    expect(screen.getByText('TestTest - Open Courses budget')).toBeInTheDocument();
    expect(screen.getByText('Create learner spend limits?')).toBeInTheDocument();
    expect(screen.getByText('Per learner spend limit ($)')).toBeInTheDocument();
    expect(screen.getByText('$100')).toBeInTheDocument();
    expect(screen.getByText('$10')).toBeInTheDocument();
  });
});
