import {
  fireEvent, render, screen,
} from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import UserMessagesProvider from '../userMessages/UserMessagesProvider';
import * as api from './data/api';
import { credentials, noCredentials } from './data/test/credentials';
import LearnerCredentials from './LearnerCredentials';

const LearnerCredentialsWrapper = (props) => (
  <MemoryRouter>
    <IntlProvider locale="en">
      <UserMessagesProvider>
        <LearnerCredentials {...props} />
      </UserMessagesProvider>
    </IntlProvider>
  </MemoryRouter>
);

describe('Learner Credentials Tests', () => {
  let apiMock;
  const data = {
    username: 'edx',
  };

  beforeEach(() => {
    if (apiMock) {
      apiMock.mockReset();
    }
  });

  it('default page render', async () => {
    const { unmount } = render(<LearnerCredentialsWrapper username={data.username} />);
    apiMock = jest
      .spyOn(api, 'getUserProgramCredentials')
      .mockImplementationOnce(() => Promise.resolve(noCredentials));
    const heading = await screen.findByTestId('learnerCredentialsHeading');
    expect(heading.textContent).toEqual('Learner Credentials');
    const noCredentialsMessage = await screen.findByTestId('noCredentialsFoundMesaage');
    expect(noCredentialsMessage.textContent).toEqual('No Credentials were Found.');
    unmount();
  });

  it('Error render', async () => {
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
    apiMock = jest
      .spyOn(api, 'getUserProgramCredentials')
      .mockImplementationOnce(() => Promise.resolve(expectedError));
    const { unmount } = render(<LearnerCredentialsWrapper username={data.username} />);
    const errorAlert = await screen.findByTestId('noCredentialsErrorAlert');
    expect(errorAlert.textContent).toEqual(expectedError.errors[0].text);
    unmount();
  });

  it('Credentials Exist', async () => {
    apiMock = jest
      .spyOn(api, 'getUserProgramCredentials')
      .mockImplementationOnce(() => Promise.resolve(credentials));

    const { unmount } = render(<LearnerCredentialsWrapper username={data.username} />);

    // const dataTable = await screen.findByTestId('learnerCredentialsTable');
    const dataTableRows = await screen.findAllByTestId('learnerCredentialsTable-row');
    const headingRow = dataTableRows[0];
    const dataRow = dataTableRows[1];
    expect(headingRow.children[0].textContent).toEqual('Credential Type');
    expect(headingRow.children[1].textContent).toEqual('Program ID');
    expect(headingRow.children[2].textContent).toEqual('Status');
    expect(headingRow.children[3].textContent).toEqual('Certificate Link');
    expect(headingRow.children[4].textContent).toEqual('Attributes');

    const row = credentials.results[0];
    expect(dataRow.children[0].textContent).toEqual(row.credential.type);
    expect(dataRow.children[1].textContent).toEqual(
      row.credential.program_uuid,
    );
    expect(dataRow.children[2].textContent).toEqual(row.status);
    expect(dataRow.children[3].textContent).toEqual(row.uuid);
    expect(dataRow.children[3].children[0].href).toEqual(
      row.certificate_url,
    );
    expect(dataRow.children[4].querySelector('button').textContent).toEqual('Show');
    unmount();
  });

  it('Attributes Table', async () => {
    apiMock = jest
      .spyOn(api, 'getUserProgramCredentials')
      .mockImplementationOnce(() => Promise.resolve(credentials));

    const { unmount } = render(<LearnerCredentialsWrapper username={data.username} />);

    const attributeCell = (await screen.findAllByTestId('learnerCredentialsTable-row'))[1].children[4];
    const row = credentials.results[0];
    const showButton = attributeCell.querySelector('button');
    expect(showButton.textContent).toEqual('Show');
    fireEvent.click(showButton);

    const updatedAttributeCell = (await screen.findAllByTestId('learnerCredentialsTable-row'))[1].children[4];
    expect(updatedAttributeCell.querySelector('button').textContent).toEqual('Hide');

    const attributeTable = updatedAttributeCell.querySelectorAll('tr');
    // querying second index as the first one would be table heading
    expect(attributeTable[0].querySelectorAll('th')[0].textContent).toEqual('Name');
    expect(attributeTable[0].querySelectorAll('th')[1].textContent).toEqual('Value');
    expect(attributeTable[1].querySelectorAll('td')[0].textContent).toEqual(
      row.attributes[0].name,
    );
    expect(attributeTable[1].querySelectorAll('td')[1].textContent).toEqual(
      row.attributes[0].value,
    );

    const cellButton = updatedAttributeCell.querySelector('button');
    fireEvent.click(cellButton);

    expect((await screen.findAllByTestId('learnerCredentialsTable-row'))[1]
      .querySelectorAll('td')[4]
      .querySelector('button').textContent).toEqual('Show');
    unmount();
  });
});
