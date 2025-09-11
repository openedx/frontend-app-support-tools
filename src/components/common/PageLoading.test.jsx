import React from 'react';
import { render, screen } from '@testing-library/react';
import PageLoading from './PageLoading';
import '@testing-library/jest-dom';

describe('<PageLoading />', () => {
  it('does not render screen reader message when srMessage is empty', () => {
    render(<PageLoading srMessage="" />);
    const srElement = screen.queryByText((content, element) => element?.classList.contains('sr-only'));
    expect(srElement).not.toBeInTheDocument();
  });

  it('renders expected message', () => {
    const message = 'Loading...';
    render(<PageLoading srMessage={message} />);
    const srElement = screen.getByText(message);
    expect(srElement).toBeInTheDocument();
    expect(srElement).toHaveClass('sr-only');
  });

  it('snapshot matches correctly', () => {
    const { asFragment } = render(<PageLoading srMessage="Loading" />);
    expect(asFragment()).toMatchSnapshot();
  });
});
