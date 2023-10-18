import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import DashboardHeader from './DashboardHeader';
import DashboardToast from './DashboardToast';
import DashboardDataTable from './DashboardDataTable';
import { toastText } from './data/constants';

// TODO: Create a new item header, search box and datatable
const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { state: locationState } = location;
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    if (locationState?.planSuccessfullyCreated || locationState?.planSuccessfullySaved) {
      setToasts((prevState) => [...prevState, {
        text: locationState?.planSuccessfullyCreated ? toastText.successfulPlanCreation : toastText.successfulPlanSaved,
        uuid: locationState?.planSuccessfullyCreated ? uuidv4() : null,
      }]);
      const newState = { ...locationState };
      if (locationState?.planSuccessfullyCreated) {
        delete newState.planSuccessfullyCreated;
      }
      if (locationState?.planSuccessfullySaved) {
        delete newState.planSuccessfullySaved;
      }
      navigate({ ...location, state: newState, replace: true });
    }
  }, [toastText.successfulPlanCreation, toastText.successfulPlanSaved, location, locationState]);

  return (
    <>
      <DashboardHeader />
      <DashboardDataTable />
      {toasts.map(({ text, uuid }) => (<DashboardToast toastText={text} key={uuid} />))}
    </>
  );
};

export default Dashboard;
