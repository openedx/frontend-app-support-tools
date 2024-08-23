import React from 'react';
import PropTypes from 'prop-types';
import {
  Icon, IconButton, Stack, Chip
} from '@openedx/paragon';
import { Person, Check, Timelapse } from '@openedx/paragon/icons';

export const EnterpriseCustomerUserDetail = ({
  row,
}) => {
  let memberDetails;
  let memberDetailIcon = (
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
    console.log(row.original)
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
  return (
    <div>
      {row.original?.roleAssignments?.includes("enterprise_admin") ? <Check /> : null}
    </div>
  )
}

export const LearnerCell = ({ row }) => {
  if (!row.original?.pendingEnterpriseCustomerUser) {
    return (
      <div>
        {row.original?.roleAssignments?.includes("enterprise_learner") ? <Check /> : null}
      </div>
    )
  }

  return (
    <Chip
      iconBefore={Timelapse}
    >
      Pending
    </Chip>
  )
};


EnterpriseCustomerUserDetail.propTypes = {
  row: PropTypes.shape({
    original: PropTypes.shape({
      memberDetails: PropTypes.shape({
        userEmail: PropTypes.string.isRequired,
        userName: PropTypes.string,
      }),
      status: PropTypes.string,
      recentAction: PropTypes.string.isRequired,
      memberEnrollments: PropTypes.string,
    }).isRequired,
  }).isRequired,
};
