import React, { useEffect, useState } from 'react';

import { Icon, IconButton } from '@edx/paragon';
import { EditOutline } from '@edx/paragon/icons';
import { useHistory } from 'react-router';
import { v4 as uuidv4 } from 'uuid';

import DashboardHeader from './DashboardHeader';
import DashboardDatatable from './DashboardDatatable';
import DashboardToast from './DashboardToast';

import { toastText } from './data/constants';
import { useDashboardContext } from './data/hooks';

// TODO: Create a new item header, search box and datatable
const Dashboard = () => {
  const { hydrateEnterpriseSubsidies } = useDashboardContext();
  const history = useHistory();
  const { location } = history;
  const { state: locationState } = location;
  const [toasts, setToasts] = useState([]);

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
    if (locationState?.planSuccessfullyCreated) {
      setToasts((prevState) => [...prevState, {
        text: toastText.successfulPlanCreation,
        uuid: uuidv4(),
      }]);
      const newState = { ...locationState };
      delete newState.planSuccessfullyCreated;
      history.replace({ ...location, state: newState });
    }
    hydrateEnterpriseSubsidies(25, editAction, editLearnerCreditPlan);
  }, [toastText.successfulPlanCreation, history, location, locationState]);

  return (
    <>
      <DashboardHeader />
      <DashboardDatatable />
      {toasts.map(({ text, uuid }) => (<DashboardToast toastText={text} key={uuid} />))}
    </>
  );
};

export default Dashboard;
