import '@testing-library/jest-dom';
import { screen, render } from '@testing-library/react';
import TitleDetail from '../TitleDetail';

describe('TitleDetail', () => {
  it('renders component', () => {
    render(<TitleDetail title="Testing123" />);
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Testing123')).toBeInTheDocument();
  });
});
