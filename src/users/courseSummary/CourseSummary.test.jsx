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
  let apiMock;
  const props = {
    courseUUID: 'course-uuid',
    closeHandler: jest.fn(() => {}),
  };

  beforeEach(async () => {
    apiMock = jest.spyOn(api, 'getCourseData').mockImplementationOnce(() => Promise.resolve(courseSummaryData.courseData));
    wrapper = mount(<CourseSummaryWrapper {...props} />);
    await waitForComponentToPaint(wrapper);
  });

  afterEach(() => {
    apiMock.mockRestore();
    wrapper.unmount();
  });

  it('Default component render with Modal', () => {
    const dataRows = wrapper.find('table.course-summary-table tbody').first().children();
    expect(dataRows.length).toEqual(5);

    let courseSummaryModal = wrapper.find('Modal#course-summary');
    expect(courseSummaryModal.prop('open')).toEqual(true);
    expect(courseSummaryModal.find('h2.modal-title').text()).toEqual('Course Summary: Test Course');

    const courseRunsTable = wrapper.find('table.course-runs-table');
    expect(courseRunsTable.find('tbody tr').length).toEqual(2);

    wrapper.find('button.btn-link').simulate('click');
    courseSummaryModal = wrapper.find('Modal#course-summary');
    expect(courseSummaryModal.prop('open')).toEqual(false);
  });

  it('Missing Course Run Information', async () => {
    const courseData = { ...courseSummaryData.courseData, courseRuns: [] };
    const summaryData = { ...courseSummaryData, courseData };
    apiMock = jest.spyOn(api, 'getCourseData').mockImplementationOnce(() => Promise.resolve(summaryData.courseData));
    wrapper = mount(<CourseSummaryWrapper {...props} />);
    await waitForComponentToPaint(wrapper);
    expect(wrapper.html()).toEqual(expect.stringContaining('No Course Runs available'));
  });

  it('Render loading page correctly', async () => {
    apiMock = jest.spyOn(api, 'getCourseData').mockImplementationOnce(() => Promise.resolve(courseSummaryData.courseData));
    wrapper = mount(<CourseSummaryWrapper {...props} />);
    expect(wrapper.find('PageLoading').html()).toEqual(expect.stringContaining('Loading'));
    await waitForComponentToPaint(wrapper);
  });

  it('Course Summary Fetch Errors', async () => {
    apiMock = jest.spyOn(api, 'getCourseData').mockImplementationOnce(() => Promise.resolve({
      errors: [
        {
          code: null,
          dismissible: true,
          text: 'No Course Summary Data found',
          type: 'danger',
          topic: 'course-summary',
        },
      ],
    }));
    wrapper = mount(<CourseSummaryWrapper {...props} />);
    await waitForComponentToPaint(wrapper);

    const courseSummaryModal = wrapper.find('Modal#course-summary');
    expect(courseSummaryModal.find('h2.modal-title').text()).toEqual('Course Summary');
    const alert = wrapper.find('.alert');
    expect(alert.text()).toEqual('No Course Summary Data found');
  });
});
