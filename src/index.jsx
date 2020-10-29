import 'babel-polyfill';

import {
  APP_INIT_ERROR, APP_READY, subscribe, initialize,
} from '@edx/frontend-platform';
import { AppProvider, ErrorPage } from '@edx/frontend-platform/react';
import { getAuthenticatedUser } from '@edx/frontend-platform/auth';
import React from 'react';
import ReactDOM from 'react-dom';
import { Switch, Route } from 'react-router-dom';

import SupportHomePage from './support-home/SupportHomePage';
import Header from './support-header';
import appMessages from './i18n';
import UserPage from './users/UserPage';
import UserMessagesProvider from './user-messages/UserMessagesProvider';

import './index.scss';
import './assets/favicon.ico';

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
