/* eslint-disable react/prop-types */
import { renderWithRouter } from '@edx/frontend-enterprise-utils';
import { screen } from '@testing-library/react';
import ROUTES from '../../../../data/constants/routes';
import { ProvisioningContext, initialStateValue } from '../../../testData';
import PROVISIONING_PAGE_TEXT from '../../data/constants';
import ProvisioningFormContainer from '../ProvisioningFormContainer';
import '@testing-library/jest-dom/extend-expect';

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
    renderWithRouter(
      <ProvisioningFormContainerWrapper value={initialStateValue} />,
      { route: `${PROVISIONING.SUB_DIRECTORY.NEW}` },
    );
    expect(screen.getByText(FORM.TITLE(PROVISIONING.SUB_DIRECTORY.NEW))).toBeInTheDocument();
  });
});
