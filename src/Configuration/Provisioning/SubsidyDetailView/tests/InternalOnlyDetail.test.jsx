import '@testing-library/jest-dom';
import { screen, render } from '@testing-library/react';
import InternalOnlyDetail from '../InternalOnlyDetail';
import PROVISIONING_PAGE_TEXT from '../../data/constants';

const { FORM: { INTERNAL_ONLY } } = PROVISIONING_PAGE_TEXT;

describe('InternalOnlyDetail', () => {
  it('renders component with test plan label if isInternalOnly is true', () => {
    render(<InternalOnlyDetail isInternalOnly />);
    expect(screen.getByText(INTERNAL_ONLY.CHECKBOX.label)).toBeInTheDocument();
  });

  it('renders component with test plan label if isInternalOnly is false ', () => {
    render(<InternalOnlyDetail isInternalOnly={false} />);
    expect(screen.queryByText(INTERNAL_ONLY.CHECKBOX.label)).toBeNull();
  });
});
