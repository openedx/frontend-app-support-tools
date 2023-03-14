import { screen } from '@testing-library/react';
import { renderWithRouter } from '@edx/frontend-enterprise-utils';
import ConfigurationPage from '../ConfigurationPage';
import ROUTES from '../../data/constants/routes';
import { titleCase } from '../../utils';
import CONFIGURATION_PAGE_TEXT from '../data/constants';

const { CONFIGURATION: { SUB_DIRECTORY } } = ROUTES;

const ConfigurationPageWrapper = () => (
  <ConfigurationPage />
);
describe('ConfigurationPage', () => {
  it('renders', () => {
    renderWithRouter(<ConfigurationPageWrapper />);
    expect(screen.getByText(CONFIGURATION_PAGE_TEXT.HEADER)).toBeTruthy();
  });
  it('renders links to subdirectories', () => {
    renderWithRouter(<ConfigurationPageWrapper />);
    Object.keys(SUB_DIRECTORY).forEach((route) => {
      expect(screen.getByText(titleCase(route))).toBeTruthy();
    });
  });
});
