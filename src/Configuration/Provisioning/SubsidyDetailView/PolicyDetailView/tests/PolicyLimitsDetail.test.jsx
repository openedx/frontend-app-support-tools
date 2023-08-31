import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import PolicyLimitsDetail from '../PolicyLimitsDetail';

describe('PolicyLimitsDetail', () => {
  it('renders the per learner limit amount if not null', () => {
    const mockPerLearnerLimit = 1000;
    render(<PolicyLimitsDetail perLearnerLimit={mockPerLearnerLimit} />);
    expect(screen.getByText('Define limits')).toBeInTheDocument();
    expect(screen.getByText('Per learner spend limit ($)')).toBeInTheDocument();
    expect(screen.getByText('$10')).toBeInTheDocument();
  });

  it('does not render the per learner limit amount if null', () => {
    const mockPerLearnerLimit = null;
    render(<PolicyLimitsDetail perLearnerLimit={mockPerLearnerLimit} />);
    expect(screen.getByText('No, first come first serve')).toBeInTheDocument();
    expect(screen.queryByText('Define limits')).toBeNull();
    expect(screen.queryByText('Per learner spend limit ($)')).toBeNull();
  });
});
