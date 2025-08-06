import React from 'react';
import { render, screen } from '@testing-library/react';
import { camelCaseObject } from '@edx/frontend-platform';
import licenseData from '../data/test/licenses';
import LicenseCard from './LicenseCard';
import { formatDate } from '../../utils';

describe.each(licenseData.results)('License Record Card', (licenseRecord) => {
  const licenseRecordProp = camelCaseObject(licenseRecord);
  let props;

  beforeEach(() => {
    props = {
      licenseRecord: licenseRecordProp,
    };
  });

  it('License props', () => {
    render(<LicenseCard {...props} />);
    expect(screen.getByText(props.licenseRecord.subscriptionPlanTitle)).toBeInTheDocument();
    expect(screen.getByText(props.licenseRecord.status)).toBeInTheDocument();
    expect(
      screen.getByText(`Plan Expiration: ${formatDate(props.licenseRecord.subscriptionPlanExpirationDate)}`),
    ).toBeInTheDocument();
  });

  it('No License Data', () => {
    const { container } = render(<LicenseCard licenseRecord={null} />);
    expect(container.firstChild).toBeNull();
  });

  it('License Record', () => {
    render(<LicenseCard licenseRecord={licenseRecordProp} />);
    expect(screen.getByText(licenseRecordProp.subscriptionPlanTitle)).toBeInTheDocument();
    expect(screen.getByText(licenseRecordProp.status)).toBeInTheDocument();

    const formattedDate = formatDate(licenseRecordProp.subscriptionPlanExpirationDate);
    expect(screen.getByText(`Plan Expiration: ${formattedDate}`)).toBeInTheDocument();
  });

  it('License Record Additional Data', () => {
    render(<LicenseCard licenseRecord={licenseRecordProp} />);
    const table = screen.getByRole('table');

    const headers = table.querySelectorAll('thead tr th');
    const cells = table.querySelectorAll('tbody tr td');

    const expectedLength = Object.keys(licenseRecordProp).length - 3;
    expect(headers).toHaveLength(expectedLength);
    expect(cells).toHaveLength(expectedLength);
  });
});
