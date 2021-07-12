import { mount } from 'enzyme';
import React from 'react';

import { waitForComponentToPaint } from '../../setupTest';
import CourseSummary from './CourseSummary';
import courseSummaryData from '../data/test/courseSummary';
import UserMessagesProvider from '../../userMessages/UserMessagesProvider';
import * as api from '../data/api';

const CourseSummaryWrapper = (props) => (
  <UserMessagesProvider>
    <CourseSummary {...props} />
  </UserMessagesProvider>
);

describe('Course Summary', () => {
  let wrapper;
  const props = {
    courseUUID: 'course-uuid',
    clearHandler: jest.fn(() => {}),
  };

  beforeEach(async () => {
    jest.spyOn(api, 'getCourseData').mockImplementationOnce(() => Promise.resolve(courseSummaryData));
    wrapper = mount(<CourseSummaryWrapper {...props} />);
    await waitForComponentToPaint(wrapper);
  });

  it('Missing Course Run Information', async () => {
    const courseData = { ...courseSummaryData.courseData, courseRuns: [] };
    const summaryData = { ...courseSummaryData, courseData };
    jest.spyOn(api, 'getCourseData').mockImplementationOnce(() => Promise.resolve(summaryData));
    wrapper = mount(<CourseSummaryWrapper {...props} />);
    await waitForComponentToPaint(wrapper);
    expect(wrapper.html()).toEqual(expect.stringContaining('No Course Runs available'));
  });

  it('Render loading page correctly', async () => {
    jest.spyOn(api, 'getCourseData').mockImplementationOnce(() => Promise.resolve({ ...courseSummaryData, courseData: null }));
    wrapper = mount(<CourseSummaryWrapper {...props} />);
    expect(wrapper.find('PageLoading').html()).toEqual(expect.stringContaining('Loading'));
    await waitForComponentToPaint(wrapper);
  });

  it('Hide Course Summary Button', () => {
    const hideButton = wrapper.find('button.btn-outline-secondary');
    expect(hideButton.text()).toEqual('Hide');
    expect(hideButton.disabled).toBeFalsy();
  });
});
