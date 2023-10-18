import { useLocation } from 'react-router-dom';
import { ActionRow, Container } from '@edx/paragon';
import EditButton from './EditButton';
import SubsidyDetailView from './SubsidyDetailView';
import PROVISIONING_PAGE_TEXT from '../data/constants';

const SubsidyDetailViewContainer = () => {
  const { pathname } = useLocation();
  const { FORM } = PROVISIONING_PAGE_TEXT;
  return (
    <Container size="md" className="mt-5">
      <ActionRow>
        <h1>{FORM.TITLE(pathname)}</h1>
        <ActionRow.Spacer />
        <EditButton />
      </ActionRow>
      <SubsidyDetailView />
    </Container>
  );
};

export default SubsidyDetailViewContainer;
