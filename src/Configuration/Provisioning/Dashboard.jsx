import React from 'react';
import {
  Container,
} from '@edx/paragon';
import ZeroStateDashboard from './ZeroStateDashboard';
import PROVISIONING_PAGE_TEXT from './data/constants';

const Dashboard = () => {
  console.log('hi dashboard');
  // Create a new item header, search box and datatable
  return (
    <Container className="mt-3">
      <div>
        <h1>{PROVISIONING_PAGE_TEXT.DASHBOARD.HEADER}</h1>
      </div>
      {/* TOOD: Conditionally render ZeroStateDashboard based on there are existing learner credit subsidies */}
      <ZeroStateDashboard />
    </Container>
  );
};

export default Dashboard;
