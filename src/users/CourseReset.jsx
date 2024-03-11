import {
  Alert, AlertModal, Button, useToggle, ActionRow,
} from '@edx/paragon';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import {
  injectIntl,
  intlShape,
  FormattedMessage,
} from '@edx/frontend-platform/i18n';
import Table from '../components/Table';

import { getLearnerCourseResetList, postCourseReset } from './data/api';
import messages from './messages';

function CourseReset({ username, intl }) {
  const [courseResetData, setCourseResetData] = useState([]);
  const [error, setError] = useState('');
  const [isOpen, open, close] = useToggle(false);
  const POLLING_INTERVAL = 10000;

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      const data = await getLearnerCourseResetList(username);
      if (isMounted) {
        if (data.length) {
          setCourseResetData(data);
        } else if (data && data.errors) {
          setCourseResetData([]);
          setError(data.errors[0]?.text);
        }
      }
    };

    const shouldPoll = courseResetData.some((data) => {
      const status = data.status.toLowerCase();
      return status.includes('in progress') || status.includes('enqueued');
    });

    let intervalId;
    const initializeAndPoll = async () => {
      if (!courseResetData.length) {
        await fetchData(); // Initial data fetch
      }

      if (shouldPoll) {
        intervalId = setInterval(() => {
          fetchData();
        }, POLLING_INTERVAL);
      }
    };

    if (isMounted) {
      initializeAndPoll(); // Execute initial fetch and start polling if necessary
    }

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [courseResetData, username]);

  const handleSubmit = useCallback(async (courseID) => {
    setError(null);
    const data = await postCourseReset(username, courseID);
    if (data && !data.errors) {
      const updatedCourseResetData = courseResetData.map((course) => {
        if (course.course_id === data.course_id) {
          return data;
        }
        return course;
      });
      setCourseResetData(updatedCourseResetData);
    }
    if (data && data.errors) {
      setError(data.errors[0].text);
    }
    close();
  }, [username, courseResetData]);

  const renderResetData = courseResetData.map((data) => {
    const updatedData = {
      displayName: data.display_name,
      courseId: data.course_id,
      status: data.status,
      action: 'Unavailable',
    };

    if (data.can_reset) {
      updatedData.action = (
        <>
          <Button
            variant="outline-primary"
            className="reset-btn"
            onClick={open}
          >
            Reset
          </Button>

          <AlertModal
            title="Warning"
            isOpen={isOpen}
            onClose={close}
            variant="warning"
            footerNode={(
              <ActionRow>
                <Button
                  variant="primary"
                  onClick={() => handleSubmit(data.course_id)}
                >
                  Yes
                </Button>
                <Button variant="tertiary" onClick={close}>
                  No
                </Button>
              </ActionRow>
            )}
          >
            <p>
              <FormattedMessage
                id="course.reset.alert.warning"
                defaultMessage="Are you sure? This will erase all of this learner's data for this course. This can only happen once per learner per course."
              />
            </p>
          </AlertModal>
        </>
      );
    }

    if (data.status.toLowerCase().includes('in progress')) {
      updatedData.action = (
        <Button type="Submit" disabled>
          Processing
        </Button>
      );
    }

    return updatedData;
  });

  return (
    <section data-testid="course-reset-container">
      <h3>Course Reset</h3>
      {error && (
        <Alert
          variant="danger"
          dismissible
          onClose={() => {
            setError(null);
          }}
        >
          {error}
        </Alert>
      )}
      <Table
        columns={[
          {
            Header: intl.formatMessage(messages.recordTableHeaderCourseName),
            accessor: 'displayName',
          },
          {
            Header: intl.formatMessage(messages.recordTableHeaderStatus),
            accessor: 'status',
          },
          {
            Header: 'Action',
            accessor: 'action',
          },
        ]}
        data={renderResetData}
      />
    </section>
  );
}

CourseReset.propTypes = {
  username: PropTypes.string.isRequired,
  intl: intlShape.isRequired,
};

export default injectIntl(CourseReset);
