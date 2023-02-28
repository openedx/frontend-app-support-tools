import { useLocation } from 'react-router';
import {
  Container,
} from '@edx/paragon';
import ProvisioningForm from './ProvisioningForm';
import PROVISIONING_PAGE_TEXT from '../data/constants';

const ProvisioningFormContainer = () => {
  const { pathname } = useLocation();
  // Conditionally render header where header is either create a new plan or edit and existing plan

  // Container form will render components based on user input and selected items
  return (
    <Container className="mt-5">
      <div>
        <h1>{PROVISIONING_PAGE_TEXT.FORM.HEADER(pathname)}</h1>
      </div>
      <ProvisioningForm />
    </Container>
  );
};

export default ProvisioningFormContainer;
