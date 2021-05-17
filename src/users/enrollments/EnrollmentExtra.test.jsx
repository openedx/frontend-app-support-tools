import { mount } from 'enzyme';
import React from 'react';

import EnrollmentExtra from './EnrollmentExtra';

const props = {
  enrollmentExtraData: {
    lastModified: new Date(2021, 0, 1, 0, 0, 0, 0).toLocaleString('en-US'),
    lastModifiedBy: 'edX',
    reason: 'Test',
    courseName: 'Test Course',
  },
  closeHandler: jest.fn(() => {}),
};

describe('Enrollment Extra Data', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(<EnrollmentExtra {...props} />);
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it('Default Data Render', () => {
    const dataRows = wrapper.find('table.table').find('tr');
    expect(dataRows).toHaveLength(3);

    const lastModified = dataRows.at(0);
    const lastModifiedBy = dataRows.at(1);
    const reason = dataRows.at(2);
    expect(lastModified.text()).toEqual(expect.stringContaining('1/1/2021, 12:00:00 AM'));
    expect(lastModifiedBy.text()).toEqual(expect.stringContaining('edX'));
    expect(reason.text()).toEqual(expect.stringContaining('Test'));

    expect(wrapper.find('h4').text()).toEqual('Course Title: Test Course');
  });

  it('Hide Button Render', () => {
    const hideButton = wrapper.find('button.btn-outline-secondary');
    expect(hideButton.text()).toEqual('Hide');
    hideButton.simulate('click');
    expect(props.closeHandler).toHaveBeenCalled();
  });
});
