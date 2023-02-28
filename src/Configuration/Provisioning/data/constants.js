import { titleCase } from '../../../utils';

const PROVISIONING_PAGE_TEXT = {
  DASHBOARD: {
    HEADER: 'Provisioning',
    ZERO_STATE: {
      HEADER: 'There are no provisioned enterprise customers',
    },
  },
  FORM: {
    HEADER: (pathName) => `${titleCase(pathName.split('/').reverse()[0])} Customer Plan`,
  },
};

export default PROVISIONING_PAGE_TEXT;
