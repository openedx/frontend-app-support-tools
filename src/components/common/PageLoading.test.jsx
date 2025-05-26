import { render } from '@testing-library/react';
import React from 'react';
import PageLoading from './PageLoading';
import '@testing-library/jest-dom';

describe('<PageLoading />', () => {
  it('does not render without message', () => {
    render(<PageLoading srMessage="" />);

    expect(document.querySelector('.sr-only')).not.toBeInTheDocument();
  });
  it('renders expected message', () => {
    const message = 'Loading...';

    render(<PageLoading srMessage={message} />);
    const srElement = document.querySelector('.sr-only');

    expect(srElement).toBeInTheDocument();
    expect(srElement.textContent).toEqual(message);
  });
  it('snapshot matches correctly', () => {
    const { container } = render(<PageLoading srMessage="Loading" />);

    expect(container).toMatchSnapshot();
  });
});
