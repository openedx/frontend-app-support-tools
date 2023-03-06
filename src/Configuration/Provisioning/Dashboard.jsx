import React from 'react';
import {
  Container,
} from '@edx/paragon';
import PROVISIONING_PAGE_TEXT from './data/constants';

const Dashboard = () => (
  <Container className="mt-3">
    <div>
      <h1>{PROVISIONING_PAGE_TEXT.DASHBOARD.HEADER}</h1>
    </div>
  </Container>
);

export default Dashboard;
