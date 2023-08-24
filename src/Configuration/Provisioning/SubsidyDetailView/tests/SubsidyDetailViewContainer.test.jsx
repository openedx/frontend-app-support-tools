import '@testing-library/jest-dom/extend-expect';
import { screen, render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SubsidyDetailViewContainer from '../SubsidyDetailViewContainer';

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useLocation: jest.fn().mockImplementation(() => ({ pathname: '/View' })),
}));

describe('SubsidyDetailViewContainer', () => {
  it('renders component with button', () => {
    render(
      <MemoryRouter>
        <SubsidyDetailViewContainer />
      </MemoryRouter>,
    );
    expect(screen.getByText('View Learner Credit Plan')).toBeInTheDocument();
    expect(screen.getByRole('button', {
      name: 'Edit plan',
    })).toBeInTheDocument();
  });
});
