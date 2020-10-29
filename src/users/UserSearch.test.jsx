import { mount } from 'enzyme';
import React from 'react';
import renderer from 'react-test-renderer';
import { checkProps } from '../setupTest';
import UserSearch from './UserSearch';

describe('User Search Page', () => {
  let props;
  let wrapper;

  beforeEach(() => {
    props = { userIdentifier: '', searchHandler: jest.fn() };
    wrapper = mount(<UserSearch {...props} />);
  });

  describe('Checking PropTypes', () => {
    it('does not throw a warning', () => {
      const propsError = checkProps(UserSearch, props);

      expect(propsError).toBeUndefined();
    });
    it('does not throw error with undefined userIdentifier', () => {
      delete props.userIdentifier;
      const propsError = checkProps(UserSearch, props);

      expect(propsError).toBeUndefined();
    });
    it('throw error with undefined search handler', () => {
      const propsError = checkProps(UserSearch, {});

      expect(propsError).not.toBeUndefined();
      expect(propsError).toContain('Failed props type');
      expect(propsError).toContain('searchHandler');
    });
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
