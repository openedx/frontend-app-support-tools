import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import UserSearch from './UserSearch';

describe('User Search Page', () => {
  let props;

  beforeEach(() => {
    props = { userIdentifier: '', searchHandler: jest.fn() };
  });

  describe('renders correctly', () => {
    it('with correct user identifier', () => {
      render(<UserSearch {...props} />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveValue(props.userIdentifier);
    });

    it('with correct default user identifier', () => {
      delete props.userIdentifier;
      render(<UserSearch {...props} />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveValue('');
    });

    it('with submit button', () => {
      render(<UserSearch {...props} />);
      const button = screen.getByRole('button', { name: /search/i });
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent('Search');
    });

    it('when submit button is clicked', () => {
      const searchProps = { userIdentifier: 'staff', searchHandler: jest.fn() };
      render(<UserSearch {...searchProps} />);

      const button = screen.getByRole('button', { name: /search/i });
      fireEvent.click(button);

      expect(searchProps.searchHandler).toHaveBeenCalledWith(
        searchProps.userIdentifier,
      );
    });

    it('matches snapshot', () => {
      const { asFragment } = render(<UserSearch {...props} />);
      expect(asFragment()).toMatchSnapshot();
    });
  });
});
