import {
  Badge,
} from '@openedx/paragon';
import PropTypes from 'prop-types';

const DashboardTableBadges = ({ row }) => {
  const { isActive } = row.values;
  return (
    <Badge
      variant={isActive ? 'success' : 'danger'}
    >
      {isActive ? 'Active' : 'Inactive'}
    </Badge>
  );
};

DashboardTableBadges.propTypes = {
  row: PropTypes.shape({
    values: PropTypes.shape({
      isActive: PropTypes.bool,
    }),
  }).isRequired,
};

export default DashboardTableBadges;
