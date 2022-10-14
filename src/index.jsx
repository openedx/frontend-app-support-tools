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
import { Helmet } from 'react-helmet';
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

import './index.scss';

mergeConfig({
  LICENSE_MANAGER_URL: process.env.LICENSE_MANAGER_URL,
  RECORDS_BASE_URL: process.env.RECORDS_BASE_URL,
  USE_LEARNER_RECORD_TAB: process.env.USE_LEARNER_RECORD_TAB,
});

subscribe(APP_READY, () => {
  const { administrator } = getAuthenticatedUser();
  if (!administrator) {
    ReactDOM.render(<ErrorPage message="You do not have access to this page." />, document.getElementById('root'));
    return;
  }
  ReactDOM.render(
    <AppProvider>
      <UserMessagesProvider>
        <Header />
        <Helmet>
          <link rel="shortcut icon" href={getConfig().FAVICON_URL} type="image/x-icon" />
        </Helmet>
        <Switch>
          <Route path="/" component={SupportToolsTab} />
          <Route path="/learner_information" component={UserPage} />
          <Route path="/feature_based_enrollments" component={FBEIndexPage} />
          <Route path="/program_enrollments" component={ProgramEnrollmentsIndexPage} />
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
