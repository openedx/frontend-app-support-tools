import { mount } from 'enzyme';
import React from 'react';
import renderer from 'react-test-renderer';
import UserSearch from './UserSearch';
import { intlProviderWrapper } from '../CourseTeamManagement/CoursesTable.test';

describe('User Search Page', () => {
  let props;
  let wrapper;

  beforeEach(() => {
    props = { userIdentifier: '', searchHandler: jest.fn() };
    wrapper = mount(intlProviderWrapper(<UserSearch {...props} />));
  });

  describe('renders correctly', () => {
    it('with correct user identifier', () => {
      expect(wrapper.find('input').prop('defaultValue')).toEqual(
        props.userIdentifier,
      );
    });
    it('with correct default user identifier', () => {
      delete props.userIdentifier;
      const userSearchwrapper = mount(intlProviderWrapper(<UserSearch {...props} />));

      expect(userSearchwrapper.find('input').prop('defaultValue')).toEqual('');
    });
    it('with submit button', () => {
      expect(wrapper.find('button')).toHaveLength(1);
      expect(wrapper.find('button').text()).toEqual('Search');
    });

    it('when submit button is clicked', () => {
      const searchProps = { userIdentifier: 'staff', searchHandler: jest.fn() };
      const userSearchwrapper = mount(intlProviderWrapper(<UserSearch {...searchProps} />));

      userSearchwrapper.find('button').simulate('click');

      expect(searchProps.searchHandler).toHaveBeenCalledWith(
        searchProps.userIdentifier,
      );
    });

    it('matches snapshot', () => {
      const tree = renderer.create(wrapper).toJSON();

      expect(tree).toMatchSnapshot();
    });
    it('matches snapshot for course team page', () => {
      const courseTeamWrapper = renderer
        .create(intlProviderWrapper(<UserSearch {...props} isOnCourseTeamPage />))
        .toJSON();
      expect(courseTeamWrapper).toMatchSnapshot();
    });
  });
});
