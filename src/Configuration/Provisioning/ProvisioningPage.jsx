import {
  Container,
} from '@edx/paragon';
import Dashboard from './Dashboard';
import DashboardContextProvider from './DashboardContext';

const ProvisioningPage = () => (
  <DashboardContextProvider>
    <Container className="mt-5">
      <Dashboard />
    </Container>
  </DashboardContextProvider>
);

export default ProvisioningPage;
