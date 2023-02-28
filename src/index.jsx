import 'babel-polyfill';

import {
  APP_INIT_ERROR, APP_READY, subscribe, initialize, mergeConfig,
} from '@edx/frontend-platform';
import { AppProvider, ErrorPage } from '@edx/frontend-platform/react';
import { getAuthenticatedUser } from '@edx/frontend-platform/auth';
import React from 'react';
import ReactDOM from 'react-dom';
import { Switch, Route } from 'react-router-dom';

import Header from './supportHeader';
import appMessages from './i18n';
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

const { CONFIGURATION, SUPPORT_TOOLS_TABS } = ROUTES;
mergeConfig({
  LICENSE_MANAGER_URL: process.env.LICENSE_MANAGER_URL,
});
subscribe(APP_READY, () => {
  const { administrator } = getAuthenticatedUser();
  if (!administrator) {
    ReactDOM.render(<ErrorPage message="You do not have access to this page." />, document.getElementById('root'));
    return;
  }
  const configurationRoutes = [
    <Route path={CONFIGURATION.SUB_DIRECTORY.PROVISIONING.SUB_DIRECTORY.EDIT} component={ProvisioningFormContainer} />,
    <Route path={CONFIGURATION.SUB_DIRECTORY.PROVISIONING.SUB_DIRECTORY.NEW} component={ProvisioningFormContainer} />,
    <Route path={CONFIGURATION.SUB_DIRECTORY.PROVISIONING.HOME} component={ProvisioningPage} />,
    <Route path={CONFIGURATION.HOME} component={ConfigurationPage} />,
  ];
  ReactDOM.render(
    <AppProvider>
      <UserMessagesProvider>
        <Head />
        <Header />
        <Switch>
          {/* Start: Configuration Dropdown Routes */}
          {process.env.FEATURE_CONFIGURATION_MANAGEMENT && configurationRoutes.map((route) => route)}
          {/* End: Configuration Dropdown Routes */}
          <Route path={SUPPORT_TOOLS_TABS.HOME} component={SupportToolsTab} />
          <Route path={SUPPORT_TOOLS_TABS.SUB_DIRECTORY.LEARNER_INFORMATION} component={UserPage} />
          <Route path={SUPPORT_TOOLS_TABS.SUB_DIRECTORY.FEATURE_BASED_ENROLLMENTS} component={FBEIndexPage} />
          <Route path={SUPPORT_TOOLS_TABS.SUB_DIRECTORY.PROGRAM_ENROLLMENTS} component={ProgramEnrollmentsIndexPage} />
        </Switch>
      </UserMessagesProvider>
    </AppProvider>,
    document.getElementById('root'),
  );
});

subscribe(APP_INIT_ERROR, (error) => {
  ReactDOM.render(<ErrorPage message={error.message} />, document.getElementById('root'));
});

initialize({
  requireAuthenticatedUser: true,
  messages: [
    appMessages,
  ],
});
