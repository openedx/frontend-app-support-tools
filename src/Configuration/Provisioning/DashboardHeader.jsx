import {
  Button,
  ActionRow,
} from '@edx/paragon';
import { Add } from '@edx/paragon/icons';
import { useHistory } from 'react-router';
import PROVISIONING_PAGE_TEXT from './data/constants';
import ROUTES from '../../data/constants/routes';

const DashboardHeader = () => {
  const history = useHistory();
  const { DASHBOARD } = PROVISIONING_PAGE_TEXT;
  const { CONFIGURATION: { SUB_DIRECTORY: { PROVISIONING: { SUB_DIRECTORY: { NEW } } } } } = ROUTES;

  // console.log(PROVISIONING);
  return (
    <ActionRow>
      <h1>{DASHBOARD.HEADER}</h1>
      <ActionRow.Spacer />
      <Button
        variant="primary"
        value={DASHBOARD.CREATE_NEW}
        iconBefore={Add}
        onClick={() => history.push(NEW)}
      >
        {DASHBOARD.BUTTON.new}
      </Button>
    </ActionRow>
  );
};

export default DashboardHeader;
