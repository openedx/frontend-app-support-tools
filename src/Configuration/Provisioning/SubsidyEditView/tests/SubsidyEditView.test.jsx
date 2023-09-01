/* eslint-disable react/prop-types */
import { renderWithRouter } from '@edx/frontend-enterprise-utils';
import { screen } from '@testing-library/react';
import { ProvisioningContext, hydratedInitialState } from '../../../testData/Provisioning/ProvisioningContextWrapper';
import PROVISIONING_PAGE_TEXT from '../../data/constants';
import SubsidyEditView from '../SubsidyEditView';

const { FORM } = PROVISIONING_PAGE_TEXT;

const SubsidyEditViewWrapper = ({
  value = hydratedInitialState,
}) => (
  <ProvisioningContext value={value}>
    <SubsidyEditView />
  </ProvisioningContext>
);

// TODO: Integration Tests
describe('SubsidyEditView', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  it('renders on true multiple funds', () => {
    renderWithRouter(<SubsidyEditViewWrapper value={{
      ...hydratedInitialState,
      multipleFunds: true,
    }}
    />);
    expect(screen.getByText(FORM.SUB_TITLE)).toBeTruthy();
  });
  it('renders on false multiple funds', () => {
    renderWithRouter(<SubsidyEditViewWrapper value={{
      ...hydratedInitialState,
      multipleFunds: false,
    }}
    />);
    expect(screen.getByText(FORM.SUB_TITLE)).toBeTruthy();
  });
  it('should render policy container given a sample catalog query', () => {
    const updatedStateValue = {
      ...hydratedInitialState,
      alertMessage: '',
      multipleFunds: true,
    };
    renderWithRouter(<SubsidyEditViewWrapper value={updatedStateValue} />);
    expect(screen.queryByText(FORM.ALERTS.unselectedAccountType)).toBeFalsy();
  });
});
