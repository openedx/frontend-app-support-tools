import React from 'react';

import DashboardHeader from './DashboardHeader';
import DashboardDatatable from './DashboardDatatable';
import DashboardContextProvider from './DashboardContext';

// TODO: Create a new item header, search box and datatable
const Dashboard = () => (
  <DashboardContextProvider>
    <DashboardHeader />
    <DashboardDatatable />
  </DashboardContextProvider>
);

export default Dashboard;
