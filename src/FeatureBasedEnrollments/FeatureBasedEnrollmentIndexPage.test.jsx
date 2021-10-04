import { mount } from 'enzyme';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { history } from '@edx/frontend-platform';
import { waitForComponentToPaint } from '../setupTest';
import FeatureBasedEnrollmentIndexPage from './FeatureBasedEnrollmentIndexPage';
import UserMessagesProvider from '../userMessages/UserMessagesProvider';
import { fbeEnabledResponse } from './data/test/featureBasedEnrollment';

import * as api from './data/api';

const FeatureBasedEnrollmentIndexPageWrapper = (props) => (
  <MemoryRouter>
    <UserMessagesProvider>
      <FeatureBasedEnrollmentIndexPage {...props} />
    </UserMessagesProvider>
  </MemoryRouter>
);

describe('Feature Based Enrollment Index Page', () => {
  let location; let wrapper;
  const courseId = 'course-v1:testX+test123+2030';

  beforeEach(() => {
    location = { pathname: '/v2/feature_based_enrollments', search: '' };
  });

  it('default page render', async () => {
    wrapper = mount(<FeatureBasedEnrollmentIndexPageWrapper location={location} />);

    const courseIdInput = wrapper.find('input[name="courseId"]');
    const searchButton = wrapper.find('button.btn-primary');

    expect(courseIdInput.prop('defaultValue')).toEqual(undefined);
    expect(searchButton.text()).toEqual('Search');
  });

  it('default page render with query param course id', async () => {
    const apiMock = jest.spyOn(api, 'default').mockImplementationOnce(() => Promise.resolve({}));
    location.search = `?course_id=${courseId}`;
    wrapper = mount(<FeatureBasedEnrollmentIndexPageWrapper location={location} />);
    await waitForComponentToPaint(wrapper);

    const courseIdInput = wrapper.find('input[name="courseId"]');
    const searchButton = wrapper.find('button.btn-primary');

    expect(courseIdInput.prop('defaultValue')).toEqual(courseId);
    expect(searchButton.text()).toEqual('Search');
    apiMock.mockReset();
  });

  it('valid search value', async () => {
    const apiMock = jest.spyOn(api, 'default').mockImplementationOnce(() => Promise.resolve(fbeEnabledResponse));
    history.push = jest.fn();

    wrapper = mount(<FeatureBasedEnrollmentIndexPageWrapper location={location} />);

    wrapper.find('input[name="courseId"]').instance().value = courseId;
    wrapper.find('button.btn-primary').simulate('click');

    await waitForComponentToPaint(wrapper);
    expect(apiMock).toHaveBeenCalledTimes(1);
    expect(wrapper.find('Card')).toHaveLength(2);
    expect(history.push).toHaveBeenCalledWith(`/v2/feature_based_enrollments/?course_id=${courseId}`);

    apiMock.mockReset();
    history.push.mockReset();
  });

  it('empty search value does not yield anything', async () => {
    const apiMock = jest.spyOn(api, 'default').mockImplementationOnce(() => Promise.resolve(fbeEnabledResponse));
    history.replace = jest.fn();
    wrapper = mount(<FeatureBasedEnrollmentIndexPageWrapper location={location} />);

    wrapper.find('input[name="courseId"]').instance().value = '';
    wrapper.find('button.btn-primary').simulate('click');

    await waitForComponentToPaint(wrapper);
    expect(apiMock).toHaveBeenCalledTimes(0);
    expect(wrapper.find('Card')).toHaveLength(0);
    expect(history.replace).toHaveBeenCalledWith('/v2/feature_based_enrollments');

    apiMock.mockReset();
    history.replace.mockReset();
  });

  it('Invalid search value', async () => {
    const apiMock = jest.spyOn(api, 'default').mockImplementationOnce(() => Promise.resolve(fbeEnabledResponse));
    history.replace = jest.fn();
    wrapper = mount(<FeatureBasedEnrollmentIndexPageWrapper location={location} />);

    wrapper.find('input[name="courseId"]').instance().value = 'invalid-value';
    wrapper.find('button.btn-primary').simulate('click');

    await waitForComponentToPaint(wrapper);
    expect(apiMock).toHaveBeenCalledTimes(0);
    expect(wrapper.find('Card')).toHaveLength(0);
    expect(wrapper.find('.alert').text()).toEqual('Supplied course ID "invalid-value" is either invalid or incorrect.');
    expect(history.replace).toHaveBeenCalledWith('/v2/feature_based_enrollments');

    apiMock.mockReset();
    history.replace.mockReset();
  });
});
