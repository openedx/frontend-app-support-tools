import { mount } from 'enzyme';
import React from 'react';
import PropTypes from 'prop-types';
import { MemoryRouter } from 'react-router-dom';
import { history } from '@edx/frontend-platform';
import { waitForComponentToPaint } from '../setupTest';
import FeatureBasedEnrollmentIndexPage from './FeatureBasedEnrollmentIndexPage';
import UserMessagesProvider from '../userMessages/UserMessagesProvider';
import { fbeEnabledResponse } from './data/test/featureBasedEnrollment';

import * as api from './data/api';

const FeatureBasedEnrollmentIndexPageWrapper = ({ searchQuery }) => (
  <MemoryRouter initialEntries={[`/feature_based_enrollments${searchQuery}`]}>
    <UserMessagesProvider>
      <FeatureBasedEnrollmentIndexPage />
    </UserMessagesProvider>
  </MemoryRouter>
);

FeatureBasedEnrollmentIndexPageWrapper.propTypes = {
  searchQuery: PropTypes.string,
};

FeatureBasedEnrollmentIndexPageWrapper.defaultProps = {
  searchQuery: '',
};

describe('Feature Based Enrollment Index Page', () => {
  let wrapper; let apiMock;
  const courseId = 'course-v1:testX+test123+2030';

  afterEach(() => {
    if (apiMock) {
      apiMock.mockReset();
    }
  });
  it('default page render', async () => {
    wrapper = mount(<FeatureBasedEnrollmentIndexPageWrapper />);

    const courseIdInput = wrapper.find('input[name="courseId"]');
    const searchButton = wrapper.find('button.btn-primary');

    expect(courseIdInput.prop('defaultValue')).toEqual(undefined);
    expect(searchButton.text()).toEqual('Search');
  });

  it('default page render with query param course id', async () => {
    apiMock = jest.spyOn(api, 'default').mockImplementationOnce(() => Promise.resolve({}));
    wrapper = mount(<FeatureBasedEnrollmentIndexPageWrapper searchQuery={`?course_id=${courseId}`} />);
    await waitForComponentToPaint(wrapper);

    const courseIdInput = wrapper.find('input[name="courseId"]');
    const searchButton = wrapper.find('button.btn-primary');

    expect(courseIdInput.prop('defaultValue')).toEqual(courseId);
    expect(searchButton.text()).toEqual('Search');
  });

  it('valid search value', async () => {
    apiMock = jest.spyOn(api, 'default').mockImplementationOnce(() => Promise.resolve(fbeEnabledResponse));
    history.push = jest.fn();

    wrapper = mount(<FeatureBasedEnrollmentIndexPageWrapper />);

    wrapper.find('input[name="courseId"]').instance().value = courseId;
    wrapper.find('button.btn-primary').simulate('click');

    await waitForComponentToPaint(wrapper);
    expect(apiMock).toHaveBeenCalledTimes(1);
    expect(wrapper.find('Card')).toHaveLength(2);
    expect(history.push).toHaveBeenCalledWith(`/feature_based_enrollments/?course_id=${courseId}`);

    history.push.mockReset();
  });

  it('api call made on each click', async () => {
    apiMock = jest.spyOn(api, 'default').mockImplementation(() => Promise.resolve(fbeEnabledResponse));
    history.push = jest.fn();

    wrapper = mount(<FeatureBasedEnrollmentIndexPageWrapper />);

    wrapper.find('input[name="courseId"]').instance().value = courseId;
    wrapper.find('button.btn-primary').simulate('click');

    await waitForComponentToPaint(wrapper);
    expect(apiMock).toHaveBeenCalledTimes(1);

    wrapper.find('button.btn-primary').simulate('click');
    await waitForComponentToPaint(wrapper);
    expect(apiMock).toHaveBeenCalledTimes(2);

    history.push.mockReset();
  });

  it('empty search value does not yield anything', async () => {
    apiMock = jest.spyOn(api, 'default').mockImplementationOnce(() => Promise.resolve(fbeEnabledResponse));
    history.replace = jest.fn();
    wrapper = mount(<FeatureBasedEnrollmentIndexPageWrapper />);

    wrapper.find('input[name="courseId"]').instance().value = '';
    wrapper.find('button.btn-primary').simulate('click');

    await waitForComponentToPaint(wrapper);
    expect(apiMock).toHaveBeenCalledTimes(0);
    expect(wrapper.find('Card')).toHaveLength(0);
    expect(history.replace).toHaveBeenCalledWith('/feature_based_enrollments');

    history.replace.mockReset();
  });

  it('Invalid search value', async () => {
    apiMock = jest.spyOn(api, 'default').mockImplementationOnce(() => Promise.resolve(fbeEnabledResponse));
    history.replace = jest.fn();
    wrapper = mount(<FeatureBasedEnrollmentIndexPageWrapper />);

    wrapper.find('input[name="courseId"]').instance().value = 'invalid-value';
    wrapper.find('button.btn-primary').simulate('click');

    await waitForComponentToPaint(wrapper);
    expect(apiMock).toHaveBeenCalledTimes(0);
    expect(wrapper.find('Card')).toHaveLength(0);
    expect(wrapper.find('.alert').text()).toEqual('Supplied course ID "invalid-value" is either invalid or incorrect.');
    expect(history.replace).toHaveBeenCalledWith('/feature_based_enrollments');

    history.replace.mockReset();
  });
});
