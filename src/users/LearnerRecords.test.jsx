import { mount } from 'enzyme';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { waitFor } from '@testing-library/react';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import UserMessagesProvider from '../userMessages/UserMessagesProvider';
import * as api from './data/api';
import records from './data/test/records';
import LearnerRecords from './LearnerRecords';

const LearnerRecordsWrapper = (props) => (
  <IntlProvider locale="en">
    <MemoryRouter>
      <UserMessagesProvider>
        <LearnerRecords {...props} />
      </UserMessagesProvider>
    </MemoryRouter>
  </IntlProvider>
);

describe('Learner Records Tests', () => {
  let wrapper;
  let apiMock;
  const data = {
    username: 'edx',
  };

  beforeEach(() => {
    if (apiMock) {
      apiMock.mockReset();
    }
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it('renders a message with no results', async () => {
    wrapper = mount(<LearnerRecordsWrapper username={data.username} />);
    apiMock = jest
      .spyOn(api, 'getLearnerRecords')
      .mockImplementationOnce(() => Promise.resolve([]));

    expect(wrapper.find('p').text()).toEqual(`No results found for username: ${data.username}`);
  });

  it('renders an error message', async () => {
    const expectedError = {
      errors: [
        {
          code: null,
          dismissible: true,
          text: 'There was an error retrieving records for the user',
          type: 'danger',
          topic: 'credentials',
        },
      ],
    };
    apiMock = jest
      .spyOn(api, 'getLearnerRecords')
      .mockImplementationOnce(() => Promise.resolve(expectedError));
    wrapper = mount(<LearnerRecordsWrapper username={data.username} />);

    waitFor(() => expect(wrapper.find('.alert').text()).toEqual(expectedError.errors[0].text));
  });

  it('renders metadata for a program record', async () => {
    apiMock = jest
      .spyOn(api, 'getLearnerRecords')
      .mockImplementationOnce(() => Promise.resolve(records));

    wrapper = mount(<LearnerRecordsWrapper username={data.username} />);

    const { program } = records[0].record;

    waitFor(() => {
      expect(wrapper.find('h4').text()).toEqual(program.name);
      expect(wrapper.find('p').at(0).text()).toEqual(program.type_name);
      expect(wrapper.find('p').at(1).text()).toEqual('Partially Completed');
      expect(wrapper.find('p').at(2).text()).toEqual(`Last updated: ${new Date(program.last_updated).toLocaleDateString()}`);
    });
  });

  it('copies a link to the clipboard when the "Copy Program Record link" button is clicked', async () => {
    apiMock = jest
      .spyOn(api, 'getLearnerRecords')
      .mockImplementationOnce(() => Promise.resolve(records));

    wrapper = mount(<LearnerRecordsWrapper username={data.username} />);

    Object.assign(navigator, {
      clipboard: {
        writeText: () => {},
      },
    });
    jest.spyOn(navigator.clipboard, 'writeText');

    const copyButton = wrapper.find('button').at(0);
    waitFor(() => {
      expect(copyButton.text()).toEqual('Copy public record link');
      copyButton.simulate('click');

      expect(navigator.clipboard.writeText).toHaveBeenCalledTimes(1);
    });
  });

  it('renders an alert when there is no public instance of a record', async () => {
    const privateRecords = [...records];
    privateRecords[0].record.shared_program_record_uuid = '';
    apiMock = jest
      .spyOn(api, 'getLearnerRecords')
      .mockImplementationOnce(() => Promise.resolve(privateRecords));

    wrapper = mount(<LearnerRecordsWrapper username={data.username} />);

    waitFor(() => expect(wrapper.find('div.no-public-link').text()).toEqual('There is no public instance for this record. Learners must create a public link on their own.'));
  });

  it('renders a table for a program record', async () => {
    apiMock = jest
      .spyOn(api, 'getLearnerRecords')
      .mockImplementationOnce(() => Promise.resolve(records));

    wrapper = mount(<LearnerRecordsWrapper username={data.username} />);

    const dataTable = wrapper.find('table.custom-table').at(0);
    const firstDataRow = dataTable.find('tr').at(1);

    waitFor(() => {
      expect(dataTable.find('th').at(0).text()).toEqual('Course Name');
      expect(dataTable.find('th').at(1).text()).toEqual('School');
      expect(dataTable.find('th').at(2).text()).toEqual('Course ID');
      expect(dataTable.find('th').at(3).text()).toEqual('Highest grade earned');
      expect(dataTable.find('th').at(4).text()).toEqual('Letter Grade');
      expect(dataTable.find('th').at(5).text()).toEqual('Verified Attempts');
      expect(dataTable.find('th').at(6).text()).toEqual('Date Earned');
      expect(dataTable.find('th').at(7).text()).toEqual('Status');

      const grade = records[0].record.grades[0];

      expect(firstDataRow.find('td').at(0).text()).toEqual(grade.name);
      expect(firstDataRow.find('td').at(1).text()).toEqual(grade.school);
      expect(firstDataRow.find('td').at(2).text()).toEqual(grade.course_id.split(':')[1]);
      expect(firstDataRow.find('td').at(3).text()).toEqual(`${parseInt(Math.round(grade.percent_grade * 100), 10).toString()}%`);
      expect(firstDataRow.find('td').at(4).text()).toEqual(grade.letter_grade);
      expect(firstDataRow.find('td').at(5).text()).toEqual(grade.attempts.toString());
      expect(firstDataRow.find('td').at(6).text()).toEqual(new Date(grade.issue_date).toLocaleDateString());
      expect(firstDataRow.find('td').at(7).text()).toEqual('Earned');
    });
  });
});
