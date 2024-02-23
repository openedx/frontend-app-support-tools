import {
  AlertModal, Button, useToggle, ActionRow,
} from '@edx/paragon';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { injectIntl, intlShape, FormattedMessage } from '@edx/frontend-platform/i18n';
import Table from '../components/Table';

import messages from './messages';

function CourseReset({ username, intl }) {
  const [courseResetData, setCourseResetData] = useState([]);
  const [isOpen, open, close] = useToggle(false);
  const handleSubmit = () => {
    console.log(`Request sent! for ${username}`);
    close();
  };

  useEffect(() => {
    const currentData = [
      { course_id: 'Into to re-dos', status: 'Completed on 1/3/24 12:13:34 by rdoris@edx.org', can_reset: false },
      { course_id: 'Intermediate try again', status: 'Unavailable', can_reset: false },
      { course_id: 'Advanced Erasing', status: 'Course no yet begun', can_reset: false },
      { course_id: 'Re-Dos 301', status: 'In Progress - Started 2/15/24 1:08:00', can_reset: false },
      { course_id: 'Re-Dos 201', status: 'Available', can_reset: true },
    ];
    setCourseResetData(currentData);
  }, []);

  const renderResetData = courseResetData.map((data) => {
    const updatedData = { courseId: data.course_id, status: data.status, action: 'Unavailable' };

    if (data.can_reset) {
      updatedData.action = (
        <>
          <Button variant="outline-primary" className="reset-btn" onClick={open}>
            Reset
          </Button>

          <AlertModal
            title="Warning"
            isOpen={isOpen}
            onClose={close}
            variant="warning"
            footerNode={(
              <ActionRow>
                <Button variant="primary" onClick={handleSubmit}>Yes</Button>
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
      updatedData.action = <Button type="Submit" disabled>In Progress</Button>;
    }

    return updatedData;
  });

  return (
    <section data-testid="course-reset-container">
      <h3>Course Reset</h3>
      <Table
        columns={[
          {
            Header: intl.formatMessage(messages.recordTableHeaderCourseName),
            accessor: 'courseId',
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
