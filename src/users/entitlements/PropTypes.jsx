import PropTypes from 'prop-types';

export const EntitlementPropTypes = PropTypes.shape({
  uuid: PropTypes.string.isRequired,
  courseUuid: PropTypes.string.isRequired,
  enrollmentCourseRun: PropTypes.string,
  created: PropTypes.string.isRequired,
  modified: PropTypes.string.isRequired,
  expiredAt: PropTypes.string,
  mode: PropTypes.string.isRequired,
  orderNumber: PropTypes.string,
  supportDetails: PropTypes.arrayOf(PropTypes.shape({
    supportUser: PropTypes.string,
    action: PropTypes.string,
    comments: PropTypes.string,
    unenrolledRun: PropTypes.string,
  })),
  user: PropTypes.string.isRequired,
});

export const EntitlementDefaultProps = {
  uuid: '',
  courseUuid: '',
  created: '',
  modified: '',
  expiredAt: '',
  mode: 'verified',
  orderNumber: '',
  supportDetails: [],
  user: '',
};
