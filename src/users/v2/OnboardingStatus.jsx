import React, { useState, useMemo, useEffect } from 'react';
import { camelCaseObject, getConfig } from '@edx/frontend-platform';
import PropTypes from 'prop-types';
import TableV2 from '../../components/Table';
import { formatDate, titleCase } from '../../utils';
import { getOnboardingStatus, getEnrollments } from '../data/api';
import PageLoading from '../../components/common/PageLoading';

export default function OnboardingStatus({
  username,
}) {
  const [onboardingData, setOnboardingData] = useState(null);

  useEffect(() => {
    getEnrollments(username).then((enrollments) => {
      getOnboardingStatus(enrollments, username).then((data) => {
        const camelCaseData = camelCaseObject(data);
        setOnboardingData(camelCaseData);
      });
    });
  }, [username]);

  const proctoringColumns = useMemo(() => [
    {
      Header: 'Onboarding Status',
      accessor: 'status',
    },
    {
      Header: 'Expiration Date',
      accessor: 'expirationDate',
    },
    {
      Header: 'Onboarding Link',
      accessor: 'onboardingLink',
    },
  ], []);

  const proctoringData = useMemo(() => {
    if (onboardingData === null || onboardingData.length === 0) {
      return [];
    }
    return [onboardingData].map(result => ({
      status: result.onboardingStatus ? titleCase(result.onboardingStatus) : 'Not Started',
      expirationDate: formatDate(result.expirationDate),
      onboardingLink: result.onboardingLink ? <a href={`${getConfig().LMS_BASE_URL}${result.onboardingLink}`} rel="noopener noreferrer" target="_blank" className="word_break">Link</a>
        : 'N/A',
    }));
  }, [onboardingData]);

  return (
    <div className="flex-column p-4 m-3 card">
      <h3>Proctoring Information</h3>
      {onboardingData ? (
        <TableV2
          id="proctoring-data"
          data={proctoringData}
          columns={proctoringColumns}
          styleName="idv-table word_break"
        />
      ) : <PageLoading srMessage="Loading.." /> }
    </div>
  );
}

OnboardingStatus.propTypes = {
  username: PropTypes.string.isRequired,
};
