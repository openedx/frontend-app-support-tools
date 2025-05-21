import { render } from '@testing-library/react';
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
  describe('Success Table', () => {
    it('Success Table exists', () => {
      const { unmount } = render(
        <LinkProgramEnrollmentsTable
          successMessage={lpeSuccessResponse.successes}
        />,
      );

      const header = document.querySelector('.success-message h4');
      const dataTable = document.querySelectorAll('table.success-table tr');
      const headingRow = dataTable[0];
      const dataRow = dataTable[1];

      expect(header.textContent).toEqual('Successes');

      expect(headingRow.querySelectorAll('th')[0].textContent).toEqual('External User Key');
      expect(headingRow.querySelectorAll('th')[1].textContent).toEqual('LMS Username');
      expect(headingRow.querySelectorAll('th')[2].textContent).toEqual('Message');

      expect(dataRow.querySelectorAll('td')[0].textContent).toEqual('testuser');
      expect(dataRow.querySelectorAll('td')[1].textContent).toEqual('verified');
      expect(dataRow.querySelectorAll('td')[2].textContent).toEqual('Linkage Successfully Created');
      unmount();
    });
  });

  describe('Error Table', () => {
    it('Error when empty value', () => {
      const { unmount } = render(
        <LinkProgramEnrollmentsTable
          errorMessage={lpeErrorResponseEmptyValues.errors}
        />,
      );
      const header = document.querySelector('.error-message h4');
      const dataTable = document.querySelectorAll('table.error-table tr');
      const headingRow = dataTable[0];
      const dataRow = dataTable[1];

      expect(header.textContent).toEqual('Errors');
      expect(headingRow.querySelectorAll('th')[0].textContent).toEqual('Error Messages');
      expect(dataRow.querySelectorAll('td')[0].textContent).toEqual("You must provide both a program uuid and a series of lines with the format 'external_user_key,lms_username'.");
      unmount();
    });
    it('Error when Invalid Program ID', () => {
      const { unmount } = render(
        <LinkProgramEnrollmentsTable
          errorMessage={lpeErrorResponseInvalidUUID.errors}
        />,
      );
      const header = document.querySelector('.error-message h4');
      const dataTable = document.querySelectorAll('table.error-table tr');
      const headingRow = dataTable[0];
      const dataRow = dataTable[1];

      expect(header.textContent).toEqual('Errors');
      expect(headingRow.querySelectorAll('th')[0].textContent).toEqual('Error Messages');
      expect(dataRow.querySelectorAll('td')[0].textContent).toEqual("Supplied program UUID '8bee627e-d85e-4a76-be41-d58921da666e' is not a valid UUID.");
      unmount();
    });
    it('Error when Invalid Username', () => {
      const { unmount } = render(
        <LinkProgramEnrollmentsTable
          errorMessage={lpeErrorResponseInvalidUsername.errors}
        />,
      );
      const header = document.querySelector('.error-message h4');
      const dataTable = document.querySelectorAll('table.error-table tr');
      const headingRow = dataTable[0];
      const dataRow = dataTable[1];

      expect(header.textContent).toEqual('Errors');
      expect(headingRow.querySelectorAll('th')[0].textContent).toEqual('Error Messages');
      expect(dataRow.querySelectorAll('td')[0].textContent).toEqual('No user found with username verified');
      unmount();
    });
    it('Error when Invalid External Key', () => {
      const { unmount } = render(
        <LinkProgramEnrollmentsTable
          errorMessage={lpeErrorResponseInvalidExternalKey.errors}
        />,
      );
      const header = document.querySelector('.error-message h4');
      const dataTable = document.querySelectorAll('table.error-table tr');
      const headingRow = dataTable[0];
      const dataRow = dataTable[1];

      expect(header.textContent).toEqual('Errors');
      expect(headingRow.querySelectorAll('th')[0].textContent).toEqual('Error Messages');
      expect(dataRow.querySelectorAll('td')[0].textContent).toEqual('No program enrollment found for program uuid=8bee627e-d85e-4a76-be41-d58921da666e and external student key=testuser');
      unmount();
    });
    it('Error when Already Linked ID', () => {
      const { unmount } = render(
        <LinkProgramEnrollmentsTable
          errorMessage={lpeErrorResponseAlreadyLinked.errors}
        />,
      );
      const header = document.querySelector('.error-message h4');
      const dataTable = document.querySelectorAll('table.error-table tr');
      const headingRow = dataTable[0];
      const dataRow = dataTable[1];

      expect(header.textContent).toEqual('Errors');
      expect(headingRow.querySelectorAll('th')[0].textContent).toEqual('Error Messages');
      expect(dataRow.querySelectorAll('td')[0].textContent).toEqual('Program enrollment with external_student_key=testuser1 is already linked to target account username=verified');
      unmount();
    });
  });
});
