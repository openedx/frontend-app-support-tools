import { mount } from 'enzyme';
import React from 'react';
import CopyShowHyperlinks from './CopyShowHyperLinks';

describe('Copy Show Hyperlinks', () => {
  let props;
  let wrapper;
  const text = 'value1234567890';

  beforeEach(() => {
    props = {
      text,
    };
    wrapper = mount(<CopyShowHyperlinks {...props} />);
  });
  it('Text Value', () => {
    const copy = wrapper.find('a').at(0);
    const show = wrapper.find('a').at(1);

    expect(copy.text()).toEqual('Copy ');
    expect(show.text()).toEqual('Show ');
    expect(wrapper.text()).toEqual('Copy Show ');
  });
  it('Click Copy', () => {
    Object.assign(navigator, {
      clipboard: {
        writeText: () => {},
      },
    });
    jest.spyOn(navigator.clipboard, 'writeText');
    const copyLink = wrapper.find('a').at(0);
    copyLink.simulate('click');

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(text);
    expect(copyLink.text()).toEqual('Copy\u2713 ');
    setInterval(() => expect(copyLink.text()).toEqual('Copy '), 3000);
  });
  it('Click Show', () => {
    window.alert = jest.fn();
    const showLink = wrapper.find('a').at(1);
    showLink.simulate('click');

    expect(window.alert).toHaveBeenCalledWith(text);
    window.alert.mockClear();
  });
});
