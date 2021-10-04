import 'babel-polyfill';

import {
  APP_INIT_ERROR, APP_READY, subscribe, initialize, mergeConfig,
} from '@edx/frontend-platform';
import { AppProvider, ErrorPage } from '@edx/frontend-platform/react';
import { getAuthenticatedUser } from '@edx/frontend-platform/auth';

import React from 'react';
import ReactDOM from 'react-dom';
import { Switch, Route } from 'react-router-dom';

import SupportHomePage from './supportHome/SupportHomePage';
import Header from './supportHeader';
import appMessages from './i18n';
import UserPage from './users/UserPage';
// import SupportToolsTab from './SupportToolsTab/SupportToolsTab';
// import UserPageV2 from './users/v2/UserPage';
// import FBEIndexPage from './FeatureBasedEnrollments/FeatureBasedEnrollmentIndexPage';
import UserMessagesProvider from './userMessages/UserMessagesProvider';

import './index.scss';

mergeConfig({
  LICENSE_MANAGER_URL: process.env.LICENSE_MANAGER_URL,
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
        <Switch>
          <Route exact path="/" component={SupportHomePage} />
          <Route path="/users" component={UserPage} />
          {/* <Route path="/v2" component={SupportToolsTab} /> */}
          {/* <Route path="/v2/learner_information" component={UserPageV2} /> */}
          {/* <Route path="/v2/feature_based_enrollments" component={FBEIndexPage} /> */}
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
