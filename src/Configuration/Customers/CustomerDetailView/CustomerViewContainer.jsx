import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { logError } from '@edx/frontend-platform/logging';
import {
  Breadcrumb,
  Stack,
  Container,
  Skeleton,
} from '@openedx/paragon';
import { useIntl } from '@edx/frontend-platform/i18n';
import CustomerCard from './CustomerCard';
import { getEnterpriseCustomer } from '../data/utils';

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
      <Container className="mt-5">
        <Breadcrumb
          arial-label="customer detail"
          links={[
            {
              label: intl.formatMessage({
                id: 'lcm.budget.detail.page.breadcrumb.budgets',
                defaultMessage: 'Budgets',
                description: 'Breadcrumb label for the budgets page',
              }),
            },
            { label: `${enterpriseCustomer.name}`, href: 'here' },
          ]}
        />
      </Container>
      <Container className="mt-4">
        <Stack gap={2}>
          {!isLoading ? <CustomerCard enterpriseCustomer={enterpriseCustomer} /> : <Skeleton height={230} />}
        </Stack>
      </Container>
    </div>
  );
};

export default CustomerViewContainer;
