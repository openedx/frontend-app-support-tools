import React from 'react';
import PropTypes from 'prop-types';
import {
  Icon, IconButton, Stack, Chip,
} from '@openedx/paragon';
import { Person, Check, Timelapse } from '@openedx/paragon/icons';

export const EnterpriseCustomerUserDetail = ({
  row,
}) => {
  let memberDetails;
  const memberDetailIcon = (
    <IconButton
      isActive
      invertColors
      src={Person}
      iconAs={Icon}
      className="border rounded-circle mr-3"
      alt="members detail column icon"
      style={{ opacity: 1, flexShrink: 0 }}
    />
  );

  if (row.original.enterpriseCustomerUser?.username) {
    memberDetails = (
      <div className="mb-n3">
        <p className="font-weight-bold mb-0">
          {row.original.enterpriseCustomerUser?.username}
        </p>
        <p>{row.original.enterpriseCustomerUser?.email}</p>
      </div>
    );
  } else {
    memberDetails = (
      <p className="align-middle mb-0">
        {row.original.pendingEnterpriseCustomerUser?.userEmail}
      </p>
    );
  }
  return (
    <Stack gap={0} direction="horizontal">
      {memberDetailIcon}
      {memberDetails}
    </Stack>
  );
};

export const AdministratorCell = ({ row }) => {
  if (row.original?.pendingEnterpriseCustomerUser?.isPendingAdmin) {
    return (
      <Chip
        iconBefore={Timelapse}
      >
        Pending
      </Chip>
    );
  }
  return (
    <div>
      {row.original?.roleAssignments?.includes('enterprise_admin') ? <Check data-testid="admin check" aria-label="admin check" /> : null}
    </div>
  );
};

export const LearnerCell = ({ row }) => {
  if (!row.original?.pendingEnterpriseCustomerUser?.isPendingLearner) {
    return (
      <div>
        {row.original?.roleAssignments?.includes('enterprise_learner') ? <Check data-testid="learner check" aria-label="learner check" /> : null}
      </div>
    );
  }

  return (
    <Chip
      iconBefore={Timelapse}
    >
      Pending
    </Chip>
  );
};

EnterpriseCustomerUserDetail.propTypes = {
  row: PropTypes.shape({
    original: PropTypes.shape({
      enterpriseCustomerUser: PropTypes.shape({
        email: PropTypes.string.isRequired,
        username: PropTypes.string,
      }),
      pendingEnterpriseCustomerUser: PropTypes.shape({
        isPendingAdmin: PropTypes.bool,
        userEmail: PropTypes.string,
      }),
      roleAssignments: PropTypes.arrayOf(PropTypes.string),
    }).isRequired,
  }).isRequired,
};

AdministratorCell.propTypes = {
  row: PropTypes.shape({
    original: PropTypes.shape({
      pendingEnterpriseCustomerUser: PropTypes.shape({
        isPendingAdmin: PropTypes.bool,
      }),
      roleAssignments: PropTypes.arrayOf(PropTypes.string),
    }).isRequired,
  }).isRequired,
};

LearnerCell.propTypes = {
  row: PropTypes.shape({
    original: PropTypes.shape({
      pendingEnterpriseCustomerUser: PropTypes.shape({
        isPendingLearner: PropTypes.bool,
      }),
      roleAssignments: PropTypes.arrayOf(PropTypes.string),
    }).isRequired,
  }).isRequired,
};