import React from 'react';
import {
  Container,
} from '@edx/paragon';
import ZeroStateDashboard from './ZeroStateDashboard';

const Dashboard = () => (
  <Container className="mt-3">
    <div>
      <h1>Dashboard Page</h1>
    </div>
    <ZeroStateDashboard />
  </Container>
);

export default Dashboard;
