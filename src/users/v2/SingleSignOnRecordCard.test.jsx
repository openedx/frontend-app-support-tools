import { mount } from 'enzyme';
import React from 'react';
import { camelCaseObject } from '@edx/frontend-platform';
import { waitForComponentToPaint } from '../../setupTest';
import ssoRecordsData from '../data/test/ssoRecords';
import SingleSignOnRecordCard from './SingleSignOnRecordCard';
import { formatDate, formatUnixTimestamp } from '../../utils';

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

    expect(provider.text()).toEqual(`${ssoRecordProp.provider} (Provider)`);
    expect(uid.text()).toEqual(`${ssoRecordProp.uid} (UID)`);
    expect(modified.text()).toEqual(`${formatDate(ssoRecordProp.modified)} (Last Modified)`);
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
          value.length > 14 ? 'CopyShow' : value,
        );
      }
    }
  });
});
