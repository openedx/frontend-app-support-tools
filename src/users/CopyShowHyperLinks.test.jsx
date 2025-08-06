import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import CopyShowHyperlinks from './CopyShowHyperLinks';
import '@testing-library/jest-dom';

describe('Copy Show Hyperlinks', () => {
  const text = 'value1234567890';

  const renderComponent = (props = {}) => render(
    <IntlProvider locale="en">
      <CopyShowHyperlinks text={text} {...props} />
    </IntlProvider>,
  );

  it('renders Copy and Show links', () => {
    renderComponent();

    const copyLink = screen.getByText(/Copy/i);
    const showLink = screen.getByText(/Show/i);

    expect(copyLink).toBeInTheDocument();
    expect(showLink).toBeInTheDocument();
    expect(screen.getByText(/Copy/i).textContent).toMatch(/Copy/);
    expect(screen.getByText(/Show/i).textContent).toMatch(/Show/);
  });

  it('copies text to clipboard on click', async () => {
    Object.assign(navigator, {
      clipboard: {
        writeText: jest.fn(),
      },
    });

    renderComponent();

    const copyLink = screen.getByText(/Copy/i);
    fireEvent.click(copyLink);

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(text);
  });

  it('shows alert with text on click', () => {
    window.alert = jest.fn();

    renderComponent();

    const showLink = screen.getByText(/Show/i);
    fireEvent.click(showLink);

    expect(window.alert).toHaveBeenCalledWith(text);
    window.alert.mockClear();
  });
});
