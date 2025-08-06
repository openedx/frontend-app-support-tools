import React from 'react';
import {
  render,
  screen,
  within,
  fireEvent,
} from '@testing-library/react';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import { camelCaseObject } from '@edx/frontend-platform';
import ssoRecordsData from './data/test/ssoRecords';
import SingleSignOnRecordCard from './SingleSignOnRecordCard';
import { formatDate, formatUnixTimestamp } from '../utils';

const renderWithProviders = (props) => render(
  <IntlProvider locale="en">
    <SingleSignOnRecordCard {...props} />
  </IntlProvider>,
);

describe.each(ssoRecordsData)('Single Sign On Record Card', (ssoRecordData) => {
  const ssoRecordProp = camelCaseObject({
    ...ssoRecordData,
    extraData: JSON.parse(ssoRecordData.extraData),
  });

  let props;

  beforeEach(() => {
    props = { ssoRecord: ssoRecordProp };
  });

  it('SSO props', () => {
    renderWithProviders(props);
    expect(props.ssoRecord).toEqual(ssoRecordProp);
  });

  it('No SSO Data', () => {
    renderWithProviders({ ssoRecord: null });
    expect(screen.queryByText(/Provider/)).not.toBeInTheDocument();
  });

  it('SSO Record', () => {
    renderWithProviders(props);

    const providerHeading = screen.getAllByText(
      (_, element) => element.textContent === `${ssoRecordProp.provider} (Provider)`,
    )[0];
    expect(providerHeading).toBeInTheDocument();

    expect(
      screen.getByRole('heading', { name: `${ssoRecordProp.uid} (UID)` }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('heading', {
        name: `${formatDate(ssoRecordProp.modified)} (Last Modified)`,
      }),
    ).toBeInTheDocument();

    expect(screen.getByRole('button', { name: /history/i })).toBeInTheDocument();
  });

  it('SSO Record History', () => {
    renderWithProviders(props);

    fireEvent.click(screen.getByRole('button', { name: /history/i }));

    const modal = screen.getByRole('dialog');
    expect(within(modal).getByText('SSO History')).toBeInTheDocument();

    const closeButtons = within(modal).getAllByRole('button', { name: /close/i });
    expect(closeButtons.length).toBeGreaterThan(0);

    const headers = within(modal).getAllByRole('columnheader');
    expect(headers).toHaveLength(6);

    const rows = within(modal).getAllByRole('row').slice(1);
    expect(rows).toHaveLength(ssoRecordProp.history.length);

    fireEvent.click(closeButtons[0]);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('SSO Record Additional Data', () => {
    renderWithProviders(props);

    const card = screen
      .getAllByText(
        (content, element) => element.tagName.toLowerCase() === 'span'
          && content.includes(ssoRecordProp.provider),
      )
      .find((el) => el.closest('.pgn__card'))
      ?.closest('.pgn__card');

    if (!card) {
      throw new Error(`Card for provider ${ssoRecordProp.provider} not found`);
    }

    const dataTable = within(card).getByRole('table');
    const headers = within(dataTable).queryAllByRole('columnheader');
    const cells = within(dataTable).queryAllByRole('cell');
    const { extraData } = ssoRecordProp;

    if (cells.length === 0) {
      expect(headers.length).toBe(0);
      expect(cells.length).toBe(0);
      return;
    }

    if (headers.length > 0) {
      expect(headers).toHaveLength(Object.keys(extraData).length);
      expect(cells).toHaveLength(Object.keys(extraData).length);

      headers.forEach((header, i) => {
        const accessor = header.textContent.trim();
        const text = cells[i].textContent.trim();
        const value = extraData[accessor] ? extraData[accessor].toString() : '';

        expect(accessor in extraData).toBeTruthy();

        if (accessor === 'authTime') {
          expect(text).toEqual(formatUnixTimestamp(extraData[accessor]));
        } else if (accessor === 'expires') {
          const expires = extraData[accessor]
            ? `${extraData[accessor].toString()}s`
            : 'N/A';
          expect(text).toEqual(expires);
        } else {
          expect(text).toEqual(value.length > 14 ? 'Copy Show' : value);
        }
      });
    } else {
      expect(cells).toHaveLength(Object.keys(extraData).length);

      cells.forEach((cell, i) => {
        const accessor = Object.keys(extraData)[i];
        const text = cell.textContent.trim();
        const value = extraData[accessor] ? extraData[accessor].toString() : '';

        if (accessor === 'authTime') {
          expect(text).toEqual(formatUnixTimestamp(extraData[accessor]));
        } else if (accessor === 'expires') {
          const expires = extraData[accessor]
            ? `${extraData[accessor].toString()}s`
            : 'N/A';
          expect(text).toEqual(expires);
        } else {
          expect(text).toEqual(value.length > 14 ? 'Copy Show' : value);
        }
      });
    }
  });
});
