import { mount } from 'enzyme';
import React from 'react';

import CourseSummary from './CourseSummary';
import CourseSummaryData from './data/test/courseSummary';

describe('Course Summary', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(<CourseSummary {...CourseSummaryData} />);
  });

  it('Default Prop Values', () => {
    const componentPropData = wrapper.prop('courseData');
    const expectedPropData = CourseSummaryData.courseData;

    expect(componentPropData.key).toEqual(expectedPropData.key);
    expect(componentPropData.uuid).toEqual(expectedPropData.uuid);
    expect(componentPropData.title).toEqual(expectedPropData.title);
    expect(componentPropData.level).toEqual(expectedPropData.level);
    expect(componentPropData.marketingUrl).toEqual(expectedPropData.marketingUrl);
    expect(componentPropData.courseRuns).toMatchObject(expectedPropData.courseRuns);
  });

  it('Missing Course Run Information', () => {
    const courseData = { ...CourseSummaryData.courseData, courseRuns: [] };
    const summaryData = { ...CourseSummaryData, courseData };
    wrapper = mount(<CourseSummary {...CourseSummaryData} courseData={summaryData} />);
    expect(wrapper.html()).toEqual(expect.stringContaining('No Course Runs available'));
  });

  it('Hide Course Summary Button', () => {
    const hideButton = wrapper.find('button.btn-outline-secondary');
    expect(hideButton.text()).toEqual('Hide');
    expect(hideButton.disabled).toBeFalsy();
  });
});
