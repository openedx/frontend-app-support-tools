import { shallow } from 'enzyme';
import React from 'react';
import renderer from 'react-test-renderer';
import PageLoading from './PageLoading';

describe('<PageLoading />', () => {
  it('does not render without message', () => {
    const wrapper = shallow(<PageLoading srMessage="" />);

    expect(wrapper.find('.sr-only')).toHaveLength(0);
  });
  it('renders expected message', () => {
    const message = 'Loading...';

    const wrapper = shallow(<PageLoading srMessage={message} />);
    const srElement = wrapper.find('.sr-only');

    expect(srElement).toHaveLength(1);
    expect(srElement.text()).toEqual(message);
  });
  it('snapshot matches correctly', () => {
    const tree = renderer.create(<PageLoading srMessage="Loading" />).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
