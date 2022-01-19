import { mount } from 'enzyme';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { waitForComponentToPaint } from '../../setupTest';
import UserMessagesProvider from '../../userMessages/UserMessagesProvider';
import EnrollmentDetails from './EnrollmentDetails';
import { programInspectorSuccessResponse } from './data/test/programInspector';

const EnrollmentDetailsWrapper = (props) => (
  <MemoryRouter>
    <UserMessagesProvider>
      <EnrollmentDetails {...props} />
    </UserMessagesProvider>
  </MemoryRouter>
);

describe('Enrollment Details', () => {
  let wrapper;
  const data = programInspectorSuccessResponse.learner_program_enrollments.enrollments[0];

  it('Enrollment Details render', async () => {
    wrapper = mount(
      <EnrollmentDetailsWrapper
        enrollments={
          programInspectorSuccessResponse.learner_program_enrollments.enrollments
        }
      />,
    );
    await waitForComponentToPaint(wrapper);

    const heading = wrapper.find('.enrollments h3');
    expect(heading.text()).toEqual(
      `Program: ${data.program_name} (${data.program_uuid})`,
    );
  });

  it.each([{ enrollment: null }, { enrollment: undefined }])(
    'Enrollment Details do not render',
    async ({ enrollment }) => {
      wrapper = mount(<EnrollmentDetailsWrapper enrollments={enrollment} />);
      await waitForComponentToPaint(wrapper);

      const heading = wrapper.find('.enrollments h3');
      expect(heading.exists()).toBeFalsy();
    },
  );

  it('Enrollment details table render', async () => {
    wrapper = mount(
      <EnrollmentDetailsWrapper
        enrollments={
          programInspectorSuccessResponse.learner_program_enrollments.enrollments
        }
      />,
    );
    await waitForComponentToPaint(wrapper);

    const row = wrapper.find('.enrollment-details tbody tr');
    expect(row.find('td').at(0).text()).toEqual(data.status);
    expect(row.find('td').at(1).text()).toEqual(data.created);
    expect(row.find('td').at(2).text()).toEqual(data.modified);
    expect(row.find('td').at(3).text()).toEqual(data.external_user_key);
  });

  it.each([
    { audit: 'True', index: 0 },
    { audit: 'False', index: 1 },
  ])(
    'Program course enrollments table render Audit',
    async ({ audit, index }) => {
      wrapper = mount(
        <EnrollmentDetailsWrapper
          enrollments={
            programInspectorSuccessResponse.learner_program_enrollments.enrollments
          }
        />,
      );
      await waitForComponentToPaint(wrapper);
      const programCourseEnrollments = data.program_course_enrollments[index];
      expect(wrapper.find('.enrollments h5').text()).toEqual(
        'Program Course Enrollments',
      );
      const row = wrapper.find('.course-enrollment-details tbody tr').at(index);
      expect(row.find('td').at(0).find('a').text()).toEqual(
        programCourseEnrollments.course_key,
      );
      expect(row.find('td').at(1).text()).toEqual(
        programCourseEnrollments.status,
      );
      expect(row.find('td').at(2).text()).toEqual(
        programCourseEnrollments.created,
      );
      expect(row.find('td').at(3).text()).toEqual(
        programCourseEnrollments.modified,
      );
      expect(row.find('td').at(4).text()).toEqual(
        programCourseEnrollments.course_enrollment.course_id,
      );
      expect(row.find('td').at(5).text()).toEqual(audit);
      expect(row.find('td').at(6).text()).toEqual(
        programCourseEnrollments.course_enrollment.mode,
      );
    },
  );
});
