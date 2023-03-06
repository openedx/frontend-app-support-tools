import { IntlProvider } from '@edx/frontend-platform/i18n';
import PropTypes from 'prop-types';
import ProvisioningContextProvider from '../Provisioning/ProvisioningContext';

export const initialStateValue = {
  multipleFunds: undefined,
  customCatalog: false,
  formData: {
    policies: [],
  },
};

export const ProvisioningContext = ({
  children,
  value,
}) => (
  <IntlProvider locale="en">
    <ProvisioningContextProvider value={value}>
      {children}
    </ProvisioningContextProvider>
  </IntlProvider>
);

ProvisioningContext.propTypes = {
  children: PropTypes.node.isRequired,
  value: PropTypes.shape(),
};

ProvisioningContext.defaultProps = {
  value: initialStateValue,
};
