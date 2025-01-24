import React from 'react';
import PropTypes from 'prop-types';
import {
  Chip, Hyperlink, Icon, IconButton, Stack,
} from '@openedx/paragon';
import { Check, Person, Timelapse } from '@openedx/paragon/icons';

import ROUTES from '../../../data/constants/routes';

export const EnterpriseCustomerUserDetail = ({ row }) => {
  const user = row.original.enterpriseCustomerUser;
  let memberDetails;
  const iconLink = `${ROUTES.SUPPORT_TOOLS_TABS.SUB_DIRECTORY.LEARNER_INFORMATION}/?email=${user?.email}`;
  const memberDetailIcon = () => {
    if (user) {
      return (
        <Hyperlink
          destination={iconLink}
          key={user?.email}
          data-testId="icon-hyperlink"
          target="_blank"
          showLaunchIcon={false}
        >
          <IconButton
            isActive
            invertColors
            src={Person}
            iconAs={Icon}
            className="border rounded-circle mr-3"
            alt="members detail column icon"
            style={{ opacity: 1, flexShrink: 0 }}
          />
        </Hyperlink>
      );
    }
    return (
      <IconButton
        isActive
        invertColors
        src={Person}
        iconAs={Icon}
        className="icon-button border rounded-circle mr-3"
        alt="members detail column icon"
      />
    );
  };

  if (user?.username) {
    memberDetails = (
      <Hyperlink
        destination={iconLink}
        key={user?.username}
        data-testId="username-email-hyperlink"
        target="_blank"
        variant="muted"
        showLaunchIcon={false}
      >
        <div className="mb-n3">
          <p className="font-weight-bold mb-0">{user?.username}</p>
          <p>{user?.email}</p>
        </div>
      </Hyperlink>
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
      {memberDetailIcon()}
      {memberDetails}
    </Stack>
  );
};

export const AdministratorCell = ({ row }) => {
  if (row.original?.pendingEnterpriseCustomerUser?.isPendingAdmin) {
    return <Chip iconBefore={Timelapse}>Pending</Chip>;
  }
  return (
    <div>
      {row.original?.roleAssignments?.includes('enterprise_admin') ? (
        <Check data-testid="admin check" aria-label="admin check" />
      ) : null}
    </div>
  );
};

export const LearnerCell = ({ row }) => {
  if (!row.original?.pendingEnterpriseCustomerUser?.isPendingLearner) {
    return (
      <div>
        {row.original?.roleAssignments?.includes('enterprise_learner') ? (
          <Check data-testid="learner check" aria-label="learner check" />
        ) : null}
      </div>
    );
  }

  return <Chip iconBefore={Timelapse}>Pending</Chip>;
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
