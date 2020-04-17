import 'babel-polyfill';

import {
  APP_INIT_ERROR, APP_READY, subscribe, initialize,
} from '@edx/frontend-platform';
import { AppProvider, ErrorPage } from '@edx/frontend-platform/react';
import { getAuthenticatedUser } from '@edx/frontend-platform/auth';
import React from 'react';
import ReactDOM from 'react-dom';
import { Switch, Route, Link } from 'react-router-dom';

import Header from './support-header';
import appMessages from './i18n';
import UserPage from './users/UserPage';
import UserMessagesProvider from './user-messages/UserMessagesProvider';

import './index.scss';
import './assets/favicon.ico';

function supportLinks() {
  return (
    <main className="container-fluid m-5">
      <h3>Support Tools</h3>
      <ul>
        <li><Link to="/users">Search Users</Link></li>
      </ul>
    </main>
  );
}

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
          <Route exact path="/" render={supportLinks} />
          <Route exact path="/users" component={UserPage} />
          <Route path="/users/:username" component={UserPage} />
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
