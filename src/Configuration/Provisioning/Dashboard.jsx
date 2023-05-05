import React, { useEffect } from 'react';
import { Icon, IconButton } from '@edx/paragon';
import { useHistory } from 'react-router';

import { EditOutline } from '@edx/paragon/icons';
import { v4 as uuidv4 } from 'uuid';
import DashboardHeader from './DashboardHeader';
import DashboardDatatable from './DashboardDatatable';
import { useDashboardContext } from './data/hooks';

const Dashboard = () => {
  const { hydrateEnterpriseSubsidies } = useDashboardContext();
  const history = useHistory();

  const editLearnerCreditPlan = () => {
    // TODO: Navigate to the edit page for the selected learner credit plan based on UUID
    history.push(`/enterprise-configuration/learner-credit/${uuidv4()}/edit`);
  };
  const editAction = (
    <IconButton
      src={EditOutline}
      iconAs={Icon}
      onClick={editLearnerCreditPlan}
    />
  );

  useEffect(() => {
    hydrateEnterpriseSubsidies(25, editAction);
  });

  return (
    <>
      <DashboardHeader />
      <DashboardDatatable />
    </>
  );
};

export default Dashboard;
