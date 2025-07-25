import { render, screen, within, cleanup } from '@testing-library/react';
import React from 'react';
import LinkProgramEnrollmentsTable from './LinkProgramEnrollmentsTable';
import {
  lpeSuccessResponse,
  lpeErrorResponseInvalidUUID,
  lpeErrorResponseEmptyValues,
  lpeErrorResponseInvalidUsername,
  lpeErrorResponseInvalidExternalKey,
  lpeErrorResponseAlreadyLinked,
} from './data/test/linkProgramEnrollment';

describe('Link Program Enrollment Tables component', () => {
  afterEach(cleanup);

  describe('Success Table', () => {
    it('Success Table exists', () => {
      render(
        <LinkProgramEnrollmentsTable
          successMessage={lpeSuccessResponse.successes}
        />
      );

      expect(screen.getByText('Successes')).toBeInTheDocument();

      const table = screen.getByRole('table', { name: /success-table/i });
      const rows = within(table).getAllByRole('row');

      const headingCells = within(rows[0]).getAllByRole('columnheader');
      expect(headingCells[0]).toHaveTextContent('External User Key');
      expect(headingCells[1]).toHaveTextContent('LMS Username');
      expect(headingCells[2]).toHaveTextContent('Message');

      const dataCells = within(rows[1]).getAllByRole('cell');
      expect(dataCells[0]).toHaveTextContent('testuser');
      expect(dataCells[1]).toHaveTextContent('verified');
      expect(dataCells[2]).toHaveTextContent('Linkage Successfully Created');
    });
  });

  describe('Error Table', () => {
    const testErrorTable = (errorMessage: string) => {
      const table = screen.getByRole('table', { name: /error-table/i });
      const rows = within(table).getAllByRole('row');

      const headingCells = within(rows[0]).getAllByRole('columnheader');
      expect(headingCells[0]).toHaveTextContent('Error Messages');

      const dataCells = within(rows[1]).getAllByRole('cell');
      expect(dataCells[0]).toHaveTextContent(errorMessage);
    };

    it('Error when empty value', () => {
      render(
        <LinkProgramEnrollmentsTable
          errorMessage={lpeErrorResponseEmptyValues.errors}
        />
      );
      expect(screen.getByText('Errors')).toBeInTheDocument();
      testErrorTable(
        "You must provide both a program uuid and a series of lines with the format 'external_user_key,lms_username'."
      );
    });

    it('Error when Invalid Program ID', () => {
      render(
        <LinkProgramEnrollmentsTable
          errorMessage={lpeErrorResponseInvalidUUID.errors}
        />
      );
      expect(screen.getByText('Errors')).toBeInTheDocument();
      testErrorTable(
        "Supplied program UUID '8bee627e-d85e-4a76-be41-d58921da666e' is not a valid UUID."
      );
    });

    it('Error when Invalid Username', () => {
      render(
        <LinkProgramEnrollmentsTable
          errorMessage={lpeErrorResponseInvalidUsername.errors}
        />
      );
      expect(screen.getByText('Errors')).toBeInTheDocument();
      testErrorTable('No user found with username verified');
    });

    it('Error when Invalid External Key', () => {
      render(
        <LinkProgramEnrollmentsTable
          errorMessage={lpeErrorResponseInvalidExternalKey.errors}
        />
      );
      expect(screen.getByText('Errors')).toBeInTheDocument();
      testErrorTable(
        'No program enrollment found for program uuid=8bee627e-d85e-4a76-be41-d58921da666e and external student key=testuser'
      );
    });

    it('Error when Already Linked ID', () => {
      render(
        <LinkProgramEnrollmentsTable
          errorMessage={lpeErrorResponseAlreadyLinked.errors}
        />
      );
      expect(screen.getByText('Errors')).toBeInTheDocument();
      testErrorTable(
        'Program enrollment with external_student_key=testuser1 is already linked to target account username=verified'
      );
    });
  });
});
