import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import PageLoading from '../PageLoading';
import Table from '../Table';
import AlertList from '../user-messages/AlertList';

export default function CourseSummary({
  courseData,
  errors,
  clearHandler,
  forwardedRef,
}) {
  const columns = [
    {
      label: 'Name',
      key: 'dataName',
    },
    {
      label: 'Value',
      key: 'dataValue',
    },
  ];

  function renderCourseRuns(data) {
    const { courseRuns } = data;
    return (
      <div>
        <ul className="list-unstyled">
          {
            courseRuns.map((item) => (
              <li key={item.key}>
                {item.key} <b>Start:</b> {item.start ? moment(item.start).format('lll') : ''}, <b>End:</b> {item.end ? moment(item.end).format('lll') : ''}
              </li>
            ))
          }
        </ul>
      </div>
    );
  }

  const courseTableData = courseData ? [
    {
      dataName: 'UUID',
      dataValue: courseData.uuid,
    },
    {
      dataName: 'Course Key',
      dataValue: courseData.key,
    },
    {
      dataName: 'Course Runs',
      dataValue: renderCourseRuns(courseData),
    },
    {
      dataName: 'Level',
      dataValue: courseData.levelType,
    },
    {
      dataName: 'Marketing',
      dataValue: <a href={courseData.marketingUrl} rel="noopener noreferrer" target="_blank">Marketing URL</a>,
    },
  ] : [];

  function renderHideButton() {
    return (
      <div className="d-flex flex-row justify-content-end mb-2">
        <button
          onClick={clearHandler}
          className="btn btn-outline-secondary"
          ref={forwardedRef}
          type="button"
        >
          Hide
        </button>
      </div>
    );
  }
  return (
    <section className="card mb-3">
      {!courseData && !errors && (
        <PageLoading
          srMessage="Loading"
        />
      )}
      {errors && (
        <>
          <AlertList topic="course-summary" className="m-3" />
          {renderHideButton()}
        </>
      )}
      {courseData && !errors && (
        <div className="m-3">
          <h4>
            Course Summary: {courseData.title}
          </h4>
          <Table
            data={courseTableData}
            columns={columns}
          />
          {renderHideButton()}
        </div>

      )}
    </section>
  );
}

CourseSummary.propTypes = {
  courseData: PropTypes.shape({
    title: PropTypes.string,
    uuid: PropTypes.string,
    key: PropTypes.string,
    levelType: PropTypes.string,
    marketingUrl: PropTypes.string,
    courseRuns: PropTypes.arrayOf(PropTypes.shape({
      key: PropTypes.string,
    })),
  }),
  errors: PropTypes.bool,
  clearHandler: PropTypes.func,
  forwardedRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
};

CourseSummary.defaultProps = {
  courseData: null,
  errors: false,
  clearHandler: null,
  forwardedRef: null,
};
