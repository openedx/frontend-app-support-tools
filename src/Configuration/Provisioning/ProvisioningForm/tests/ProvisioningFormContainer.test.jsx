/* eslint-disable react/prop-types */
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ROUTES from '../../../../data/constants/routes';
import { ProvisioningContext, initialStateValue } from '../../../testData/Provisioning';
import PROVISIONING_PAGE_TEXT from '../../data/constants';
import ProvisioningFormContainer from '../ProvisioningFormContainer';

const { FORM } = PROVISIONING_PAGE_TEXT;
const { CONFIGURATION: { SUB_DIRECTORY: { PROVISIONING } } } = ROUTES;

const ProvisioningFormContainerWrapper = ({
  value = initialStateValue,
}) => (
  <ProvisioningContext value={value}>
    <ProvisioningFormContainer />
  </ProvisioningContext>
);

describe('ProvisioningFormContainer', () => {
  it('renders', () => {
    render(
      <MemoryRouter initialEntries={[`${PROVISIONING.SUB_DIRECTORY.NEW}`]}>
        <ProvisioningFormContainerWrapper value={initialStateValue} />,
      </MemoryRouter>,
    );
    expect(screen.getByText(FORM.TITLE(PROVISIONING.SUB_DIRECTORY.NEW))).toBeTruthy();
  });
});
