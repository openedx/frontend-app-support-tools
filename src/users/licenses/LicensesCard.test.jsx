import { render, screen } from '@testing-library/react';
import React from 'react';
import { camelCaseObject } from '@edx/frontend-platform';
import licenseData from '../data/test/licenses';
import LicenseCard from './LicenseCard';
import { formatDate } from '../../utils';

describe.each(licenseData.results)('License Record Card', (licenseRecord) => {
  // prepare data
  const licenseRecordProp = camelCaseObject(licenseRecord);

  let wrapper;
  let props;

  beforeEach(async () => {
    props = {
      licenseRecord: licenseRecordProp,
    };
    const { container } = render(<LicenseCard {...props} />);
    wrapper = container;
  });

  it('License props', async () => {
    const licenseRecordTitle = await screen.findByTestId('license-card-title');
    const licenseRecordStatus = await screen.findByTestId('license-card-status');
    expect(licenseRecordTitle.textContent).toEqual(props.licenseRecord.subscriptionPlanTitle);
    expect(licenseRecordStatus.textContent).toEqual(props.licenseRecord.status);
  });

  it('No License Data', async () => {
    props = {
      licenseRecord: null,
    };
    const { container } = render(<LicenseCard {...props} />);

    expect(container.firstChild).toBeNull();
  });

  it('License Record', () => {
    const title = wrapper.querySelector('.h3.card-title');
    const status = wrapper.querySelector('h4.text-left');
    const expire = wrapper.querySelector('h4.text-right');

    expect(title.textContent).toEqual(licenseRecordProp.subscriptionPlanTitle);
    expect(status.textContent).toEqual(licenseRecordProp.status);
    expect(expire.textContent).toEqual(`Plan Expiration: ${formatDate(licenseRecordProp.subscriptionPlanExpirationDate)}`);
  });

  it('License Record Additional Data', async () => {
    const dataTable = await screen.findByTestId('license-card-table');
    const dataHeader = dataTable.querySelectorAll('thead tr th');
    const dataBody = dataTable.querySelectorAll('tbody tr td');

    expect(dataHeader).toHaveLength(Object.keys(licenseRecordProp).length - 3);
    expect(dataBody).toHaveLength(Object.keys(licenseRecordProp).length - 3);
  });
});
