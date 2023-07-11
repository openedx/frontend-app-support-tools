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
import ROUTES from '../../../data/constants/routes';

const DashboardTableActions = ({ row }) => {
  const rowUuid = row.values.uuid;
  const { DJANGO_ADMIN_SUBSIDY_BASE_URL } = getConfig();
  const history = useHistory();
  const { HOME } = ROUTES.CONFIGURATION.SUB_DIRECTORY.PROVISIONING;
  const enabledActionArray = [{
    action: (
      <IconButton
        key="edit-icon"
        size="sm"
        src={EditOutline}
        iconAs={Icon}
        onClick={() => history.push(`${HOME}/${rowUuid}/edit`)}
        alt="Edit Subsidy Icon Button"
        data-testid={`Edit-${rowUuid}`}
      />
    ),
    enabled: getConfig().FEATURE_CONFIGURATION_EDIT_ENTERPRISE_PROVISION,
  }, {
    action: (
      <Hyperlink
        key="django-icon"
        destination={`${DJANGO_ADMIN_SUBSIDY_BASE_URL}/admin/subsidy/subsidy/?uuid=${rowUuid}`}
        target="_blank"
        showLaunchIcon={false}
        data-testid="django-admin-link"
      >
        <IconButton
          size="sm"
          src={DjangoShort}
          iconAs={Icon}
          alt="Django Admin Icon Button"
          data-testid={`Django-Admin-Page-${rowUuid}`}
        />
      </Hyperlink>),
    enabled: true,
  }].filter(interaction => interaction.enabled);

  return enabledActionArray.map(interaction => interaction.action);
};

DashboardTableActions.propTypes = {
  row: PropTypes.shape({
    values: PropTypes.shape({
      uuid: PropTypes.string,
    }),
  }).isRequired,
};

export default DashboardTableActions;
