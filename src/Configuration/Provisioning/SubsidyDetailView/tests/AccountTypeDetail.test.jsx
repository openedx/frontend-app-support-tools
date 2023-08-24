import '@testing-library/jest-dom/extend-expect';
import { screen, render } from '@testing-library/react';
import PROVISIONING_PAGE_TEXT from '../../data/constants';
import AccountTypeDetail from '../AccountTypeDetail';

const { FORM: { ACCOUNT_CREATION } } = PROVISIONING_PAGE_TEXT;

describe('AccountTypeDetail', () => {
  it(`renders ${ACCOUNT_CREATION.OPTIONS.multiple} if isMultipleFunds is true`, () => {
    render(<AccountTypeDetail isMultipleFunds />);
    expect(screen.getByText(ACCOUNT_CREATION.OPTIONS.multiple)).toBeInTheDocument();
    expect(screen.queryByText(ACCOUNT_CREATION.OPTIONS.single)).toBeNull();
  });

  it(`renders ${ACCOUNT_CREATION.OPTIONS.single} if isMultipleFunds is false`, () => {
    render(<AccountTypeDetail isMultipleFunds={false} />);
    expect(screen.getByText(ACCOUNT_CREATION.OPTIONS.single)).toBeInTheDocument();
    expect(screen.queryByText(ACCOUNT_CREATION.OPTIONS.multiple)).toBeNull();
  });
});
