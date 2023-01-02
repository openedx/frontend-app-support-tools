import { mount } from 'enzyme';
import React from 'react';
import { camelCaseObject } from '@edx/frontend-platform';
import { waitForComponentToPaint } from '../setupTest';
import ssoRecordsData from './data/test/ssoRecords';
import SingleSignOnRecordCard from './SingleSignOnRecordCard';
import { formatDate, formatUnixTimestamp } from '../utils';

describe.each(ssoRecordsData)('Single Sign On Record Card', (ssoRecordData) => {
  // prepare data
  const ssoRecordProp = camelCaseObject({
    ...ssoRecordData,
    extraData: JSON.parse(ssoRecordData.extraData),
  });

  let wrapper;
  let props;

  beforeEach(async () => {
    props = {
      ssoRecord: ssoRecordProp,
    };
    wrapper = mount(<SingleSignOnRecordCard {...props} />);
    await waitForComponentToPaint(wrapper);
  });

  it('SSO props', () => {
    const ssoRecord = wrapper.prop('ssoRecord');
    expect(ssoRecord).toEqual(props.ssoRecord);
  });

  it('No SSO Data', async () => {
    props = {
      ssoRecord: null,
    };
    wrapper = mount(<SingleSignOnRecordCard {...props} />);
    await waitForComponentToPaint(wrapper);

    expect(wrapper.isEmptyRender()).toBeTruthy();
  });

  it('SSO Record', () => {
    const provider = wrapper.find('h3.card-title');
    const uid = wrapper.find('h4.card-subtitle').at(0);
    const modified = wrapper.find('h4.card-subtitle').at(1);
    const history = wrapper.find('.history button.history-button');

    expect(provider.text()).toEqual(`${ssoRecordProp.provider} (Provider)`);
    expect(uid.text()).toEqual(`${ssoRecordProp.uid} (UID)`);
    expect(modified.text()).toEqual(`${formatDate(ssoRecordProp.modified)} (Last Modified)`);
    expect(history.text()).toEqual('History');
  });

  it('SSO Record History', () => {
    const historyRow = wrapper.find('.history button.history-button');
    expect(historyRow.text()).toEqual('History');

    historyRow.simulate('click');

    let modal = wrapper.find('.modal-content');
    expect(modal.exists()).toBeTruthy();
    expect(modal.find('.modal-title').text()).toEqual('SSO History');
    expect(modal.find('.modal-footer button').text()).toEqual('Close');

    const dataHeader = modal.find('thead tr th');
    const { history } = ssoRecordProp;
    expect(dataHeader).toHaveLength(6);
    const dataRow = modal.find('tbody tr');
    expect(dataRow).toHaveLength(history.length);

    history.forEach((historyRowData) => {
      dataHeader.forEach((header, index) => {
        const accessor = header.text();
        const text = dataRow.find('td').at(index).text();
        expect(accessor in historyRowData).toBeTruthy();
        if (accessor === 'authTime') {
          expect(text).toEqual(formatUnixTimestamp(historyRowData[accessor]));
        } else if (accessor === 'expires') {
          const expires = `${historyRowData[accessor].toString()}s`;
          expect(text).toEqual(expires);
        }
      });
    });
    modal.find('.modal-footer button').simulate('click');
    modal = wrapper.find('.modal-content');
    expect(modal.prop('open')).not.toBeTruthy();
  });

  it('SSO Record Additional Data', () => {
    const dataTable = wrapper.find('Table#sso-data-new');
    const dataHeader = dataTable.find('thead tr th');
    const dataBody = dataTable.find('tbody tr td');

    const { extraData } = ssoRecordProp;
    expect(dataHeader).toHaveLength(Object.keys(extraData).length);
    expect(dataBody).toHaveLength(Object.keys(extraData).length);

    for (let i = 0; i < dataHeader.length; i++) {
      const accesor = dataHeader.at(i).text();
      const text = dataBody.at(i).text();
      const value = extraData[accesor] ? extraData[accesor].toString() : '';

      expect(accesor in extraData).toBeTruthy();
      if (accesor === 'authTime') {
        expect(text).toEqual(formatUnixTimestamp(extraData[accesor]));
      } else if (accesor === 'expires') {
        const expires = extraData[accesor] ? `${extraData[accesor].toString()}s` : 'N/A';
        expect(text).toEqual(expires);
      } else {
        expect(text).toEqual(
          value.length > 14 ? 'Copy Show' : value,
        );
      }
    }
  });
});
