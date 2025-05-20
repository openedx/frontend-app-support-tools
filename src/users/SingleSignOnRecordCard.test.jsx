import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
import { camelCaseObject } from '@edx/frontend-platform';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import ssoRecordsData from './data/test/ssoRecords';
import SingleSignOnRecordCard from './SingleSignOnRecordCard';
import { formatDate, formatUnixTimestamp } from '../utils';

describe.each(ssoRecordsData)('Single Sign On Record Card', (ssoRecordData) => {
  // prepare data
  const ssoRecordProp = camelCaseObject({
    ...ssoRecordData,
    extraData: JSON.parse(ssoRecordData.extraData),
  });
  let props;

  beforeEach(async () => {
    props = {
      ssoRecord: ssoRecordProp,
    };
    render(<IntlProvider locale="en"><SingleSignOnRecordCard {...props} /></IntlProvider>);
  });

  it('SSO props', () => {
    // TODO: we can't test props directly in RTL
    // expect(screen.getByTestId('sso-record')).toHaveTextContent(JSON.stringify(props.ssoRecord));
  });

  it('No SSO Data', async () => {
    props = {
      ssoRecord: null,
    };
    const { container } = render(<SingleSignOnRecordCard {...props} />);

    expect(container).toBeEmptyDOMElement();
  });

  it('SSO Record', async () => {
    const card = await screen.findByTestId('singleSignOnCard');
    const provider = card.querySelector('.h3.card-title');
    const uid = card.querySelector('h4.text-left');
    const modified = card.querySelector('h4.text-right');
    const history = card.querySelector('.history button.history-button');

    expect(provider.textContent).toEqual(`${ssoRecordProp.provider} (Provider)`);
    expect(uid.textContent).toEqual(`${ssoRecordProp.uid} (UID)`);
    expect(modified.textContent).toEqual(`${formatDate(ssoRecordProp.modified)} (Last Modified)`);
    expect(history.textContent).toEqual('History');
  });

  it('SSO Record History', async () => {
    const historyRow = await screen.findByTestId('history-button');
    expect(historyRow.textContent).toEqual('History');

    fireEvent.click(historyRow);
    let modal = document.querySelector('.pgn__modal-content-container');
    expect(modal).toBeInTheDocument();
    expect(modal.querySelector('.pgn__modal-title').textContent).toEqual('SSO History');
    expect(modal.querySelector('.pgn__modal-footer button').textContent).toEqual('Close');

    const dataHeader = modal.querySelectorAll('thead tr th');
    const { history } = ssoRecordProp;
    expect(dataHeader).toHaveLength(6);
    const dataRow = modal.querySelectorAll('tbody tr');
    expect(dataRow).toHaveLength(history.length);

    history.forEach((historyRowData) => {
      dataHeader.forEach((header, index) => {
        const accessor = header.textContent;
        const text = dataRow[0].querySelectorAll('td')[index].textContent;
        expect(accessor in historyRowData).toBeTruthy();
        if (accessor === 'authTime') {
          expect(text).toEqual(formatUnixTimestamp(historyRowData[accessor]));
        } else if (accessor === 'expires') {
          const expires = `${historyRowData[accessor].toString()}s`;
          expect(text).toEqual(expires);
        }
      });
    });
    const button = modal.querySelector('.pgn__modal-footer button');
    fireEvent.click(button);
    modal = document.querySelector('.pgn__modal-content-container');
    expect(modal).not.toBeInTheDocument();
  });

  it('SSO Record Additional Data', async () => {
    const dataTable = await screen.findByTestId('sso-data-new');
    const dataHeader = dataTable.querySelectorAll('thead tr th');
    const dataBody = dataTable.querySelectorAll('tbody tr td');

    const { extraData } = ssoRecordProp;
    expect(dataHeader).toHaveLength(Object.keys(extraData).length);
    expect(dataBody).toHaveLength(Object.keys(extraData).length);

    for (let i = 0; i < dataHeader.length; i++) {
      const accessor = dataHeader[i].textContent;
      const text = dataBody[i].textContent;
      const value = extraData[accessor] ? extraData[accessor].toString() : '';

      expect(accessor in extraData).toBeTruthy();
      if (accessor === 'authTime') {
        expect(text).toEqual(formatUnixTimestamp(extraData[accessor]));
      } else if (accessor === 'expires') {
        const expires = extraData[accessor] ? `${extraData[accessor].toString()}s` : 'N/A';
        expect(text).toEqual(expires);
      } else {
        expect(text).toEqual(
          value.length > 14 ? 'Copy Show' : value,
        );
      }
    }
  });
});
