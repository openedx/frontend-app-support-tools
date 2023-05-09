import React, { useEffect } from 'react';
import { Icon, IconButton } from '@edx/paragon';
import { useHistory } from 'react-router';

import { EditOutline } from '@edx/paragon/icons';
import DashboardHeader from './DashboardHeader';
import DashboardDatatable from './DashboardDatatable';
import { useDashboardContext } from './data/hooks';

const Dashboard = () => {
  const { hydrateEnterpriseSubsidies } = useDashboardContext();
  const history = useHistory();

  const editLearnerCreditPlan = (uuid) => {
    // TODO: Navigate to the edit page for the selected learner credit plan based on UUID
    history.push(`/enterprise-configuration/learner-credit/${uuid}/edit`);
  };

  const editAction = (onIconInteraction) => (
    <IconButton
      src={EditOutline}
      iconAs={Icon}
      onClick={onIconInteraction}
    />
  );

  useEffect(() => {
    hydrateEnterpriseSubsidies(25, editAction, editLearnerCreditPlan);
  }, []);

  return (
    <>
      <DashboardHeader />
      <DashboardDatatable />
    </>
  );
};

export default Dashboard;
