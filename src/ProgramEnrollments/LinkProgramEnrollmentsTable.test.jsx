import { mount } from 'enzyme';
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
  let wrapper;

  afterEach(() => {
    wrapper.unmount();
  });

  describe('Success Table', () => {
    it('Success Table exists', () => {
      wrapper = mount(
        <LinkProgramEnrollmentsTable
          successMessage={lpeSuccessResponse.successes}
        />,
      );

      const header = wrapper.find('.success-message h4');
      const dataTable = wrapper.find('table.success-table tr');
      const headingRow = dataTable.at(0);
      const dataRow = dataTable.at(1);

      expect(header.text()).toEqual('Successes');

      expect(headingRow.find('th').at(0).text()).toEqual('External User Key');
      expect(headingRow.find('th').at(1).text()).toEqual('LMS Username');
      expect(headingRow.find('th').at(2).text()).toEqual('Message');

      expect(dataRow.find('td').at(0).text()).toEqual('testuser');
      expect(dataRow.find('td').at(1).text()).toEqual('verified');
      expect(dataRow.find('td').at(2).text()).toEqual('Linkage Successfully Created');
    });
  });

  describe('Error Table', () => {
    it('Error when empty value', () => {
      wrapper = mount(
        <LinkProgramEnrollmentsTable
          errorMessage={lpeErrorResponseEmptyValues.errors}
        />,
      );
      const header = wrapper.find('.error-message h4');
      const dataTable = wrapper.find('table.error-table tr');
      const headingRow = dataTable.at(0);
      const dataRow = dataTable.at(1);

      expect(header.text()).toEqual('Errors');
      expect(headingRow.find('th').at(0).text()).toEqual('Error Messages');
      expect(dataRow.find('td').at(0).text()).toEqual("You must provide both a program uuid and a series of lines with the format 'external_user_key,lms_username'.");
    });
    it('Error when Invalid Program ID', () => {
      wrapper = mount(
        <LinkProgramEnrollmentsTable
          errorMessage={lpeErrorResponseInvalidUUID.errors}
        />,
      );
      const header = wrapper.find('.error-message h4');
      const dataTable = wrapper.find('table.error-table tr');
      const headingRow = dataTable.at(0);
      const dataRow = dataTable.at(1);

      expect(header.text()).toEqual('Errors');
      expect(headingRow.find('th').at(0).text()).toEqual('Error Messages');
      expect(dataRow.find('td').at(0).text()).toEqual("Supplied program UUID '8bee627e-d85e-4a76-be41-d58921da666e' is not a valid UUID.");
    });
    it('Error when Invalid Username', () => {
      wrapper = mount(
        <LinkProgramEnrollmentsTable
          errorMessage={lpeErrorResponseInvalidUsername.errors}
        />,
      );
      const header = wrapper.find('.error-message h4');
      const dataTable = wrapper.find('table.error-table tr');
      const headingRow = dataTable.at(0);
      const dataRow = dataTable.at(1);

      expect(header.text()).toEqual('Errors');
      expect(headingRow.find('th').at(0).text()).toEqual('Error Messages');
      expect(dataRow.find('td').at(0).text()).toEqual('No user found with username verified');
    });
    it('Error when Invalid External Key', () => {
      wrapper = mount(
        <LinkProgramEnrollmentsTable
          errorMessage={lpeErrorResponseInvalidExternalKey.errors}
        />,
      );
      const header = wrapper.find('.error-message h4');
      const dataTable = wrapper.find('table.error-table tr');
      const headingRow = dataTable.at(0);
      const dataRow = dataTable.at(1);

      expect(header.text()).toEqual('Errors');
      expect(headingRow.find('th').at(0).text()).toEqual('Error Messages');
      expect(dataRow.find('td').at(0).text()).toEqual('No program enrollment found for program uuid=8bee627e-d85e-4a76-be41-d58921da666e and external student key=testuser');
    });
    it('Error when Already Linked ID', () => {
      wrapper = mount(
        <LinkProgramEnrollmentsTable
          errorMessage={lpeErrorResponseAlreadyLinked.errors}
        />,
      );
      const header = wrapper.find('.error-message h4');
      const dataTable = wrapper.find('table.error-table tr');
      const headingRow = dataTable.at(0);
      const dataRow = dataTable.at(1);

      expect(header.text()).toEqual('Errors');
      expect(headingRow.find('th').at(0).text()).toEqual('Error Messages');
      expect(dataRow.find('td').at(0).text()).toEqual('Program enrollment with external_student_key=testuser1 is already linked to target account username=verified');
    });
  });
});
