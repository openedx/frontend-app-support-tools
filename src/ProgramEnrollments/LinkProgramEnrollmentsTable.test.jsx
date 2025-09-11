import React from 'react';
import { render, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom';

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
  describe('Success Table', () => {
    it('Success Table exists', () => {
      render(
        <LinkProgramEnrollmentsTable
          successMessage={lpeSuccessResponse.successes}
        />,
      );

      const header = screen.getByRole('heading', { level: 4, name: /Successes/i });
      expect(header).toBeInTheDocument();

      const tables = screen.getAllByRole('table');
      const table = tables.find((t) => within(t).queryByText(/External User Key/i));
      expect(table).toBeInTheDocument();

      const rows = within(table).getAllByRole('row');
      const headingRow = rows[0];
      const dataRow = rows[1];

      const headingCells = within(headingRow).getAllByRole('columnheader');
      expect(headingCells[0]).toHaveTextContent('External User Key');
      expect(headingCells[1]).toHaveTextContent('LMS Username');
      expect(headingCells[2]).toHaveTextContent('Message');

      const dataCells = within(dataRow).getAllByRole('cell');
      expect(dataCells[0]).toHaveTextContent('testuser');
      expect(dataCells[1]).toHaveTextContent('verified');
      expect(dataCells[2]).toHaveTextContent('Linkage Successfully Created');
    });
  });

  describe('Error Table', () => {
    const errorTests = [
      {
        name: 'Error when empty value',
        data: lpeErrorResponseEmptyValues.errors,
        expected:
          "You must provide both a program uuid and a series of lines with the format 'external_user_key,lms_username'.",
      },
      {
        name: 'Error when Invalid Program ID',
        data: lpeErrorResponseInvalidUUID.errors,
        expected:
          "Supplied program UUID '8bee627e-d85e-4a76-be41-d58921da666e' is not a valid UUID.",
      },
      {
        name: 'Error when Invalid Username',
        data: lpeErrorResponseInvalidUsername.errors,
        expected: 'No user found with username verified',
      },
      {
        name: 'Error when Invalid External Key',
        data: lpeErrorResponseInvalidExternalKey.errors,
        expected:
          'No program enrollment found for program uuid=8bee627e-d85e-4a76-be41-d58921da666e and external student key=testuser',
      },
      {
        name: 'Error when Already Linked ID',
        data: lpeErrorResponseAlreadyLinked.errors,
        expected:
          'Program enrollment with external_student_key=testuser1 is already linked to target account username=verified',
      },
    ];

    errorTests.forEach(({ name, data, expected }) => {
      it(name, () => {
        render(
          <LinkProgramEnrollmentsTable errorMessage={data} />,
        );

        const header = screen.getByRole('heading', { level: 4, name: /Errors/i });
        expect(header).toBeInTheDocument();

        const tables = screen.getAllByRole('table');
        const table = tables.find((t) => within(t).queryByText(/Error Messages/i));
        expect(table).toBeInTheDocument();

        const rows = within(table).getAllByRole('row');
        const headingRow = rows[0];
        const dataRow = rows[1];

        const headingCells = within(headingRow).getAllByRole('columnheader');
        expect(headingCells[0]).toHaveTextContent('Error Messages');

        const dataCells = within(dataRow).getAllByRole('cell');
        expect(dataCells[0]).toHaveTextContent(expected);
      });
    });
  });
});
