import React, { useState, useMemo, useEffect } from 'react';
import { camelCaseObject, getConfig } from '@edx/frontend-platform';
import PropTypes from 'prop-types';
import TableV2 from '../../components/Table';
import { formatDate, titleCase } from '../../utils';
import { getV2OnboardingStatus } from '../data/api';
import PageLoading from '../../components/common/PageLoading';

export default function OnboardingStatus({
  username,
}) {
  const [onboardingData, setOnboardingData] = useState(null);

  useEffect(() => {
    getV2OnboardingStatus(username).then((data) => {
      const camelCaseData = camelCaseObject(data);
      setOnboardingData(camelCaseData);
    });
  }, [username]);

  const proctoringColumns = useMemo(() => [
    {
      Header: 'Course ID',
      accessor: 'courseId',
    },
    {
      Header: 'Onboarding Status',
      accessor: 'status',
    },
    {
      Header: 'Expiration Date',
      accessor: 'expirationDate',
    },
    {
      Header: 'Instructor Dashboard',
      accessor: 'instructorDashboardLink',
    },
  ], []);

  function formatData(data) {
    return [data].map(result => ({
      courseId: result.courseId || 'No Course',
      status: result.onboardingStatus ? titleCase(result.onboardingStatus) : 'See Dashboard',
      expirationDate: formatDate(result.expirationDate),
      instructorDashboardLink: result.instructorDashboardLink ? <a href={`${getConfig().LMS_BASE_URL}${result.instructorDashboardLink}`} rel="noopener noreferrer" target="_blank" className="word_break" label="dashboard link">Link</a>
        : 'N/A',
    }));
  }

  return (
    <div className="flex-column p-4 m-3 card">
      <h3>Proctoring Information</h3>
      { onboardingData ? (
        <div>
          <h4>Verified In</h4>
          { onboardingData.verifiedIn ? (
            <TableV2
              id="verified-in-data"
              data={formatData(onboardingData.verifiedIn)}
              columns={proctoringColumns}
              styleName="idv-table"
            />
          ) : <div className="no-record-text" id="verified-in-no-data">No Record Found</div>}
          <h4>Current Status</h4>
          { onboardingData.currentStatus ? (
            <TableV2
              id="current-status-data"
              data={formatData(onboardingData.currentStatus)}
              columns={proctoringColumns}
              styleName="idv-table"
            />
          ) : <div className="no-record-text" id="current-status-no-data">No Record Found</div>}
        </div>
      ) : <PageLoading srMessage="Loading.." /> }
    </div>
  );
}

OnboardingStatus.propTypes = {
  username: PropTypes.string.isRequired,
};
