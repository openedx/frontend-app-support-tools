import PropTypes from 'prop-types';
import {
  DataTable, Icon, OverlayTrigger, Stack, Tooltip,
} from '@openedx/paragon';
import { Check, InfoOutline } from '@openedx/paragon/icons';
import { FormattedMessage } from '@edx/frontend-platform/i18n';
import useActiveAssociatedPlans from '../data/hooks/useActiveAssociatedPlans';

const SubscriptionCheckIcon = ({ row }) => {
  if (row.original.hasActiveAgreements) {
    return <Icon src={Check} screenReaderText="subscription check" />;
  }
  return null;
};

const PolicyCheckIcon = ({ row }) => {
  if (row.original.hasActivePolicies) {
    return <Icon src={Check} screenReaderText="policy check" />;
  }
  return null;
};

const OtherSubsidiesCheckIcon = ({ row }) => {
  if (row.original.hasActiveOtherSubsidies) {
    return <Icon src={Check} screenReaderText="other subsidies check" />;
  }
  return null;
};

export const OtherSubsidies = () => (
  <Stack gap={1} direction="horizontal">
    <span data-testid="members-table-status-column-header">
      <FormattedMessage
        id="configuration.customersPage.otherSubsidiesColumn"
        defaultMessage="Other Subsidies"
        description="Other subsidies column header in the Customers table"
      />
    </span>
    <OverlayTrigger
      key="other-subsidies-tooltip"
      placement="top"
      overlay={(
        <Tooltip id="other-subsidies-tooltip">
          <div>
            <FormattedMessage
              id="configuration.customersPage.otherSubsidiesColumn.tooltip"
              defaultMessage="Includes offers and codes"
              description="Tooltip for the Other Subsidies column header in the Customers table"
            />
          </div>
        </Tooltip>
      )}
    >
      <Icon size="xs" src={InfoOutline} className="ml-1 d-inline-flex" />
    </OverlayTrigger>
  </Stack>
);

const CustomerDetailRowSubComponent = ({ row }) => {
  const enterpriseId = row.original.uuid;
  const { data, isLoading } = useActiveAssociatedPlans(enterpriseId);
  return (
    <div className="sub-component w-50">
      <DataTable
        itemCount={1}
        data={[data] || []}
        isLoading={isLoading}
        columns={[
          {
            Header: 'Subscription',
            accessor: 'hasActiveSubscription',
            Cell: SubscriptionCheckIcon,
          },
          {
            Header: 'Learner Credit',
            accessor: 'hasActivePolicies',
            Cell: PolicyCheckIcon,
          },
          {
            Header: OtherSubsidies,
            accessor: 'hasActiveOtherSubsidies',
            Cell: OtherSubsidiesCheckIcon,
          },
        ]}
      >
        <DataTable.Table />
      </DataTable>
    </div>
  );
};

CustomerDetailRowSubComponent.propTypes = {
  row: PropTypes.shape({
    original: PropTypes.shape({
      uuid: PropTypes.string,
    }),
  }).isRequired,
};

SubscriptionCheckIcon.propTypes = {
  row: PropTypes.shape({
    original: PropTypes.shape({
      hasActiveAgreements: PropTypes.bool,
    }),
  }).isRequired,
};

PolicyCheckIcon.propTypes = {
  row: PropTypes.shape({
    original: PropTypes.shape({
      hasActivePolicies: PropTypes.bool,
    }),
  }).isRequired,
};

OtherSubsidiesCheckIcon.propTypes = {
  row: PropTypes.shape({
    original: PropTypes.shape({
      hasActiveOtherSubsidies: PropTypes.bool,
    }),
  }).isRequired,
};

export default CustomerDetailRowSubComponent;
