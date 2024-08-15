import '@testing-library/jest-dom/extend-expect';
import { screen, render } from '@testing-library/react';
import PROVISIONING_PAGE_TEXT from '../../data/constants';
import ProvisioningFormInstructionAlert from '../ProvisioningFormInstructionAlert';

const { ALERTS } = PROVISIONING_PAGE_TEXT.FORM;

describe('ProvisioningFormInstructionAlert', () => {
  test.each([
    ['new', ALERTS.NEW_FORM],
    ['view', ALERTS.VIEW_FORM],
    ['edit', ALERTS.EDIT_FORM],
  ])('should render the correct content for %s mode', (mode, content) => {
    render(<ProvisioningFormInstructionAlert formMode={mode} />);
    expect(screen.getByText(content.TITLE)).toBeInTheDocument();
    expect(screen.getByText(content.DESCRIPTION)).toBeInTheDocument();
  });
});
