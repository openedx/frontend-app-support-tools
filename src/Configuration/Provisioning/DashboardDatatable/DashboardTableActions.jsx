import {
  IconButton,
  Icon,
  Hyperlink,
} from '@edx/paragon';
import { getConfig } from '@edx/frontend-platform';
import { useHistory } from 'react-router';
import {
  EditOutline,
  DjangoShort,
} from '@edx/paragon/icons';
import PropTypes from 'prop-types';

const DashboardTableActions = ({ row }) => {
  const rowUuid = row.values.uuid;
  const { DJANGO_ADMIN_SUBSIDY_BASE_URL } = getConfig();
  const history = useHistory();
  return [
    getConfig().FEATURE_CONFIGURATION_EDIT_ENTERPRISE_PROVISION && (
      <IconButton
        key="edit-icon"
        size="sm"
        src={EditOutline}
        iconAs={Icon}
        onClick={() => history.push(`/enterprise-configuration/learner-credit/${rowUuid}/edit`)}
        alt="Edit Subsidy Icon Button"
      />
    ),
    <Hyperlink
      key="django-icon"
      destination={`${DJANGO_ADMIN_SUBSIDY_BASE_URL}/admin/subsidy/subsidy/?uuid=${rowUuid}`}
      target="_blank"
      showLaunchIcon={false}
    >
      <IconButton
        size="sm"
        src={DjangoShort}
        iconAs={Icon}
        alt="Django Admin Icon Button"
      />
    </Hyperlink>,
  ];
};

DashboardTableActions.propTypes = {
  row: PropTypes.shape({
    values: PropTypes.shape({
      uuid: PropTypes.string,
    }),
  }).isRequired,
};

export default DashboardTableActions;
