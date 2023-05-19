/* eslint-disable react/prop-types */
import { renderWithRouter } from '@edx/frontend-enterprise-utils';
import { screen } from '@testing-library/react';
import ErrorPageMessage from '../ErrorPageMessage';
import { ERROR_PAGE_TEXT } from '../data/constants';

const { TITLE, SPANNED_TITLE, SUB_TITLE } = ERROR_PAGE_TEXT;
const ErrorPageMessageWrapper = ({
  message,
}) => (
  <ErrorPageMessage
    message={message}
  />
);

describe('<ErrorPageMessageWrapper>', () => {
  it('Displays the passed message', () => {
    renderWithRouter(<ErrorPageMessageWrapper message="Test Message Text" />);
    expect(screen.getByText('Test Message Text', { exact: false })).toBeTruthy();
  });
  it('Displays static message', () => {
    renderWithRouter(<ErrorPageMessageWrapper message="Test Message Text" />);

    expect(screen.getByText(TITLE, { exact: false })).toBeTruthy();
    expect(screen.getByText(SPANNED_TITLE, { exact: false })).toBeTruthy();
    expect(screen.getByText(SUB_TITLE, { exact: false })).toBeTruthy();
  });
});
