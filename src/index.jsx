import 'babel-polyfill';
import {
  APP_INIT_ERROR,
  APP_READY,
  subscribe,
  initialize,
  mergeConfig,
  getConfig,
} from '@edx/frontend-platform';
import { AppProvider, ErrorPage } from '@edx/frontend-platform/react';
import { getAuthenticatedUser } from '@edx/frontend-platform/auth';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Routes, Route } from 'react-router-dom';

import { hasFeatureFlagEnabled } from '@edx/frontend-enterprise-utils';
import { v4 as uuidv4 } from 'uuid';
import Header from './supportHeader';
import messages from './i18n';
import SupportToolsTab from './SupportToolsTab/SupportToolsTab';
import UserPage from './users/UserPage';
import FBEIndexPage from './FeatureBasedEnrollments/FeatureBasedEnrollmentIndexPage';
import UserMessagesProvider from './userMessages/UserMessagesProvider';
import ProgramEnrollmentsIndexPage from './ProgramEnrollments/ProgramEnrollmentsIndexPage';
import Head from './head/Head';
import CustomersPage from './Configuration/Customers/CustomerDataTable/CustomersPage';

import './index.scss';
import ProvisioningPage from './Configuration/Provisioning/ProvisioningPage';
import ROUTES from './data/constants/routes';
import ConfigurationPage from './Configuration/ConfigurationPage';
import ProvisioningFormContainer from './Configuration/Provisioning/ProvisioningForm';
import SubsidyDetailViewContainer from './Configuration/Provisioning/SubsidyDetailView/SubsidyDetailViewContainer';
import ErrorPageContainer from './Configuration/Provisioning/ErrorPage';
import SubsidyEditViewContainer from './Configuration/Provisioning/SubsidyEditView/SubsidyEditViewContainer';
import CustomerViewContainer from './Configuration/Customers/CustomerDetailView/CustomerViewContainer';

const { CONFIGURATION, SUPPORT_TOOLS_TABS } = ROUTES;

subscribe(APP_READY, () => {
  const { administrator } = getAuthenticatedUser();
  const root = createRoot(document.getElementById('root'));

  if (!administrator) {
    root.render(
      <ErrorPage message="You do not have access to this page." />,
    );
    return;
  }

  const configurationRoutes = [
    <Route
      key={uuidv4()}
      path={CONFIGURATION.SUB_DIRECTORY.PROVISIONING.SUB_DIRECTORY.VIEW}
      element={<SubsidyDetailViewContainer />}
    />,
    <Route
      key={uuidv4()}
      path={CONFIGURATION.SUB_DIRECTORY.PROVISIONING.SUB_DIRECTORY.EDIT}
      element={<SubsidyEditViewContainer />}
    />,
    <Route
      key={uuidv4()}
      path={CONFIGURATION.SUB_DIRECTORY.PROVISIONING.SUB_DIRECTORY.NEW}
      element={<ProvisioningFormContainer />}
    />,
    <Route
      key={uuidv4()}
      path={CONFIGURATION.SUB_DIRECTORY.PROVISIONING.SUB_DIRECTORY.ERROR}
      element={(
        <ErrorPageContainer
          to={CONFIGURATION.SUB_DIRECTORY.PROVISIONING.HOME}
        />
      )}
    />,
    <Route
      key={uuidv4()}
      path={CONFIGURATION.SUB_DIRECTORY.PROVISIONING.HOME}
      element={<ProvisioningPage />}
    />,
    <Route
      key={uuidv4()}
      path={CONFIGURATION.HOME}
      element={<ConfigurationPage />}
    />,
  ];

  const customerRoutes = [
    <Route
      key={uuidv4()}
      path={CONFIGURATION.SUB_DIRECTORY.CUSTOMERS.HOME}
      element={<CustomersPage />}
    />,
    <Route
      key={uuidv4()}
      path={CONFIGURATION.SUB_DIRECTORY.CUSTOMERS.SUB_DIRECTORY.VIEW}
      element={<CustomerViewContainer />}
    />,
  ];

  root.render(
    <AppProvider>
      <UserMessagesProvider>
        <Head />
        <Header />
        <Routes>
          {
            getConfig().FEATURE_CUSTOMER_SUPPORT_VIEW === 'true'
            && customerRoutes
          }
          {
            getConfig().FEATURE_CONFIGURATION_MANAGEMENT
            && configurationRoutes
          }
          <Route
            path={`${SUPPORT_TOOLS_TABS.HOME}*`}
            element={<SupportToolsTab />}
          />
          <Route
            path={SUPPORT_TOOLS_TABS.SUB_DIRECTORY.LEARNER_INFORMATION}
            element={<UserPage />}
          />
          <Route
            path={SUPPORT_TOOLS_TABS.SUB_DIRECTORY.FEATURE_BASED_ENROLLMENTS}
            element={<FBEIndexPage />}
          />
          <Route
            path={SUPPORT_TOOLS_TABS.SUB_DIRECTORY.PROGRAM_ENROLLMENTS}
            element={<ProgramEnrollmentsIndexPage />}
          />
        </Routes>
      </UserMessagesProvider>
    </AppProvider>,
  );
});

subscribe(APP_INIT_ERROR, (error) => {
  const root = createRoot(document.getElementById('root'));
  root.render(<ErrorPage message={error.message} />);
});

initialize({
  handlers: {
    config: () => {
      mergeConfig({
        COMMERCE_COORDINATOR_ORDER_DETAILS_URL:
          process.env.COMMERCE_COORDINATOR_ORDER_DETAILS_URL || null,
        LICENSE_MANAGER_URL:
          process.env.LICENSE_MANAGER_URL || null,
        LICENSE_MANAGER_DJANGO_URL:
          process.env.LICENSE_MANAGER_DJANGO_URL || null,
        ADMIN_PORTAL_BASE_URL:
          process.env.ADMIN_PORTAL_BASE_URL || null,
        ENTERPRISE_ACCESS_BASE_URL:
          process.env.ENTERPRISE_ACCESS_BASE_URL || null,
        FEATURE_CONFIGURATION_MANAGEMENT:
          process.env.FEATURE_CONFIGURATION_MANAGEMENT
          || hasFeatureFlagEnabled('FEATURE_CONFIGURATION_MANAGEMENT')
          || null,
        FEATURE_CONFIGURATION_ENTERPRISE_PROVISION:
          process.env.FEATURE_CONFIGURATION_ENTERPRISE_PROVISION
          || hasFeatureFlagEnabled('FEATURE_CONFIGURATION_ENTERPRISE_PROVISION')
          || null,
        FEATURE_CONFIGURATION_EDIT_ENTERPRISE_PROVISION:
          process.env.FEATURE_CONFIGURATION_EDIT_ENTERPRISE_PROVISION
          || hasFeatureFlagEnabled('FEATURE_CONFIGURATION_EDIT_ENTERPRISE_PROVISION')
          || null,
        FEATURE_CUSTOMER_SUPPORT_VIEW:
          process.env.FEATURE_CUSTOMER_SUPPORT_VIEW
          || hasFeatureFlagEnabled('FEATURE_CUSTOMER_SUPPORT_VIEW')
          || null,
        SUBSIDY_BASE_URL:
          process.env.SUBSIDY_BASE_URL || null,
        SUBSIDY_BASE_DJANGO_URL:
          process.env.SUBSIDY_BASE_DJANGO_URL || null,
      });
    },
  },
  requireAuthenticatedUser: true,
  messages,
});
