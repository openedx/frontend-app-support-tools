/* eslint-disable react/prop-types */
import { renderWithRouter } from '@edx/frontend-enterprise-utils';
import { screen } from '@testing-library/react';
import ROUTES from '../../../../data/constants/routes';
import { ProvisioningContext, hydratedInitialState } from '../../../testData/Provisioning/ProvisioningContextWrapper';

import PROVISIONING_PAGE_TEXT from '../../data/constants';
import SubsidyEditViewContainer from '../SubsidyEditViewContainer';

const { FORM } = PROVISIONING_PAGE_TEXT;
const { CONFIGURATION: { SUB_DIRECTORY: { PROVISIONING } } } = ROUTES;

const SubsidyEditViewContainerWrapper = ({
  value = hydratedInitialState,
}) => (
  <ProvisioningContext value={value}>
    <SubsidyEditViewContainer />
  </ProvisioningContext>
);

describe('SubsidyEditViewContainer', () => {
  it('renders', () => {
    renderWithRouter(
      <SubsidyEditViewContainerWrapper value={hydratedInitialState} />,
      { route: `${PROVISIONING.SUB_DIRECTORY.EDIT}` },
    );
    expect(screen.getByText(FORM.TITLE(PROVISIONING.SUB_DIRECTORY.EDIT))).toBeTruthy();
  });
});
