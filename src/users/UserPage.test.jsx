import * as Auth from '@edx/frontend-platform/auth';
import { mount } from 'enzyme';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { MemoryRouter } from 'react-router-dom';
import renderer from 'react-test-renderer';
import { checkProps } from '../setupTest';

import * as messages from '../userMessages/messages';
import UserMessagesProvider from '../userMessages/UserMessagesProvider';
import UserPage from './UserPage';

jest.mock('@edx/frontend-platform/auth');

const UserPageWrapper = (props) => (
  <MemoryRouter>
    <UserMessagesProvider>
      <UserPage {...props} />
    </UserMessagesProvider>
  </MemoryRouter>
);

// Function to wait until the entire component is fully painted.
const waitForComponentToPaint = async (wrapper) => {
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve));
    wrapper.update();
  });
};

describe('User Page', () => {
  let location;

  beforeEach(() => {
    location = { pathname: '/users', search: '' };
  });

  describe('Checking PropTypes', () => {
    it('does not throw a warning', () => {
      const expectedProps = { location };
      const propsError = checkProps(UserPage, expectedProps);

      expect(propsError).toBeUndefined();
    });
  });
  describe('shows expected error alert', () => {
    const mockAuthResponseError = (code) => {
      Auth.getAuthenticatedHttpClient = jest.fn(() => {
        const error = new Error();
        error.customAttributes = {
          httpErrorStatus: code,
          httpErrorResponseData: JSON.stringify(''),
        };
        throw error;
      });
    };
    it('when user identifier is empty', () => {
      const emptyUsername = '';
      location.search = `?username=${emptyUsername}`;
      const wrapper = mount(<UserPageWrapper location={location} />);

      const searchInput = wrapper.find('input[name="userIdentifier"]');
      const alert = wrapper.find('.alert');

      expect(searchInput).toHaveLength(1);
      expect(alert).toHaveLength(0);
    });
    it('when user identifier is invalid', () => {
      const invalidUsername = 'invalid username';
      location.search = `?username=${invalidUsername}`;
      const wrapper = mount(<UserPageWrapper location={location} />);

      const searchInput = wrapper.find('input[name="userIdentifier"]');
      const alert = wrapper.find('.alert');

      expect(searchInput).toHaveLength(1);
      expect(searchInput.prop('defaultValue')).toEqual(invalidUsername);
      expect(alert).toHaveLength(1);
      expect(alert.text()).toEqual(messages.USER_IDENTIFIER_INVALID_ERROR);
    });
    it('when user identifier is not found', async () => {
      const validUsername = 'valid-non-existing-username';
      location.search = `?username=${validUsername}`;
      mockAuthResponseError(404);
      const expectedAlert = messages.USERNAME_IDENTIFIER_NOT_FOUND_ERROR.replace(
        '{identifier}',
        validUsername,
      );

      const wrapper = mount(<UserPageWrapper location={location} />);
      await waitForComponentToPaint(wrapper);

      const alert = wrapper.find('.alert');
      expect(alert).toHaveLength(1);
      expect(document.title).toEqual('Support Tools | edX');
      expect(alert.text()).toEqual(expectedAlert);
    });
    it('when user email is not found', async () => {
      const validEmail = 'valid-non-existing@email.com';
      location.search = `?email=${validEmail}`;
      mockAuthResponseError(404);
      const expectedAlert = messages.USER_EMAIL_IDENTIFIER_NOT_FOUND_ERROR.replace(
        '{identifier}',
        validEmail,
      );

      const wrapper = mount(<UserPageWrapper location={location} />);
      await waitForComponentToPaint(wrapper);

      const alert = wrapper.find('.alert');
      expect(alert).toHaveLength(1);
      expect(alert.text()).toEqual(expectedAlert);
    });
    it('when user email is not found', async () => {
      const validEmail = 'valid@email.com';
      location.search = `?email=${validEmail}`;
      mockAuthResponseError(500);

      const wrapper = mount(<UserPageWrapper location={location} />);
      await waitForComponentToPaint(wrapper);

      const alert = wrapper.find('.alert');
      expect(alert).toHaveLength(1);
      expect(alert.text()).toEqual(messages.UNKNOWN_API_ERROR);
    });
  });
  it('snapshot matches correctly', () => {
    const tree = renderer
      .create(<UserPageWrapper location={location} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
