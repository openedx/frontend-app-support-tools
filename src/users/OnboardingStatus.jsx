import React, { useState, useMemo, useEffect } from 'react';
import { camelCaseObject, getConfig } from '@edx/frontend-platform';
import PropTypes from 'prop-types';
import Table from '../Table';
import { formatDate, titleCase } from '../utils';
import { getOnboardingStatus, getEnrollments } from './data/api';
import PageLoading from '../components/common/PageLoading';

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

  const proctoringColumns = [
    {
      label: 'Onboarding Status',
      key: 'status',
    },
    {
      label: 'Expiration Date',
      key: 'expirationDate',
    },
    {
      label: 'Onboarding Link',
      key: 'onboardingLink',
    },
  ];

  const proctoringData = useMemo(() => {
    if (onboardingData === null || onboardingData.length === 0) {
      return [];
    }
    return [onboardingData].map(result => ({
      status: result.onboardingStatus ? titleCase(result.onboardingStatus) : 'Not Started',
      expirationDate: formatDate(result.expirationDate),
      onboardingLink: result.onboardingLink ? {
        displayValue: <a href={`${getConfig().LMS_BASE_URL}${result.onboardingLink}`} rel="noopener noreferrer" target="_blank" className="word_break">Link</a>,
        value: result.onboardingLink,
      } : 'N/A',
    }));
  }, [onboardingData]);

  return (
    <div className="flex-column p-4 m-3 card">
      <h4>Proctoring Information</h4>
      {onboardingData ? (
        <Table
          id="proctoring-data"
          data={proctoringData}
          columns={proctoringColumns}
        />
      ) : <PageLoading srMessage="Loading.." /> }
    </div>
  );
}

OnboardingStatus.propTypes = {
  username: PropTypes.string.isRequired,
};
