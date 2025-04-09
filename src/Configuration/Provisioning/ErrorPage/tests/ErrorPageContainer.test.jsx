/* eslint-disable react/prop-types */
import { renderWithRouter } from '@edx/frontend-enterprise-utils';
import { fireEvent, screen, cleanup } from '@testing-library/react';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import ErrorPageContainer from '../ErrorPageContainer';
import { ERROR_PAGE_TEXT } from '../data/constants';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({
    pathname: '/',
    state: {
      errorMessage: 'Test Error Message',
    },
  }),
  useNavigate: () => jest.fn(),
}));

describe('<ErrorPageContainerWrapper>', () => {
  afterEach(cleanup);
  it('Displays the passed error message', () => {
    renderWithRouter(<IntlProvider locale="en"><ErrorPageContainer to="/" /></IntlProvider>);
    expect(screen.getByText('Test Error Message', { exact: false })).toBeTruthy();
  });
  it('Redirects on button click', () => {
    renderWithRouter(<IntlProvider locale="en"><ErrorPageContainer to="/" /></IntlProvider>);
    const button = screen.getByText(ERROR_PAGE_TEXT.BUTTON);
    expect(button).toBeTruthy();
    fireEvent.click(button);
    expect(window.location.pathname).toBe('/');
  });
});
