import React, { useEffect, useState } from 'react';

import { useHistory } from 'react-router';
import { v4 as uuidv4 } from 'uuid';
import DashboardHeader from './DashboardHeader';
import DashboardToast from './DashboardToast';
// TODO: Create a new item header, search box and datatable
const Dashboard = () => {
  const history = useHistory();
  const { location } = history;
  const { state: locationState } = location;
  const [toasts, setToasts] = useState([]);
  useEffect(() => {
    if (locationState?.planSuccessfullyCreated) {
      setToasts((prevState) => [...prevState, {
        toastText: 'Plan successfully created',
        uuid: uuidv4(),
      }]);
      const newState = { ...locationState };
      delete newState.planSuccessfullyCreated;
      history.replace({ ...location, state: newState });
    }
  });
  return (
    <>
      <DashboardHeader />
      {toasts.map(({ toastText, uuid }) => (<DashboardToast toastText={toastText} key={uuid} />))}
    </>
  );
};

export default Dashboard;
