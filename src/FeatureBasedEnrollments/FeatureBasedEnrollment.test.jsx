import { mount } from 'enzyme';
import React from 'react';
import { waitForComponentToPaint } from '../setupTest';
import FeatureBasedEnrollment from './FeatureBasedEnrollment';
import UserMessagesProvider from '../userMessages/UserMessagesProvider';
import { fbeEnabledResponse } from './data/test/featureBasedEnrollment';

import * as api from './data/api';

const FeatureBasedEnrollmentWrapper = (props) => (
  <UserMessagesProvider>
    <FeatureBasedEnrollment {...props} />
  </UserMessagesProvider>
);

describe('Feature Based Enrollment', () => {
  const props = {
    courseId: 'course-v1:testX+test123+2030',
  };

  let wrapper;

  beforeEach(async () => {
    // api file has only one default export, so that will be spied-on
    jest.spyOn(api, 'default').mockImplementationOnce(() => Promise.resolve(fbeEnabledResponse));
    wrapper = mount(<FeatureBasedEnrollmentWrapper {...props} />);
    await waitForComponentToPaint(wrapper);
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it('default props', () => {
    const courseId = wrapper.prop('courseId');
    expect(courseId).toEqual(props.courseId);
  });

  it('Successful fetch for FBE data', async () => {
    const cardList = wrapper.find('Card');
    const courseTitle = wrapper.find('h4');

    expect(cardList).toHaveLength(2);
    expect(wrapper.find('h3#fbe-title-header').text()).toEqual('Feature Based Enrollment Configuration');
    expect(courseTitle.text()).toEqual('Course Title: test course');
  });

  it('No FBE Data', async () => {
    jest.spyOn(api, 'default').mockImplementationOnce(() => Promise.resolve({}));
    wrapper = mount(<FeatureBasedEnrollmentWrapper {...props} />);
    await waitForComponentToPaint(wrapper);

    const cardList = wrapper.find('Card');
    const noRecordMessage = wrapper.find('p');

    expect(cardList).toHaveLength(0);
    expect(wrapper.find('h3#fbe-title-header').text()).toEqual('Feature Based Enrollment Configuration');
    expect(noRecordMessage.text()).toEqual('No Feature Based Enrollment Configurations were found.');
  });

  it('Page Loading component render', async () => {
    wrapper = mount(<FeatureBasedEnrollmentWrapper {...props} />);
    expect(wrapper.find('PageLoading').html()).toEqual(expect.stringContaining('Loading'));
  });

  it('Error fetching FBE data', async () => {
    const fbeErrors = {
      errors: [
        {
          code: null,
          dismissible: true,
          text: 'Error fetching FBE Data',
          type: 'error',
          topic: 'featureBasedEnrollment',
        },
      ],
    };
    jest.spyOn(api, 'default').mockImplementationOnce(() => Promise.resolve(fbeErrors));
    wrapper = mount(<FeatureBasedEnrollmentWrapper {...props} />);
    await waitForComponentToPaint(wrapper);

    const alert = wrapper.find('.alert');
    expect(alert.text()).toEqual('Error fetching FBE Data');
  });
});
