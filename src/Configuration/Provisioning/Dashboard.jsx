import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { v4 as uuidv4 } from 'uuid';

import DashboardHeader from './DashboardHeader';
import DashboardToast from './DashboardToast';
import DashboardDataTable from './DashboardDataTable';
import { toastText } from './data/constants';

// TODO: Create a new item header, search box and datatable
const Dashboard = () => {
  const history = useHistory();
  const { location } = history;
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
      history.replace({ ...location, state: newState });
    }
  }, [toastText.successfulPlanCreation, history, location, locationState]);

  return (
    <>
      <DashboardHeader />
      <DashboardDataTable />
      {toasts.map(({ text, uuid }) => (<DashboardToast toastText={text} key={uuid} />))}
    </>
  );
};

export default Dashboard;
