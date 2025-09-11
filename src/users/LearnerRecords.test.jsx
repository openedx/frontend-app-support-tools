import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import {
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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
  const data = { username: 'edx' };
  let apiMock;

  beforeEach(() => {
    if (apiMock) {
      apiMock.mockReset();
    }
  });

  it('renders a message with no results', async () => {
    apiMock = jest.spyOn(api, 'getLearnerRecords').mockResolvedValueOnce([]);

    render(<LearnerRecordsWrapper username={data.username} />);

    await waitFor(() => {
      expect(
        screen.getByText(`No results found for username: ${data.username}`),
      ).toBeInTheDocument();
    });
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

    apiMock = jest.spyOn(api, 'getLearnerRecords').mockResolvedValueOnce(expectedError);

    render(<LearnerRecordsWrapper username={data.username} />);

    await waitFor(() => {
      expect(
        screen.getByText(expectedError.errors[0].text),
      ).toBeInTheDocument();
    });
  });

  it('renders metadata for a program record', async () => {
    apiMock = jest.spyOn(api, 'getLearnerRecords').mockResolvedValueOnce(records);

    render(<LearnerRecordsWrapper username={data.username} />);

    const { program } = records[0].record;

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { level: 4, name: program.name }),
      ).toBeInTheDocument();
      expect(screen.getByText(program.type_name)).toBeInTheDocument();
      expect(screen.getByText('Partially Completed')).toBeInTheDocument();
      expect(
        screen.getByText(`Last updated: ${new Date(program.last_updated).toLocaleDateString()}`),
      ).toBeInTheDocument();
    });
  });

  it('copies a link to the clipboard when the "Copy Program Record link" button is clicked', async () => {
    apiMock = jest.spyOn(api, 'getLearnerRecords').mockResolvedValueOnce(records);

    Object.assign(navigator, {
      clipboard: { writeText: jest.fn() },
    });

    render(<LearnerRecordsWrapper username={data.username} />);

    const copyButton = await screen.findByRole('button', { name: /Copy public record link/i });
    await userEvent.click(copyButton);

    expect(navigator.clipboard.writeText).toHaveBeenCalledTimes(1);
  });

  it('renders an alert when there is no public instance of a record', async () => {
    const privateRecords = [...records];
    privateRecords[0].record.shared_program_record_uuid = '';

    apiMock = jest.spyOn(api, 'getLearnerRecords').mockResolvedValueOnce(privateRecords);

    render(<LearnerRecordsWrapper username={data.username} />);

    await waitFor(() => {
      expect(
        screen.getByText(
          'There is no public instance for this record. Learners must create a public link on their own.',
        ),
      ).toBeInTheDocument();
    });
  });

  it('renders a table for a program record', async () => {
    apiMock = jest.spyOn(api, 'getLearnerRecords').mockResolvedValueOnce(records);

    render(<LearnerRecordsWrapper username={data.username} />);

    const grade = records[0].record.grades[0];

    await waitFor(() => {
      expect(screen.getByText('Course Name')).toBeInTheDocument();
      expect(screen.getByText('School')).toBeInTheDocument();
      expect(screen.getByText('Course ID')).toBeInTheDocument();
      expect(screen.getByText('Highest grade earned')).toBeInTheDocument();
      expect(screen.getByText('Letter Grade')).toBeInTheDocument();
      expect(screen.getByText('Verified Attempts')).toBeInTheDocument();
      expect(screen.getByText('Date Earned')).toBeInTheDocument();
      expect(screen.getByText('Status')).toBeInTheDocument();

      const firstRow = screen.getByRole('row', { name: /intro to tightrope walking/i });
      expect(within(firstRow).getByText(grade.name)).toBeInTheDocument();
      expect(within(firstRow).getByText(grade.school)).toBeInTheDocument();
      expect(
        within(firstRow).getByText(grade.course_id.split(':')[1] || grade.course_id),
      ).toBeInTheDocument();
      expect(
        within(firstRow).getByText(`${parseInt(Math.round(grade.percent_grade * 100), 10)}%`),
      ).toBeInTheDocument();
      expect(within(firstRow).getByText(grade.letter_grade)).toBeInTheDocument();
      expect(within(firstRow).getByText(grade.attempts.toString())).toBeInTheDocument();
      expect(
        within(firstRow).getByText(new Date(grade.issue_date).toLocaleDateString()),
      ).toBeInTheDocument();
      expect(within(firstRow).getByText('Earned')).toBeInTheDocument();
    });
  });
});
