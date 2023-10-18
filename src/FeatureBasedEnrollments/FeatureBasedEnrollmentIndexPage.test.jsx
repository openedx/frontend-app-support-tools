import { mount } from 'enzyme';
import React from 'react';
import PropTypes from 'prop-types';
import { MemoryRouter } from 'react-router-dom';
import { waitForComponentToPaint } from '../setupTest';
import FeatureBasedEnrollmentIndexPage from './FeatureBasedEnrollmentIndexPage';
import UserMessagesProvider from '../userMessages/UserMessagesProvider';
import { fbeEnabledResponse } from './data/test/featureBasedEnrollment';

import * as api from './data/api';

const mockedNavigator = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigator,
}));

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

  beforeEach(() => {
    jest.clearAllMocks();
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

    wrapper = mount(<FeatureBasedEnrollmentIndexPageWrapper />);

    wrapper.find('input[name="courseId"]').instance().value = courseId;
    wrapper.find('button.btn-primary').simulate('click');

    await waitForComponentToPaint(wrapper);
    expect(apiMock).toHaveBeenCalledTimes(1);
    expect(wrapper.find('Card')).toHaveLength(2);
    expect(mockedNavigator).toHaveBeenCalledWith(`/feature_based_enrollments/?course_id=${courseId}`);
  });

  it('api call made on each click', async () => {
    apiMock = jest.spyOn(api, 'default').mockImplementation(() => Promise.resolve(fbeEnabledResponse));

    wrapper = mount(<FeatureBasedEnrollmentIndexPageWrapper />);

    wrapper.find('input[name="courseId"]').instance().value = courseId;
    wrapper.find('button.btn-primary').simulate('click');

    await waitForComponentToPaint(wrapper);
    expect(apiMock).toHaveBeenCalledTimes(1);

    wrapper.find('button.btn-primary').simulate('click');
    await waitForComponentToPaint(wrapper);
    expect(apiMock).toHaveBeenCalledTimes(2);
  });

  it('empty search value does not yield anything', async () => {
    apiMock = jest.spyOn(api, 'default').mockImplementationOnce(() => Promise.resolve(fbeEnabledResponse));
    wrapper = mount(<FeatureBasedEnrollmentIndexPageWrapper />);

    wrapper.find('input[name="courseId"]').instance().value = '';
    wrapper.find('button.btn-primary').simulate('click');

    await waitForComponentToPaint(wrapper);
    expect(apiMock).toHaveBeenCalledTimes(0);
    expect(wrapper.find('Card')).toHaveLength(0);
    expect(mockedNavigator).toHaveBeenCalledWith('/feature_based_enrollments', { replace: true });
  });

  it('Invalid search value', async () => {
    apiMock = jest.spyOn(api, 'default').mockImplementationOnce(() => Promise.resolve(fbeEnabledResponse));
    wrapper = mount(<FeatureBasedEnrollmentIndexPageWrapper />);

    wrapper.find('input[name="courseId"]').instance().value = 'invalid-value';
    wrapper.find('button.btn-primary').simulate('click');

    await waitForComponentToPaint(wrapper);
    expect(apiMock).toHaveBeenCalledTimes(0);
    expect(wrapper.find('Card')).toHaveLength(0);
    expect(wrapper.find('.alert').text()).toEqual('Supplied course ID "invalid-value" is either invalid or incorrect.');
    expect(mockedNavigator).toHaveBeenCalledWith('/feature_based_enrollments', { replace: true });
  });
});
