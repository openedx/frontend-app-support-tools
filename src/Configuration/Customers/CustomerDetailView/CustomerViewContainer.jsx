import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { logError } from '@edx/frontend-platform/logging';
import {
  Breadcrumb,
  Container,
  Skeleton,
  Stack,
} from '@openedx/paragon';
import { useIntl } from '@edx/frontend-platform/i18n';
import CustomerCard from './CustomerCard';
import { getEnterpriseCustomer } from '../data/utils';
import CustomerIntegrations from './CustomerIntegrations';
import EnterpriseCustomerUsersTable from './EnterpriseCustomerUsersTable';
import CustomerPlanContainer from './CustomerPlanContainer';
import useAllAssociatedPlans from '../data/hooks/useAllAssociatedPlans';

const CustomerViewContainer = () => {
  const { id } = useParams();
  const [enterpriseCustomer, setEnterpriseCustomer] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const intl = useIntl();
  const associatedPlans = useAllAssociatedPlans(id);

  const fetchData = useCallback(
    async () => {
      try {
        const response = await getEnterpriseCustomer({ uuid: id });
        setEnterpriseCustomer(response[0]);
      } catch (error) {
        logError(error);
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const renderPlanContainer = () => {
    if (!isLoading && !associatedPlans.isLoading
      && (associatedPlans.activeSubsidies.length > 0 || associatedPlans.activeSubscriptions.length > 0)) {
      return (
        <Stack gap={2}>
          <CustomerPlanContainer slug={enterpriseCustomer.slug} {...associatedPlans} />
        </Stack>
      );
    }
    if (!associatedPlans.isLoading
      && (!associatedPlans.activeSubsidies.length || !associatedPlans.activeSubscriptions.length)) {
      return false;
    }
    if (associatedPlans.isLoading) {
      return <Skeleton height={230} />;
    }
    return null;
  };

  return (
    <div>
      {!isLoading ? (
        <Container className="mt-5">
          <Breadcrumb
            arial-label="customer detail"
            links={[
              {
                label: intl.formatMessage({
                  id: 'supportTool.customers.page.breadcrumb.customer',
                  defaultMessage: 'Customers',
                  description: 'Breadcrumb label for the customers page',
                }),
                href: '/enterprise-configuration/customers',
              },
            ]}
            activeLabel={enterpriseCustomer.name}
          />
        </Container>
      ) : <Skeleton />}
      <Container className="mt-4">
        <Stack gap={2}>
          {!isLoading ? <CustomerCard enterpriseCustomer={enterpriseCustomer} /> : <Skeleton height={230} />}
        </Stack>
      </Container>
      <Container className="mt-4">
        {renderPlanContainer()}
      </Container>
      <Container className="mt-4 mb-4">
        <Stack gap={2}>
          <CustomerIntegrations
            slug={enterpriseCustomer.slug}
            activeIntegrations={enterpriseCustomer.activeIntegrations}
            activeSSO={enterpriseCustomer.activeSsoConfigurations}
            apiCredentialsEnabled={enterpriseCustomer.enableGenerationOfApiCredentials}
          />
          <EnterpriseCustomerUsersTable />
        </Stack>
      </Container>
    </div>
  );
};

export default CustomerViewContainer;
