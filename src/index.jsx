import 'babel-polyfill';

import {
  APP_INIT_ERROR, APP_READY, subscribe, initialize, mergeConfig, getConfig,
} from '@edx/frontend-platform';
import { AppProvider, ErrorPage } from '@edx/frontend-platform/react';
import { getAuthenticatedUser } from '@edx/frontend-platform/auth';
import React from 'react';
import ReactDOM from 'react-dom';
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

import './index.scss';
import ProvisioningPage from './Configuration/Provisioning/ProvisioningPage';
import ROUTES from './data/constants/routes';
import ConfigurationPage from './Configuration/ConfigurationPage';
import ProvisioningFormContainer from './Configuration/Provisioning/ProvisioningForm';
import SubsidyDetailViewContainer from './Configuration/Provisioning/SubsidyDetailView/SubsidyDetailViewContainer';
import ErrorPageContainer from './Configuration/Provisioning/ErrorPage';

const { CONFIGURATION, SUPPORT_TOOLS_TABS } = ROUTES;

subscribe(APP_READY, () => {
  const { administrator } = getAuthenticatedUser();
  if (!administrator) {
    ReactDOM.render(<ErrorPage message="You do not have access to this page." />, document.getElementById('root'));
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
      element={<ProvisioningFormContainer />}
    />,
    <Route
      key={uuidv4()}
      path={CONFIGURATION.SUB_DIRECTORY.PROVISIONING.SUB_DIRECTORY.NEW}
      element={<ProvisioningFormContainer />}
    />,
    <Route
      key={uuidv4()}
      path={CONFIGURATION.SUB_DIRECTORY.PROVISIONING.SUB_DIRECTORY.ERROR}
      element={<ErrorPageContainer to={CONFIGURATION.SUB_DIRECTORY.PROVISIONING.HOME} />}
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
  ReactDOM.render(
    <AppProvider>
      <UserMessagesProvider>
        <Head />
        <Header />
        <Routes>
          {/* Start: Configuration Dropdown Routes */}
          {getConfig().FEATURE_CONFIGURATION_MANAGEMENT && configurationRoutes}
          {/* End: Configuration Dropdown Routes */}
          <Route path={`${SUPPORT_TOOLS_TABS.HOME}*`} element={<SupportToolsTab />} />
          <Route path={SUPPORT_TOOLS_TABS.SUB_DIRECTORY.LEARNER_INFORMATION} element={<UserPage />} />
          <Route path={SUPPORT_TOOLS_TABS.SUB_DIRECTORY.FEATURE_BASED_ENROLLMENTS} element={<FBEIndexPage />} />
          <Route
            path={SUPPORT_TOOLS_TABS.SUB_DIRECTORY.PROGRAM_ENROLLMENTS}
            element={<ProgramEnrollmentsIndexPage />}
          />
        </Routes>
      </UserMessagesProvider>
    </AppProvider>,
    document.getElementById('root'),
  );
});

subscribe(APP_INIT_ERROR, (error) => {
  ReactDOM.render(<ErrorPage message={error.message} />, document.getElementById('root'));
});

initialize({
  handlers: {
    config: () => {
      mergeConfig({
        LICENSE_MANAGER_URL: process.env.LICENSE_MANAGER_URL || null,
        ENTERPRISE_ACCESS_BASE_URL: process.env.ENTERPRISE_ACCESS_BASE_URL || null,
        FEATURE_CONFIGURATION_MANAGEMENT: process.env.FEATURE_CONFIGURATION_MANAGEMENT || hasFeatureFlagEnabled('FEATURE_CONFIGURATION_MANAGEMENT') || null,
        FEATURE_CONFIGURATION_ENTERPRISE_PROVISION: process.env.FEATURE_CONFIGURATION_ENTERPRISE_PROVISION || hasFeatureFlagEnabled('FEATURE_CONFIGURATION_ENTERPRISE_PROVISION') || null,
        FEATURE_CONFIGURATION_EDIT_ENTERPRISE_PROVISION: process.env.FEATURE_CONFIGURATION_EDIT_ENTERPRISE_PROVISION || hasFeatureFlagEnabled('FEATURE_CONFIGURATION_EDIT_ENTERPRISE_PROVISION') || null,
        SUBSIDY_BASE_URL: process.env.SUBSIDY_BASE_URL || null,
      });
    },
  },
  requireAuthenticatedUser: true,
  messages,
});
