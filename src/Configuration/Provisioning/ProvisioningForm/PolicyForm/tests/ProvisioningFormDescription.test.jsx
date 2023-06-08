/* eslint-disable react/prop-types */
import { renderWithRouter } from '@edx/frontend-enterprise-utils';
import { screen, fireEvent } from '@testing-library/react';
import { ProvisioningContext, initialStateValue } from '../../../../testData';
import PROVISIONING_PAGE_TEXT from '../../../data/constants';
import ProvisioningFormDescription from '../ProvisioningFormDescription';

const { ACCOUNT_DESCRIPTION } = PROVISIONING_PAGE_TEXT.FORM;

const ProvisioningFormDescriptionWrapper = ({
  value = initialStateValue,
  index = 0,
}) => (
  <ProvisioningContext value={value}>
    <ProvisioningFormDescription index={index} />
  </ProvisioningContext>
);

// generate a string of length 256
const generateString = () => {
  let longString = '';
  for (let i = 0; i < 256; i++) {
    longString += 'a';
  }
  return longString;
};

describe('ProvisioningFormDescription', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  it('renders single policy state', () => {
    renderWithRouter(
      <ProvisioningFormDescriptionWrapper
        index={0}
      />,
    );
    expect(screen.getByText(ACCOUNT_DESCRIPTION.TITLE)).toBeTruthy();
    expect(screen.getByText(ACCOUNT_DESCRIPTION.SUB_TITLE)).toBeTruthy();
  });
  it('updates the form display name data on change', () => {
    renderWithRouter(
      <ProvisioningFormDescriptionWrapper
        index={0}
      />,
    );

    expect(screen.getByText(ACCOUNT_DESCRIPTION.SUB_TITLE)).toBeTruthy();
    const input = screen.getByTestId('account-description');
    fireEvent.change(input, { target: { value: 'test' } });
    expect(input.value).toBe('test');
    expect(screen.getByText(`${input.value.length}/${ACCOUNT_DESCRIPTION.MAX_LENGTH}`)).toBeTruthy();
  });
  it('does not allow more than 255 characters', () => {
    renderWithRouter(
      <ProvisioningFormDescriptionWrapper
        index={0}
      />,
    );
    const oversizedString = generateString();
    expect(oversizedString.length).toBe(256);
    const input = screen.getByTestId('account-description');
    fireEvent.change(input, { target: { value: oversizedString } });
    expect(screen.getByText(`0/${ACCOUNT_DESCRIPTION.MAX_LENGTH}`)).toBeTruthy();
    // the last character should not be added
    fireEvent.change(input, { target: { value: oversizedString.slice(0, -1) } });
    expect(input.value).toBe(oversizedString.slice(0, -1));
    expect(screen.getByText(`255/${ACCOUNT_DESCRIPTION.MAX_LENGTH}`)).toBeTruthy();
  });
});
