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

  describe('course team page behaviors (unsaved changes modal)', () => {
    beforeEach(() => {
      sessionStorage.clear();
    });

    it('opens modal instead of searching when unsaved changes exist', () => {
      const searchHandler = jest.fn();
      const username = 'tester';
      sessionStorage.setItem(`${username}hasUnsavedChanges`, 'true');

      const ctmWrapper = mount(intlProviderWrapper(
        <UserSearch userIdentifier="foo" searchHandler={searchHandler} isOnCourseTeamPage username={username} />,
      ));

      ctmWrapper.find("input[name='userIdentifier']").instance().value = 'nextQuery';
      ctmWrapper.find('button').simulate('click');

      expect(searchHandler).not.toHaveBeenCalled();
      const modal = ctmWrapper.find('CustomLeaveModalPopup');
      expect(modal.prop('isOpen')).toBe(true);
    });

    it('confirming modal proceeds with search and clears unsaved changes flag', () => {
      const searchHandler = jest.fn();
      const username = 'tester2';
      sessionStorage.setItem(`${username}hasUnsavedChanges`, 'true');

      const ctmWrapper = mount(intlProviderWrapper(
        <UserSearch userIdentifier="foo" searchHandler={searchHandler} isOnCourseTeamPage username={username} />,
      ));

      ctmWrapper.find("input[name='userIdentifier']").instance().value = 'confirmedQuery';
      ctmWrapper.find('button').simulate('click');

      const modal = ctmWrapper.find('CustomLeaveModalPopup');
      modal.prop('onConfirm')();
      ctmWrapper.update();

      expect(searchHandler).toHaveBeenCalledWith('confirmedQuery');
      expect(sessionStorage.getItem(`${username}hasUnsavedChanges`)).toBe('false');
      expect(ctmWrapper.find('CustomLeaveModalPopup').prop('isOpen')).toBe(false);
    });

    it('canceling modal closes it without searching and keeps flag intact', () => {
      const searchHandler = jest.fn();
      const username = 'tester3';
      sessionStorage.setItem(`${username}hasUnsavedChanges`, 'true');

      const ctmWrapper = mount(intlProviderWrapper(
        <UserSearch userIdentifier="foo" searchHandler={searchHandler} isOnCourseTeamPage username={username} />,
      ));

      ctmWrapper.find('button').simulate('click');

      const modal = ctmWrapper.find('CustomLeaveModalPopup');
      modal.prop('onCancel')();
      ctmWrapper.update();

      expect(searchHandler).not.toHaveBeenCalled();
      expect(ctmWrapper.find('CustomLeaveModalPopup').prop('isOpen')).toBe(false);
      expect(sessionStorage.getItem(`${username}hasUnsavedChanges`)).toBe('true');
    });

    it('searches immediately when no unsaved changes exist', () => {
      const searchHandler = jest.fn();
      const username = 'tester4';
      sessionStorage.setItem(`${username}hasUnsavedChanges`, 'false');

      const ctmWrapper = mount(intlProviderWrapper(
        <UserSearch userIdentifier="foo" searchHandler={searchHandler} isOnCourseTeamPage username={username} />,
      ));

      ctmWrapper.find("input[name='userIdentifier']").instance().value = 'directQuery';
      ctmWrapper.find('button').simulate('click');

      expect(searchHandler).toHaveBeenCalledWith('directQuery');
      expect(ctmWrapper.find('CustomLeaveModalPopup').prop('isOpen')).toBe(false);
    });
  });
});
