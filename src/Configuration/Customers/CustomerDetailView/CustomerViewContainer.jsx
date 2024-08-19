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
import CustomerPlanContainer from './CustomerPlanContainer';

const CustomerViewContainer = () => {
  const { id } = useParams();
  const [enterpriseCustomer, setEnterpriseCustomer] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const intl = useIntl();

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
  }, []);

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
        <Stack gap={2}>
          {!isLoading ? <CustomerPlanContainer slug={enterpriseCustomer.slug} /> : <Skeleton height={230} />}
        </Stack>
      </Container>
      <Container className="mt-4">
        <Stack gap={2}>
          <CustomerIntegrations
            slug={enterpriseCustomer.slug}
            activeIntegrations={enterpriseCustomer.activeIntegrations}
            activeSSO={enterpriseCustomer.activeSsoConfigurations}
            apiCredentialsEnabled={enterpriseCustomer.enableGenerationOfApiCredentials}
          />
        </Stack>
      </Container>
    </div>
  );
};

export default CustomerViewContainer;
