/* eslint-disable react/prop-types */
import { renderWithRouter } from '@edx/frontend-enterprise-utils';
import { fireEvent, screen } from '@testing-library/react';
import { ProvisioningContext, initialStateValue } from '../../../../testData/Provisioning';
import PROVISIONING_PAGE_TEXT, { INITIAL_CATALOG_QUERIES } from '../../../data/constants';
import ProvisioningFormPerLearnerCap from '../ProvisioningFormPerLearnerCap';

const { LEARNER_CAP } = PROVISIONING_PAGE_TEXT.FORM;

const ProvisioningFormPerLearnerCapWrapper = ({
  value = initialStateValue,
  index = 0,
}) => (
  <ProvisioningContext value={value}>
    <ProvisioningFormPerLearnerCap index={index} />
  </ProvisioningContext>
);

describe('ProvisioningFormPerLearnerCap', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  it('renders single policy state', () => {
    const updatedInitialState = {
      ...initialStateValue,
      multipleFunds: false,
      formData: {
        ...initialStateValue.formData,
        policies: INITIAL_CATALOG_QUERIES.defaultQuery,
      },
    };
    renderWithRouter(
      <ProvisioningFormPerLearnerCapWrapper
        value={updatedInitialState}
        index={0}
      />,
    );

    expect(screen.getByText(LEARNER_CAP.TITLE)).toBeTruthy();
    expect(screen.getByText(LEARNER_CAP.SUB_TITLE)).toBeTruthy();

    const learnerCapOptions = Object.keys(LEARNER_CAP.OPTIONS);
    const learnerCapButtons = [];
    // Retrieves a list of input elements based on test ids
    for (let i = 0; i < learnerCapOptions.length; i++) {
      learnerCapButtons.push(screen.getByTestId(LEARNER_CAP.OPTIONS[learnerCapOptions[i]]));
    }
    // Clicks on each input element and checks if it is checked
    for (let i = 0; i < learnerCapButtons.length; i++) {
      fireEvent.click(learnerCapButtons[i]);
      expect(learnerCapButtons[i].checked).toBeTruthy();
    }
  });
});
