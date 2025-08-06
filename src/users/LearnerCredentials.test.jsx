import React from 'react';
import {
  render,
  screen,
  waitFor,
  fireEvent,
  within,
} from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { IntlProvider } from '@edx/frontend-platform/i18n';

import UserMessagesProvider from '../userMessages/UserMessagesProvider';
import * as api from './data/api';
import { credentials, noCredentials } from './data/test/credentials';
import LearnerCredentials from './LearnerCredentials';

const Wrapper = (props) => (
  <IntlProvider locale="en">
    <MemoryRouter>
      <UserMessagesProvider>
        <LearnerCredentials {...props} />
      </UserMessagesProvider>
    </MemoryRouter>
  </IntlProvider>
);

describe('Learner Credentials Tests', () => {
  const username = 'edx';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('default page render with no credentials', async () => {
    jest
      .spyOn(api, 'getUserProgramCredentials')
      .mockResolvedValueOnce(noCredentials);

    render(<Wrapper username={username} />);

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 3 }))
        .toHaveTextContent('Learner Credentials');
      expect(screen.getByText('No Credentials were Found.'))
        .toBeInTheDocument();
    });
  });

  it('error render', async () => {
    const expectedError = {
      errors: [
        {
          code: null,
          dismissible: true,
          text: 'There was an error retrieving credentials for the user',
          type: 'danger',
          topic: 'credentials',
        },
      ],
    };

    jest
      .spyOn(api, 'getUserProgramCredentials')
      .mockResolvedValueOnce(expectedError);

    render(<Wrapper username={username} />);

    await waitFor(() => {
      expect(screen.getByRole('alert'))
        .toHaveTextContent(expectedError.errors[0].text);
    });
  });

  it('credentials exist and render correctly', async () => {
    jest
      .spyOn(api, 'getUserProgramCredentials')
      .mockResolvedValueOnce(credentials);

    render(<Wrapper username={username} />);

    await waitFor(() => {
      const headers = screen.getAllByRole('columnheader');
      expect(headers[0]).toHaveTextContent('Credential Type');
      expect(headers[1]).toHaveTextContent('Program ID');
      expect(headers[2]).toHaveTextContent('Status');
      expect(headers[3]).toHaveTextContent('Certificate Link');
      expect(headers[4]).toHaveTextContent('Attributes');

      const row = credentials.results[0];
      const cells = screen.getAllByRole('cell');
      expect(cells[0]).toHaveTextContent(row.credential.type);
      expect(cells[1]).toHaveTextContent(row.credential.program_uuid);
      expect(cells[2]).toHaveTextContent(row.status);
      expect(cells[3].querySelector('a')).toHaveTextContent(row.uuid);
      expect(cells[3].querySelector('a'))
        .toHaveAttribute('href', row.certificate_url);
      expect(cells[4].querySelector('button')).toHaveTextContent('Show');
    });
  });

  it('attributes table toggles on Show/Hide click', async () => {
    jest
      .spyOn(api, 'getUserProgramCredentials')
      .mockResolvedValueOnce(credentials);

    render(<Wrapper username={username} />);

    const row = credentials.results[0];

    await waitFor(() => {
      const toggleButton = screen.getByRole('button', { name: /Show/i });
      expect(toggleButton).toBeInTheDocument();
      fireEvent.click(toggleButton);
    });

    await waitFor(() => {
      const hideButton = screen.getByRole('button', { name: /Hide/i });
      expect(hideButton).toBeInTheDocument();

      const attributesTable = screen.getAllByRole('table')[1];
      const attributeHeaders = within(attributesTable).getAllByRole('columnheader');
      expect(attributeHeaders[0]).toHaveTextContent('Name');
      expect(attributeHeaders[1]).toHaveTextContent('Value');

      const attributeCells = within(attributesTable).getAllByRole('cell');
      expect(attributeCells[0]).toHaveTextContent(row.attributes[0].name);
      expect(attributeCells[1]).toHaveTextContent(row.attributes[0].value);

      fireEvent.click(hideButton);
    });

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Show/i })).toBeInTheDocument();
    });
  });
});
