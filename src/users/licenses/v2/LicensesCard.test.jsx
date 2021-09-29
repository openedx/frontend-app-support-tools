import { mount } from 'enzyme';
import React from 'react';
import { camelCaseObject } from '@edx/frontend-platform';
import { waitForComponentToPaint } from '../../../setupTest';
import licenseData from '../../data/test/licenses';
import LicenseCard from './LicenseCard';
import { formatDate } from '../../../utils';

describe.each(licenseData.results)('License Record Card', (licenseRecord) => {
  // prepare data
  const licenseRecordProp = camelCaseObject(licenseRecord);

  let wrapper;
  let props;

  beforeEach(async () => {
    props = {
      licenseRecord: licenseRecordProp,
    };
    wrapper = mount(<LicenseCard {...props} />);
    await waitForComponentToPaint(wrapper);
  });

  it('License props', () => {
    const licenseRecordProps = wrapper.prop('licenseRecord');
    expect(licenseRecordProps).toEqual(props.licenseRecord);
  });

  it('No License Data', async () => {
    props = {
      licenseRecord: null,
    };
    wrapper = mount(<LicenseCard {...props} />);
    await waitForComponentToPaint(wrapper);

    expect(wrapper.isEmptyRender()).toBeTruthy();
  });

  it('License Record', () => {
    const title = wrapper.find('h3.card-title');
    const status = wrapper.find('h4.card-subtitle').at(0);
    const expire = wrapper.find('h4.card-subtitle').at(1);

    expect(title.text()).toEqual(licenseRecordProp.subscriptionPlanTitle);
    expect(status.text()).toEqual(licenseRecordProp.status);
    expect(expire.text()).toEqual(`Plan Expiration: ${formatDate(licenseRecordProp.subscriptionPlanExpirationDate)}`);
  });

  it('License Record Additional Data', () => {
    const dataTable = wrapper.find('Table#license-data-new');
    const dataHeader = dataTable.find('thead tr th');
    const dataBody = dataTable.find('tbody tr td');

    expect(dataHeader).toHaveLength(Object.keys(licenseRecordProp).length - 3);
    expect(dataBody).toHaveLength(Object.keys(licenseRecordProp).length - 3);
  });
});
