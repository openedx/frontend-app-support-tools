import { Breadcrumb, Stack, Container } from '@openedx/paragon';
import { useIntl } from '@edx/frontend-platform/i18n';
import CustomerCard from "./CustomerCard";
import { useState, useEffect, useCallback } from 'react';
import { useParams  } from 'react-router-dom';
import { getEnterpriseCustomer } from '../data/utils';
import { logError } from '@edx/frontend-platform/logging';

const CustomerViewContainer = () => {
  const { id } = useParams();
  const [enterpriseCustomer, setEnterpriseCustomer] = useState([])
  const [isLoading, setIsLoading] = useState(true);
  const intl = useIntl();

  const fetchData = useCallback(
    async () => {
      try {
        const enterpriseCustomer = await getEnterpriseCustomer(id);
        setEnterpriseCustomer(enterpriseCustomer);
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
      <Container className="mt-5">
        <Breadcrumb arialLabel="customer detail"
          links={[
            {
              label: intl.formatMessage({
                id: 'lcm.budget.detail.page.breadcrumb.budgets',
                defaultMessage: 'Budgets',
                description: 'Breadcrumb label for the budgets page',
              })
            },
            { label: `${enterpriseCustomer.name}`, href: 'here' }
          ]}
        />
      </Container>
      <Container className="mt-4">
        <Stack gap={2}>
          <CustomerCard enterpriseCustomer={enterpriseCustomer} />
        </Stack>
      </Container>
    </div>
  );
}

export default CustomerViewContainer;