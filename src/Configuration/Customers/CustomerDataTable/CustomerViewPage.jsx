import { useCallback, useEffect, useState } from 'react';
import {
  Breadcrumb, Button, Card, Container, Icon, Skeleton, Toast,
} from '@openedx/paragon';
import { ContentCopy } from '@openedx/paragon/icons';

import { camelCaseObject } from '@edx/frontend-platform';
import { logError } from '@edx/frontend-platform/logging';

import dayjs from 'dayjs';
import LmsApiService from '../../../data/services/EnterpriseApiService';
import CustomerViewCard from './CustomerViewCard';

const CustomerViewPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [ssoData, setSSOData] = useState();
  const [configData, setConfigData] = useState()

  const uuid = window.location.pathname.split(/(customers\/)(.+)(\/view)/g)[2];
  
  const ssoCreatedDate = dayjs(ssoData?.created).utc().format('MMMM D, YYYY');
  const ssoLastModifiedDate = dayjs(ssoData?.modified).utc().format('MMMM D, YYYY');
  const ssoDateText = `Created ${ssoCreatedDate} • Last modified ${ssoLastModifiedDate}`;
  const configLastModifiedDate = dayjs(configData?.last_modified_at).utc().format('MMMM D, YYYY');
  const configDateText = `Last modified ${configLastModifiedDate}`;

  const fetchData = useCallback(
    async () => {
      try {
        const options = {'enterprise_customer': uuid};
        const ssoData = await LmsApiService.fetchEnterpriseCustomerSSOConfigs(options);
        setSSOData(camelCaseObject(ssoData.data))
        const configData = await LmsApiService.fetchIntegratedChannels(options);
        setConfigData(camelCaseObject(configData.data));
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

  return (
    <Container className="mt-3 pr-6">
      {isLoading ? <Skeleton count={4} /> : 
        <div>
        <h2 className="pt-4">Associated Integrations</h2>
        {ssoData && ssoData.map((sso) => (
          <CustomerViewCard
            header="SSO"
            title={sso.displayName}
            subtext={ssoDateText}
            button2="Open in Admin Portal"
            button2Link=""
          />
        ))}
        {configData && configData.map((config) => (
          <CustomerViewCard
            header="Learner platform"
            title={config.channelCode}
            subtext={configDateText}
            button2="Open in Admin Portal"
            button2Link=""
          />
        ))}
        </div>
    }
    </Container>
  );
};

export default CustomerViewPage;

