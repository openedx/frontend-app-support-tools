import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import CopyShowHyperlinks from './CopyShowHyperLinks';

describe('Copy Show Hyperlinks', () => {
  let props;
  let wrapper;
  const text = 'value1234567890';

  beforeEach(() => {
    props = {
      text,
    };
    const { container } = render(<IntlProvider locale="en"><CopyShowHyperlinks {...props} /></IntlProvider>);
    wrapper = container;
  });
  it('Text Value', () => {
    const copy = wrapper.querySelectorAll('a')[0];
    const show = wrapper.querySelectorAll('a')[1];

    expect(copy.textContent).toEqual('Copy ');
    expect(show.textContent).toEqual('Show');
    expect(wrapper.textContent).toEqual('Copy Show');
  });
  it('Click Copy', () => {
    Object.assign(navigator, {
      clipboard: {
        writeText: () => {},
      },
    });
    jest.spyOn(navigator.clipboard, 'writeText');
    const copyLink = wrapper.querySelectorAll('a')[0];
    fireEvent.click((copyLink));

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(text);
    expect(copyLink.textContent).toEqual('Copy\u2713');
    setInterval(() => expect(copyLink.text()).toEqual('Copy '), 3000);
  });
  it('Click Show', () => {
    window.alert = jest.fn();
    const showLink = wrapper.querySelectorAll('a')[1];
    fireEvent.click(showLink);

    expect(window.alert).toHaveBeenCalledWith(text);
    window.alert.mockClear();
  });
});
