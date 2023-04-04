import { useLocation } from 'react-router';
import {
  Container,
} from '@edx/paragon';
import ProvisioningForm from './ProvisioningForm';
import PROVISIONING_PAGE_TEXT from '../data/constants';
import ProvisioningContextProvider from '../ProvisioningContext';

const ProvisioningFormContainer = () => {
  const { pathname } = useLocation();
  const { FORM } = PROVISIONING_PAGE_TEXT;

  return (
    <ProvisioningContextProvider>
      <Container size="md" className="mt-5">
        <h1>{FORM.TITLE(pathname)}</h1>
        <ProvisioningForm />
      </Container>
    </ProvisioningContextProvider>
  );
};

export default ProvisioningFormContainer;
