import React from 'react';
import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import UserMessagesProvider from '../../userMessages/UserMessagesProvider';
import EnrollmentDetails from './EnrollmentDetails';
import { programInspectorSuccessResponse } from './data/test/programInspector';

const EnrollmentDetailsWrapper = (props) => (
  <IntlProvider locale="en">
    <MemoryRouter>
      <UserMessagesProvider>
        <EnrollmentDetails {...props} />
      </UserMessagesProvider>
    </MemoryRouter>
  </IntlProvider>
);

describe('Enrollment Details', () => {
  const data = programInspectorSuccessResponse.learner_program_enrollments.enrollments[0];

  it('Enrollment Details render', () => {
    render(
      <EnrollmentDetailsWrapper
        enrollments={programInspectorSuccessResponse.learner_program_enrollments.enrollments}
      />,
    );

    const heading = screen.getByRole('heading', { level: 3 });
    expect(heading).toHaveTextContent(`Program: ${data.program_name} (${data.program_uuid})`);
  });

  it.each([{ enrollment: null }, { enrollment: undefined }])(
    'Enrollment Details do not render',
    ({ enrollment }) => {
      render(<EnrollmentDetailsWrapper enrollments={enrollment} />);
      expect(screen.queryByRole('heading', { level: 3 })).not.toBeInTheDocument();
    },
  );
});

describe('EnrollmentDetailsWrapper Component', () => {
  const enrollmentData = programInspectorSuccessResponse.learner_program_enrollments.enrollments;

  it('renders Enrollment Details table correctly', () => {
    render(<EnrollmentDetailsWrapper enrollments={enrollmentData} />);

    const tables = screen.getAllByRole('table');
    expect(tables.length).toBeGreaterThan(0);

    const table = tables[0];
    expect(table).toBeInTheDocument();

    const rows = within(table).getAllByRole('row');
    expect(rows.length).toBeGreaterThan(1);

    const dataRow = rows[1];
    const cells = within(dataRow).getAllByRole('cell');
    const data = enrollmentData[0];

    expect(cells[0]).toHaveTextContent(data.status);
    expect(cells[1]).toHaveTextContent(data.created);
    expect(cells[2]).toHaveTextContent(data.modified);
    expect(cells[3]).toHaveTextContent(data.external_user_key);
  });

  it('renders Program Course Enrollments table correctly', () => {
    render(<EnrollmentDetailsWrapper enrollments={enrollmentData} />);

    const heading = screen.getByRole('heading', { level: 5 });
    expect(heading).toHaveTextContent(/program course enrollments/i);

    const tables = screen.getAllByRole('table');
    expect(tables.length).toBeGreaterThan(1);

    const table = tables[1];
    expect(table).toBeInTheDocument();

    const rows = within(table).getAllByRole('row');
    expect(rows.length).toBeGreaterThan(1);

    const dataRow = rows[1];
    const cells = within(dataRow).getAllByRole('cell');
    const course = enrollmentData[0].program_course_enrollments[0];

    expect(within(cells[0]).getByRole('link')).toHaveTextContent(course.course_key);
    expect(cells[1]).toHaveTextContent(course.status);
    expect(cells[2]).toHaveTextContent(course.created);
    expect(cells[3]).toHaveTextContent(course.modified);
    expect(cells[4]).toHaveTextContent(course.course_enrollment.course_id);
    expect(cells[5]).toHaveTextContent(course.course_enrollment.is_active ? 'True' : 'False');
    expect(cells[6]).toHaveTextContent(course.course_enrollment.mode);
  });

  it.each([
    { index: 0 },
    { index: 1 },
  ])('renders audit column correctly for row %i', ({ index }) => {
    render(<EnrollmentDetailsWrapper enrollments={enrollmentData} />);

    const tables = screen.getAllByRole('table');
    expect(tables.length).toBeGreaterThan(1);

    const table = tables[1];
    expect(table).toBeInTheDocument();

    const rows = within(table).getAllByRole('row');
    expect(rows.length).toBeGreaterThan(index + 1);

    const dataRow = rows[index + 1];
    const cells = within(dataRow).getAllByRole('cell');
    expect(cells.length).toBeGreaterThan(6);

    const auditCell = cells[6];
    expect(auditCell).toHaveTextContent(/audit/i);
  });
});
