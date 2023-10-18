import { render, screen } from '@testing-library/react';
import ConfigurationPage from '../ConfigurationPage';
import ROUTES from '../../data/constants/routes';
import { titleCase } from '../../utils';
import CONFIGURATION_PAGE_TEXT from '../data/constants';

const { CONFIGURATION: { SUB_DIRECTORY } } = ROUTES;

describe('ConfigurationPage', () => {
  it('renders', () => {
    render(<ConfigurationPage />);
    expect(screen.getByText(CONFIGURATION_PAGE_TEXT.HEADER)).toBeTruthy();
  });
  it('renders links to subdirectories', () => {
    render(<ConfigurationPage />);
    Object.keys(SUB_DIRECTORY).forEach((route) => {
      expect(screen.getByText(titleCase(route))).toBeTruthy();
    });
  });
});
