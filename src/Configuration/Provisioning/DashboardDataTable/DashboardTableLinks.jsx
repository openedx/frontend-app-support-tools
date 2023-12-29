import { Hyperlink, Icon, IconButton } from '@openedx/paragon';
import { getConfig } from '@edx/frontend-platform';
import { DjangoShort } from '@openedx/paragon/icons';
import PropTypes from 'prop-types';
import ROUTES from '../../../data/constants/routes';
import { DJANGO_ADMIN_RETRIEVE_SUBSIDY_PATH } from '../data/constants';

const { HOME } = ROUTES.CONFIGURATION.SUB_DIRECTORY.PROVISIONING;
const dashboardLink = (planRowUuid, title) => {
  if (getConfig().FEATURE_CONFIGURATION_EDIT_ENTERPRISE_PROVISION === 'true') {
    return (
      <Hyperlink
        destination={`${HOME}/${planRowUuid}/view`}
        key={`edit-${planRowUuid}`}
        variant="muted"
      >
        {title}
      </Hyperlink>
    );
  }
  return title;
};

export const PlanIdHyperlink = ({ row }) => dashboardLink(row.values.uuid, row.values.uuid);

export const PlanTitleHyperlink = ({ row }) => dashboardLink(row.values.uuid, row.values.title);

export const CustomerNameHyperlink = ({ row }) => dashboardLink(row.values.uuid, row.values.enterpriseCustomerName);

export const DjangoIconHyperlink = ({ row }) => {
  const rowUuid = row.values.uuid;
  const { DJANGO_ADMIN_SUBSIDY_BASE_URL } = getConfig();

  return (
    <Hyperlink
      key="django-icon"
      destination={`${DJANGO_ADMIN_SUBSIDY_BASE_URL}${DJANGO_ADMIN_RETRIEVE_SUBSIDY_PATH(rowUuid)}`}
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
    </Hyperlink>
  );
};

PlanIdHyperlink.propTypes = {
  row: PropTypes.shape({
    values: PropTypes.shape({
      uuid: PropTypes.string,
    }),
  }).isRequired,
};

PlanTitleHyperlink.propTypes = {
  row: PropTypes.shape({
    values: PropTypes.shape({
      uuid: PropTypes.string,
      title: PropTypes.string,
    }),
  }).isRequired,
};

CustomerNameHyperlink.propTypes = {
  row: PropTypes.shape({
    values: PropTypes.shape({
      uuid: PropTypes.string,
      enterpriseCustomerName: PropTypes.string,
    }),
  }).isRequired,
};

DjangoIconHyperlink.propTypes = {
  row: PropTypes.shape({
    values: PropTypes.shape({
      uuid: PropTypes.string,
    }),
  }).isRequired,
};
