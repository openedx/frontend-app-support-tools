import {
  fireEvent, render, screen, waitFor,
} from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
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
  let apiMock;
  const data = {
    username: 'edx',
  };

  beforeEach(() => {
    if (apiMock) {
      apiMock.mockReset();
    }
  });

  it('renders a message with no results', async () => {
    const { container, unmount } = render(<LearnerRecordsWrapper username={data.username} />);
    apiMock = jest
      .spyOn(api, 'getLearnerRecords')
      .mockImplementationOnce(() => Promise.resolve([]));

    expect(container.querySelector('p').textContent).toEqual(`No results found for username: ${data.username}`);
    unmount();
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
    const { container, unmount } = render(<LearnerRecordsWrapper username={data.username} />);
    waitFor(() => expect(container.querySelector('.alert').textContent).toEqual(expectedError.errors[0].text));
    unmount();
  });

  it('renders metadata for a program record', async () => {
    apiMock = jest
      .spyOn(api, 'getLearnerRecords')
      .mockImplementationOnce(() => Promise.resolve(records));

    const { unmount } = render(<LearnerRecordsWrapper username={data.username} />);
    const programInformation = await screen.findByTestId('learner-records-program-information');

    const { program } = records[0].record;
    expect(programInformation.querySelector('h4').textContent).toEqual(program.name);
    expect(programInformation.querySelectorAll('p')[0].textContent).toEqual(program.type_name);
    expect(programInformation.querySelectorAll('p')[1].textContent).toEqual('Partially Completed');
    expect(programInformation.querySelectorAll('p')[2].textContent).toEqual(`Last updated: ${new Date(program.last_updated).toLocaleDateString()}`);
    unmount();
  });

  it('copies a link to the clipboard when the "Copy Program Record link" button is clicked', async () => {
    apiMock = jest
      .spyOn(api, 'getLearnerRecords')
      .mockImplementationOnce(() => Promise.resolve(records));

    render(<LearnerRecordsWrapper username={data.username} />);

    Object.assign(navigator, {
      clipboard: {
        writeText: () => {},
      },
    });
    jest.spyOn(navigator.clipboard, 'writeText');

    const copyButton = await screen.findByTestId('learner-records-button');
    expect(copyButton.textContent).toEqual('Copy public record link');
    fireEvent.click(copyButton);
    expect(navigator.clipboard.writeText).toHaveBeenCalledTimes(1);
  });

  it('renders an alert when there is no public instance of a record', async () => {
    const privateRecords = [...records];
    privateRecords[0].record.shared_program_record_uuid = '';
    apiMock = jest
      .spyOn(api, 'getLearnerRecords')
      .mockImplementationOnce(() => Promise.resolve(privateRecords));

    render(<LearnerRecordsWrapper username={data.username} />);
    const noPublicLinkAlert = await screen.findByTestId('no-public-link');
    expect(noPublicLinkAlert.textContent).toEqual('There is no public instance for this record. Learners must create a public link on their own.');
  });

  it('renders a table for a program record', async () => {
    apiMock = jest
      .spyOn(api, 'getLearnerRecords')
      .mockImplementationOnce(() => Promise.resolve(records));

    render(<LearnerRecordsWrapper username={data.username} />);

    const dataTable = await screen.findByTestId('learner-records-table');
    const firstDataRow = dataTable.querySelectorAll('tr')[1];
    expect(dataTable.querySelectorAll('th')[0].textContent).toEqual('Course Name');
    expect(dataTable.querySelectorAll('th')[1].textContent).toEqual('School');
    expect(dataTable.querySelectorAll('th')[2].textContent).toEqual('Course ID');
    expect(dataTable.querySelectorAll('th')[3].textContent).toEqual('Highest grade earned');
    expect(dataTable.querySelectorAll('th')[4].textContent).toEqual('Letter Grade');
    expect(dataTable.querySelectorAll('th')[5].textContent).toEqual('Verified Attempts');
    expect(dataTable.querySelectorAll('th')[6].textContent).toEqual('Date Earned');
    expect(dataTable.querySelectorAll('th')[7].textContent).toEqual('Status');

    const grade = records[0].record.grades[0];

    expect(firstDataRow.querySelectorAll('td')[0].textContent).toEqual(grade.name);
    expect(firstDataRow.querySelectorAll('td')[1].textContent).toEqual(grade.school);
    expect(firstDataRow.querySelectorAll('td')[2].textContent).toEqual(grade.course_id.split(':')[1]);
    expect(firstDataRow.querySelectorAll('td')[3].textContent).toEqual(`${parseInt(Math.round(grade.percent_grade * 100), 10).toString()}%`);
    expect(firstDataRow.querySelectorAll('td')[4].textContent).toEqual(grade.letter_grade);
    expect(firstDataRow.querySelectorAll('td')[5].textContent).toEqual(grade.attempts.toString());
    expect(firstDataRow.querySelectorAll('td')[6].textContent).toEqual(new Date(grade.issue_date).toLocaleDateString());
    expect(firstDataRow.querySelectorAll('td')[7].textContent).toEqual('Earned');
  });
});
