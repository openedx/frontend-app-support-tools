import '@testing-library/jest-dom/extend-expect';
import { screen, render } from '@testing-library/react';
import ProvisioningFormHelpText from '../ProvisioningFormHelpText';

describe('ProvisioningFormInstructionAlert', () => {
  test('should render help text', () => {
    render(<ProvisioningFormHelpText />);
    expect(screen.getByText('Not editable')).toBeInTheDocument();
  });
});
