import {
  Alert, AlertModal, Button, useToggle, ActionRow,
} from '@edx/paragon';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
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
    // check if there is an enqueued or in progress course reset
    const shouldPoll = courseResetData.some((course) => {
      const status = course.status.toLowerCase();
      return status.includes('in progress') || status.includes('enqueued');
    });

    let intervalId;
    if (shouldPoll) {
      intervalId = setInterval(async () => {
        const data = await getLearnerCourseResetList(username);
        setCourseResetData(data);
      }, POLLING_INTERVAL);
    }
    return () => clearInterval(intervalId);
  }, [courseResetData]);

  const handleSubmit = async (courseID) => {
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
  };

  useEffect(async () => {
    const handleRequest = async () => {
      const data = await getLearnerCourseResetList(username);
      if (data.length) {
        setCourseResetData(data);
      } else {
        setCourseResetData([]);
        setError(data.errors[0].text);
      }
    };

    handleRequest();
  }, []);

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
        styleName="custom-table"
      />
    </section>
  );
}

CourseReset.propTypes = {
  username: PropTypes.string.isRequired,
  intl: intlShape.isRequired,
};

export default injectIntl(CourseReset);
