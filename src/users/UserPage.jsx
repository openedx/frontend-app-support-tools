import React, { useCallback, useState } from 'react';

import UserSummary from './UserSummary';
import Enrollments from './Enrollments';
import Entitlements from './Entitlements';
import UserSearch from './UserSearch';

export default function UserPage() {
  const [data, setData] = useState({ user: null, enrollments: null, entitlements: null });

  const handleDataLoaded = useCallback((_data) => {
    console.log(_data);
    setData(_data);
  });

  return (
    <main>
      <UserSearch dataLoadedHandler={handleDataLoaded} />
      <UserSummary data={data.user} />
      <Entitlements data={data.entitlements} />
      <Enrollments data={data.enrollments} />
    </main>
  );
}
