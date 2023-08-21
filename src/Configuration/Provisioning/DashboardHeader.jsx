import {
  Button,
  ActionRow,
} from '@edx/paragon';
import { Add } from '@edx/paragon/icons';
import { useNavigate } from 'react-router-dom';
import PROVISIONING_PAGE_TEXT from './data/constants';
import ROUTES from '../../data/constants/routes';

const DashboardHeader = () => {
  const navigate = useNavigate();
  const { DASHBOARD } = PROVISIONING_PAGE_TEXT;
  const { NEW } = ROUTES.CONFIGURATION.SUB_DIRECTORY.PROVISIONING.SUB_DIRECTORY;

  const handleNew = () => {
    navigate(NEW);
  };

  return (
    <ActionRow>
      <h1>{DASHBOARD.TITLE}</h1>
      <ActionRow.Spacer />
      <Button
        variant="primary"
        value={DASHBOARD.new}
        iconBefore={Add}
        onClick={handleNew}
      >
        {DASHBOARD.BUTTON.new}
      </Button>
    </ActionRow>
  );
};

export default DashboardHeader;
