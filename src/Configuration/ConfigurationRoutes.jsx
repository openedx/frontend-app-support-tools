import React from 'react';
import { Route, Switch } from 'react-router-dom';

import DashboardPage from './Provisioning';

const ConfigurationRoutes = () => (
  <Route path="/configuration/provisioning" component={DashboardPage} />
);

export default ConfigurationRoutes;
