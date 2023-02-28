import {
  Button,
} from '@edx/paragon';
import PROVISIONING_PAGE_TEXT from './data/constants';

const ZeroStateDashboard = () => (
  <>
    <h3>{PROVISIONING_PAGE_TEXT.DASHBOARD.ZERO_STATE.HEADER}</h3>
    <Button>
      Create
    </Button>
  </>
);

export default ZeroStateDashboard;
