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
    if (locationState?.planSuccessfullyCreated) {
      setToasts((prevState) => [...prevState, {
        text: toastText.successfulPlanCreation,
        uuid: uuidv4(),
      }]);
      const newState = { ...locationState };
      delete newState.planSuccessfullyCreated;
      navigate({ ...location, state: newState, replace: true });
    }
  }, [toastText.successfulPlanCreation, location, locationState]);

  return (
    <>
      <DashboardHeader />
      <DashboardDataTable />
      {toasts.map(({ text, uuid }) => (<DashboardToast toastText={text} key={uuid} />))}
    </>
  );
};

export default Dashboard;
