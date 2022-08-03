import { mount } from 'enzyme';
import React from 'react';
import renderer from 'react-test-renderer';
import UserSearch from './UserSearch';

describe('User Search Page', () => {
  let props;
  let wrapper;

  beforeEach(() => {
    props = { userIdentifier: '', searchHandler: jest.fn() };
    wrapper = mount(<UserSearch {...props} />);
  });

  describe('renders correctly', () => {
    it('with correct user identifier', () => {
      expect(wrapper.find('input').prop('defaultValue')).toEqual(
        props.userIdentifier,
      );
    });
    it('with correct default user identifier', () => {
      delete props.userIdentifier;
      const userSearchwrapper = mount(<UserSearch {...props} />);

      expect(userSearchwrapper.find('input').prop('defaultValue')).toEqual('');
    });
    it('with submit button', () => {
      expect(wrapper.find('button')).toHaveLength(1);
      expect(wrapper.find('button').text()).toEqual('Search');
    });

    it('when submit button is clicked', () => {
      const searchProps = { userIdentifier: 'staff', searchHandler: jest.fn() };
      const userSearchwrapper = mount(<UserSearch {...searchProps} />);

      userSearchwrapper.find('button').simulate('click');

      expect(searchProps.searchHandler).toHaveBeenCalledWith(
        searchProps.userIdentifier,
      );
    });

    it('matches snapshot', () => {
      const tree = renderer.create(wrapper).toJSON();

      expect(tree).toMatchSnapshot();
    });
  });
});
