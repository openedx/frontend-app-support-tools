import { useLocation } from 'react-router-dom';
import {
  ActionRow,
  Container,
} from '@openedx/paragon';
import CancelButton from './CancelButton';
import SaveEditsButton from './SaveEditsButton';
import SubsidyEditView from './SubsidyEditView';
import PROVISIONING_PAGE_TEXT from '../data/constants';
import ProvisioningContextProvider from '../ProvisioningContext';

const SubsidyEditViewContainer = () => {
  const { pathname } = useLocation();
  const { FORM } = PROVISIONING_PAGE_TEXT;

  return (
    <ProvisioningContextProvider>
      <Container size="md" className="mt-5">
        <ActionRow>
          <h1>{FORM.TITLE(pathname)}</h1>
          <ActionRow.Spacer />
          <SaveEditsButton />
          <CancelButton />
        </ActionRow>
        <SubsidyEditView />
      </Container>
    </ProvisioningContextProvider>
  );
};

export default SubsidyEditViewContainer;
