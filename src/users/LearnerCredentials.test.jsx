import { mount } from 'enzyme';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { waitFor } from '@testing-library/react';
import UserMessagesProvider from '../userMessages/UserMessagesProvider';
import * as api from './data/api';
import { credentials, noCredentials } from './data/test/credentials';
import LearnerCredentials from './LearnerCredentials';

const LearnerCredentialsWrapper = (props) => (
  <MemoryRouter>
    <UserMessagesProvider>
      <LearnerCredentials {...props} />
    </UserMessagesProvider>
  </MemoryRouter>
);

describe('Learner Credentials Tests', () => {
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

  it('default page render', async () => {
    wrapper = mount(<LearnerCredentialsWrapper username={data.username} />);
    apiMock = jest
      .spyOn(api, 'getUserProgramCredentials')
      .mockImplementationOnce(() => Promise.resolve(noCredentials));

    expect(wrapper.find('h3').text()).toEqual('Learner Credentials');
    expect(wrapper.find('p').text()).toEqual('No Credentials were Found.');
    wrapper.unmount();
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
    wrapper = mount(<LearnerCredentialsWrapper username={data.username} />);
    waitFor(() => expect(wrapper.find('.alert').text()).toEqual(expectedError.errors[0].text));
    wrapper.unmount();
  });

  it('Credentials Exist', async () => {
    apiMock = jest
      .spyOn(api, 'getUserProgramCredentials')
      .mockImplementationOnce(() => Promise.resolve(credentials));

    wrapper = mount(<LearnerCredentialsWrapper username={data.username} />);

    const dataTable = wrapper.find('table.custom-table tr');
    const headingRow = dataTable.at(0);
    const dataRow = dataTable.at(1);

    waitFor(() => {
      expect(headingRow.find('th').at(0).text()).toEqual('Credential Type');
      expect(headingRow.find('th').at(1).text()).toEqual('Program ID');
      expect(headingRow.find('th').at(2).text()).toEqual('Status');
      expect(headingRow.find('th').at(3).text()).toEqual('Certificate Link');
      expect(headingRow.find('th').at(4).text()).toEqual('Attributes');

      const row = credentials.results[0];
      expect(dataRow.find('td').at(0).text()).toEqual(row.credential.type);
      expect(dataRow.find('td').at(1).text()).toEqual(
        row.credential.program_uuid,
      );
      expect(dataRow.find('td').at(2).text()).toEqual(row.status);
      expect(dataRow.find('td').at(3).find('a').text()).toEqual(row.uuid);
      expect(dataRow.find('td').at(3).find('a').prop('href')).toEqual(
        row.certificate_url,
      );
      expect(dataRow.find('td').at(4).find('button').text()).toEqual('Show');
    });
    wrapper.unmount();
  });

  it('Attributes Table', async () => {
    apiMock = jest
      .spyOn(api, 'getUserProgramCredentials')
      .mockImplementationOnce(() => Promise.resolve(credentials));

    wrapper = mount(<LearnerCredentialsWrapper username={data.username} />);

    const attributeCell = wrapper
      .find('table.custom-table tr')
      .at(1)
      .find('td')
      .at(4);
    const row = credentials.results[0];
    waitFor(() => {
      expect(attributeCell.find('button').text()).toEqual('Show');
      attributeCell.find('button').simulate('click');
      attributeCell.update();

      const updatedAttributeCell = wrapper
        .find('table.custom-table tr')
        .at(1)
        .find('td')
        .at(4);
      expect(updatedAttributeCell.find('button').text()).toEqual('Hide');

      const attributeTable = updatedAttributeCell.find('table.custom-table tr');
      expect(attributeTable.at(0).find('th').at(0).text()).toEqual('Name');
      expect(attributeTable.at(0).find('th').at(1).text()).toEqual('Value');
      expect(attributeTable.at(1).find('td').at(0).text()).toEqual(
        row.attributes[0].name,
      );
      expect(attributeTable.at(1).find('td').at(1).text()).toEqual(
        row.attributes[0].value,
      );

      updatedAttributeCell.find('button').simulate('click');
      updatedAttributeCell.update();
      expect(
        wrapper
          .find('table.custom-table tr')
          .at(1)
          .find('td')
          .at(4)
          .find('button')
          .text(),
      ).toEqual('Show');
    });
    wrapper.unmount();
  });
});
