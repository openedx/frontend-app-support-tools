import { useLocation } from 'react-router';
import {
  Container,
} from '@edx/paragon';
import SubsidyEditView from './SubsidyEditView';
import PROVISIONING_PAGE_TEXT from '../data/constants';
import ProvisioningContextProvider from '../ProvisioningContext';

const SubsidyEditViewContainer = () => {
  const { pathname } = useLocation();
  const { FORM } = PROVISIONING_PAGE_TEXT;

  return (
    <ProvisioningContextProvider>
      <Container size="md" className="mt-5">
        <h1>{FORM.TITLE(pathname)}</h1>
        <SubsidyEditView />
      </Container>
    </ProvisioningContextProvider>
  );
};

export default SubsidyEditViewContainer;
