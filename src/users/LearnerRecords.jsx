import { getConfig } from '@edx/frontend-platform';
import { Alert, Button } from '@edx/paragon';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import Table from '../components/Table';
import { getLearnerRecords } from './data/api';

import messages from './messages';

function LearnerRecords({ username, intl }) {
  const [records, setRecords] = useState(null);
  const [error, setError] = useState(null);
  const { CREDENTIALS_BASE_URL } = getConfig();

  useEffect(() => {
    if (username) {
      getLearnerRecords(username).then((data) => {
        if (!data.errors) {
          setRecords(data);
        } else {
          setError(data.errors[0]);
        }
      });
    }
  }, [username]);

  const handleCopyButton = (uuid) => {
    navigator.clipboard.writeText(`${CREDENTIALS_BASE_URL}/records/programs/shared/${uuid}`);
  };

  const renderStatus = (program) => {
    if (program.completed) {
      return (
        intl.formatMessage(messages.earnedStatus)
      );
    }
    if (program.empty) {
      return (
        intl.formatMessage(messages.notEarnedStatus)
      );
    }
    return (
      intl.formatMessage(messages.partiallyCompletedStatus)
    );
  };

  const renderDate = (date) => (
    `${intl.formatMessage(messages.recordTableLastUpdated)}: ${new Date(date).toLocaleDateString()}`
  );

  return (
    <section>
      <h3>{intl.formatMessage(messages.learnerRecordsTabHeader)}</h3>
      {
        records ? (
          records.map(({ record, uuid }, idx) => (
            <section key={uuid} className={`${idx % 2 ? 'bg-light-100' : 'bg-light-200'} p-4`}>
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <h4>{record.program.name}</h4>
                  <p>{record.program.type_name}</p>
                  <p>{renderStatus(record.program)}</p>
                  <p>{renderDate(record.program.last_updated)}</p>
                </div>
                {record.shared_program_record_uuid && (
                  <Button
                    variant="primary"
                    onClick={() => handleCopyButton(record.shared_program_record_uuid.replaceAll('-', ''))}
                  >
                    {intl.formatMessage(messages.copyPublicRecordLinkButton)}
                  </Button>
                )}
              </div>
              <Table
                columns={[
                  {
                    Header: intl.formatMessage(messages.recordTableHeaderCourseName),
                    accessor: 'name',
                  },
                  {
                    Header: intl.formatMessage(messages.recordTableHeaderSchool),
                    accessor: 'school',
                  },
                  {
                    Header: intl.formatMessage(messages.recordTableHeaderCourseId),
                    accessor: 'course_id',
                  },
                  {
                    Header: intl.formatMessage(messages.recordTableHeaderHighestGrade),
                    accessor: 'percent_grade',
                  },
                  {
                    Header: intl.formatMessage(messages.recordTableHeaderLetterGrade),
                    accessor: 'letter_grade',
                  },
                  {
                    Header: intl.formatMessage(messages.recordTableHeaderVerifiedAttempts),
                    accessor: 'attempts',
                  },
                  {
                    Header: intl.formatMessage(messages.recordTableHeaderDateEarned),
                    accessor: 'issue_date',
                  },
                  {
                    Header: intl.formatMessage(messages.recordTableHeaderStatus),
                    accessor: 'status',
                  },
                ]}
                data={record.grades.map(grade => ({
                  name: grade.name,
                  school: grade.school,
                  course_id: grade.course_id.split(':')[1],
                  letter_grade: grade.letter_grade,
                  attempts: grade.attempts,
                  percent_grade:
                    grade.issue_date
                      ? `${parseInt(Math.round(grade.percent_grade * 100), 10).toString()}%`
                      : '',
                  issue_date:
                    grade.issue_date
                      ? new Date(grade.issue_date).toLocaleDateString()
                      : '',
                  status:
                    grade.issue_date
                      ? intl.formatMessage(messages.earnedStatus)
                      : intl.formatMessage(messages.notEarnedStatus),
                }))}
                styleName="custom-table"
              />
            </section>
          ))
        ) : (
          <>
            {error ? (
              <Alert variant="danger">{error.text}</Alert>
            ) : (
              <p>{`${intl.formatMessage(messages.noRecordsFound)}: ${username}`}</p>
            )}
          </>
        )
      }
    </section>
  );
}

LearnerRecords.propTypes = {
  username: PropTypes.string.isRequired,
  intl: intlShape.isRequired,
};

export default injectIntl(LearnerRecords);
