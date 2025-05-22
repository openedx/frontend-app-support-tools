import { render } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import UserMessagesProvider from '../../userMessages/UserMessagesProvider';
import EnrollmentDetails from './EnrollmentDetails';
import { programInspectorSuccessResponse } from './data/test/programInspector';

const EnrollmentDetailsWrapper = (props) => (
  <MemoryRouter>
    <IntlProvider locale="en">
      <UserMessagesProvider>
        <EnrollmentDetails {...props} />
      </UserMessagesProvider>
    </IntlProvider>
  </MemoryRouter>
);

describe('Enrollment Details', () => {
  const data = programInspectorSuccessResponse.learner_program_enrollments.enrollments[0];

  it('Enrollment Details render', async () => {
    render(
      <EnrollmentDetailsWrapper
        enrollments={
          programInspectorSuccessResponse.learner_program_enrollments.enrollments
        }
      />,
    );

    const heading = document.querySelector('.enrollments h3');
    expect(heading.textContent).toEqual(
      `Program: ${data.program_name} (${data.program_uuid})`,
    );
  });

  it.each([{ enrollment: null }, { enrollment: undefined }])(
    'Enrollment Details do not render',
    async ({ enrollment }) => {
      render(<EnrollmentDetailsWrapper enrollments={enrollment} />);

      const heading = document.querySelector('.enrollments h3');
      expect(heading).not.toBeInTheDocument();
    },
  );

  it('Enrollment details table render', async () => {
    render(
      <EnrollmentDetailsWrapper
        enrollments={
          programInspectorSuccessResponse.learner_program_enrollments.enrollments
        }
      />,
    );

    const row = document.querySelector('.enrollment-details tbody tr');
    expect(row.querySelectorAll('td')[0].textContent).toEqual(data.status);
    expect(row.querySelectorAll('td')[1].textContent).toEqual(data.created);
    expect(row.querySelectorAll('td')[2].textContent).toEqual(data.modified);
    expect(row.querySelectorAll('td')[3].textContent).toEqual(data.external_user_key);
  });

  it.each([
    { audit: 'True', index: 0 },
    { audit: 'False', index: 1 },
  ])(
    'Program course enrollments table render Audit',
    async ({ audit, index }) => {
      render(
        <EnrollmentDetailsWrapper
          enrollments={
            programInspectorSuccessResponse.learner_program_enrollments.enrollments
          }
        />,
      );
      const programCourseEnrollments = data.program_course_enrollments[index];
      expect(document.querySelector('.enrollments h5').textContent).toEqual(
        'Program Course Enrollments',
      );
      const row = document.querySelectorAll('.course-enrollment-details tbody tr')[index];
      expect(row.querySelectorAll('td')[0].querySelector('a').textContent).toEqual(
        programCourseEnrollments.course_key,
      );
      expect(row.querySelectorAll('td')[1].textContent).toEqual(
        programCourseEnrollments.status,
      );
      expect(row.querySelectorAll('td')[2].textContent).toEqual(
        programCourseEnrollments.created,
      );
      expect(row.querySelectorAll('td')[3].textContent).toEqual(
        programCourseEnrollments.modified,
      );
      expect(row.querySelectorAll('td')[4].textContent).toEqual(
        programCourseEnrollments.course_enrollment.course_id,
      );
      expect(row.querySelectorAll('td')[5].textContent).toEqual(audit);
      expect(row.querySelectorAll('td')[6].textContent).toEqual(
        programCourseEnrollments.course_enrollment.mode,
      );
    },
  );
});
