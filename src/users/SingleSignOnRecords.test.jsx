import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import SingleSignOnRecords from './SingleSignOnRecords';
import UserMessagesProvider from '../userMessages/UserMessagesProvider';
import ssoRecordsData from './data/test/ssoRecords';

import * as api from './data/api';

const SingleSignOnRecordsWrapper = (props) => (
  <IntlProvider locale="en">
    <UserMessagesProvider>
      <SingleSignOnRecords {...props} />
    </UserMessagesProvider>
  </IntlProvider>
);

describe('Single Sign On Records', () => {
  // prepare data
  const ssoRecords = ssoRecordsData.map((entry) => ({
    ...entry,
    extraData: JSON.parse(entry.extraData),
  }));

  let unmountComponent;
  let ssoRecordsMock;
  const props = {
    username: 'edX',
  };

  beforeEach(async () => {
    ssoRecordsMock = jest.spyOn(api, 'getSsoRecords').mockImplementationOnce(() => Promise.resolve(ssoRecords));
    const { unmount } = render(<SingleSignOnRecordsWrapper {...props} />);
    unmountComponent = unmount;
  });

  it('SSO props', () => {
    expect(ssoRecordsMock).toBeCalledWith(props.username);
  });

  it('SSO Data', async () => {
    const cardList = await screen.findAllByTestId('singleSignOnCard');
    expect(cardList).toHaveLength(ssoRecords.length);
    const ssoTitleHeader = await screen.findByTestId('ssoTitleHeader');
    expect(ssoTitleHeader.textContent).toEqual('Single Sign-on Records');
  });

  it('No SSO Data', async () => {
    unmountComponent();
    jest.spyOn(api, 'getSsoRecords').mockImplementationOnce(() => Promise.resolve([]));
    await render(<SingleSignOnRecordsWrapper {...props} />);

    const ssoTitleHeader = (await screen.findByTestId('ssoTitleHeader'));
    expect(ssoTitleHeader.textContent).toEqual('Single Sign-on Records');
    const cardList = await screen.queryAllByTestId('singleSignOnCard');
    expect(cardList).toHaveLength(0);

    const noRecordMessage = await screen.findByTestId('noSSORecordsMessage');
    expect(noRecordMessage.textContent).toEqual('No SSO Records were Found.');
  });

  it('Error fetching sso data', async () => {
    const ssoErrors = {
      errors: [
        {
          code: null,
          dismissible: true,
          text: 'Test Error',
          type: 'danger',
          topic: 'ssoRecords',
        },
      ],
    };
    jest.spyOn(api, 'getSsoRecords').mockImplementationOnce(() => Promise.resolve(ssoErrors));
    await render(<SingleSignOnRecordsWrapper {...props} />);

    const alert = await screen.findByTestId('singleSignOnAlertList');
    waitFor(() => expect(alert.textContent).toEqual(ssoErrors.errors[0].text));
  });
});
