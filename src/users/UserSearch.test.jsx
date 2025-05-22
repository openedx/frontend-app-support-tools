import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
import UserSearch from './UserSearch';

describe('User Search Page', () => {
  let props;

  describe('renders correctly', () => {
    it('with correct user identifier', async () => {
      props = { userIdentifier: '', searchHandler: jest.fn() };
      render(<UserSearch {...props} />);
      const userSearchInput = await screen.findByTestId('userSearchInput');
      expect(userSearchInput.defaultValue).toEqual(props.userIdentifier);
    });
    it('with correct default user identifier', async () => {
      props = { searchHandler: jest.fn() };
      render(<UserSearch {...props} />);
      const userSearchInput = await screen.findByTestId('userSearchInput');
      expect(userSearchInput.defaultValue).toEqual('');
    });
    it('with submit button', async () => {
      props = { userIdentifier: '', searchHandler: jest.fn() };
      render(<UserSearch {...props} />);
      const submitButton = await screen.findByTestId('userSearchSubmitButton');
      expect(submitButton).toBeInTheDocument();
      expect(submitButton.textContent).toEqual('Search');
    });

    it('when submit button is clicked', async () => {
      const searchProps = { userIdentifier: 'staff', searchHandler: jest.fn() };
      render(<UserSearch {...searchProps} />);

      const submitButton = await screen.findByTestId('userSearchSubmitButton');
      fireEvent.click(submitButton);

      expect(searchProps.searchHandler).toHaveBeenCalledWith(
        searchProps.userIdentifier,
      );
    });

    it('matches snapshot', () => {
      props = { userIdentifier: '', searchHandler: jest.fn() };
      const { container } = render(<UserSearch {...props} />);
      expect(container).toMatchSnapshot();
    });
  });
});
