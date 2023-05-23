/* eslint-disable react/prop-types */
import { renderWithRouter } from '@edx/frontend-enterprise-utils';
import { fireEvent, screen } from '@testing-library/react';
import { useHistory } from 'react-router';
import ErrorPageContainer from '../ErrorPageContainer';
import { ERROR_PAGE_TEXT } from '../data/constants';

const ErrorPageContainerWrapper = ({
  errorMessage,
}) => {
  const history = useHistory();
  const { location } = history;
  if (errorMessage) {
    history.push(location.pathname, { errorMessage });
  }
  return (
    <ErrorPageContainer to={location.pathname} />
  );
};

describe('<ErrorPageContainerWrapper>', () => {
  it('Displays the passed error message', () => {
    renderWithRouter(<ErrorPageContainerWrapper errorMessage="Test Error Message" />);
    expect(screen.getByText('Test Error Message', { exact: false })).toBeTruthy();
  });
  it('Redirects on button click', () => {
    renderWithRouter(<ErrorPageContainerWrapper errorMessage="Test Error Message" />);
    const button = screen.getByText(ERROR_PAGE_TEXT.BUTTON);
    expect(button).toBeTruthy();
    fireEvent.click(button);
    expect(window.location.pathname).toBe('/');
  });
});
