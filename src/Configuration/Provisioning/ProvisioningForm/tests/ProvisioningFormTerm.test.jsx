/* eslint-disable react/prop-types */
import { renderWithRouter } from '@edx/frontend-enterprise-utils';
import { fireEvent, screen } from '@testing-library/react';
import { ProvisioningContext, initialStateValue } from '../../../testData/Provisioning';
import PROVISIONING_PAGE_TEXT from '../../data/constants';
import ProvisioningFormTerm from '../ProvisioningFormTerm';

const { TERM } = PROVISIONING_PAGE_TEXT.FORM;

const ProvisioningFormTermWrapper = ({
  value = initialStateValue,
}) => (
  <ProvisioningContext value={value}>
    <ProvisioningFormTerm />
  </ProvisioningContext>
);

describe('ProvisioningFormTerm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('renders', () => {
    renderWithRouter(<ProvisioningFormTermWrapper />);

    expect(screen.getByText(TERM.TITLE)).toBeTruthy();
  });
  it('renders start date', () => {
    renderWithRouter(<ProvisioningFormTermWrapper />);

    const input = screen.getByTestId('start-date');
    fireEvent.change(input, { target: { value: '2021-01-01' } });
    const inputValue = input.getAttribute('value');

    expect(screen.getByText(TERM.OPTIONS.startDate)).toBeTruthy();
    expect(inputValue).toEqual('2021-01-01');
  });
  it('renders end date', () => {
    renderWithRouter(<ProvisioningFormTermWrapper />);

    const input = screen.getByTestId('end-date');
    fireEvent.change(input, { target: { value: '2021-01-01' } });
    const inputValue = input.getAttribute('value');

    expect(screen.getByText(TERM.OPTIONS.endDate)).toBeTruthy();
    expect(inputValue).toEqual('2021-01-01');
  });
  it('checks validity', () => {
    renderWithRouter(<ProvisioningFormTermWrapper />);

    const startDateInput = screen.getByTestId('start-date');
    fireEvent.change(startDateInput, { target: { value: '2021-01-01' } });
    const startDateInputValue = startDateInput.getAttribute('value');

    const endDateInput = screen.getByTestId('end-date');
    fireEvent.change(endDateInput, { target: { value: '2020-01-01' } });
    const endDateInputValue = endDateInput.getAttribute('value');

    expect(screen.getByText(TERM.OPTIONS.endDate)).toBeTruthy();
    expect(startDateInputValue).toEqual('2021-01-01');

    expect(screen.getByText(TERM.OPTIONS.endDate)).toBeTruthy();
    expect(endDateInputValue).toEqual('2020-01-01');

    expect(screen.getByText(TERM.ERROR.validity)).toBeTruthy();

    fireEvent.change(endDateInput, { target: { value: 'foo' } });
    const invalidEndDateInputValue = endDateInput.getAttribute('value');
    expect(invalidEndDateInputValue).toEqual('');
    expect(startDateInput.getAttribute('value')).toEqual('2021-01-01');

    fireEvent.change(startDateInput, { target: { value: '2020/09/08' } });
    const invalidStartDateInputValue = startDateInput.getAttribute('value');
    expect(invalidStartDateInputValue).toEqual('');
  });
});
