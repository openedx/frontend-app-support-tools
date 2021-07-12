import React, {
  useEffect, useState, useContext, useLayoutEffect,
} from 'react';
import PropTypes from 'prop-types';
import { camelCaseObject } from '@edx/frontend-platform';
import PageLoading from '../../components/common/PageLoading';
import { formatDate } from '../../utils';
import UserMessagesContext from '../../userMessages/UserMessagesContext';
import AlertList from '../../userMessages/AlertList';
import { getCourseData } from '../data/api';

export default function CourseSummary({
  courseUUID,
  clearHandler,
  forwardedRef,
}) {
  const { add, clear } = useContext(UserMessagesContext);
  const [courseSummaryErrors, setCourseSummaryErrors] = useState(false);
  const [courseSummaryData, setCourseSummaryData] = useState(null);
  useEffect(() => {
    clear('course-summary');
    if (courseUUID !== null && courseUUID !== undefined) {
      setCourseSummaryData(null);
      getCourseData(courseUUID).then((result) => {
        const camelCaseResult = camelCaseObject(result);
        if (camelCaseResult.errors) {
          camelCaseResult.errors.forEach(error => add(error));
          setCourseSummaryErrors(true);
        } else {
          setCourseSummaryErrors(false);
          setCourseSummaryData(camelCaseResult);
        }
      });
    }
  }, [courseUUID]);
  useLayoutEffect(() => {
    if (forwardedRef && forwardedRef.current) { forwardedRef.current.focus(); }
  });
  function renderCourseRuns(data) {
    const { courseRuns } = data;
    if (courseRuns) {
      return (
        <div>
          <ul className="list-unstyled">
            {courseRuns.map((item) => (
              <li key={item.key}>
                {item.key} <b>Start:</b> {formatDate(item.start)} <b>End:</b>
                {formatDate(item.end)}
              </li>
            ))}
          </ul>
        </div>
      );
    }
    return <div>No Course Runs available</div>;
  }

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
      {!courseSummaryData && !courseSummaryErrors && <PageLoading srMessage="Loading" />}
      {courseSummaryErrors && (
        <>
          <AlertList topic="course-summary" className="m-3" />
          {renderHideButton()}
        </>
      )}
      {courseSummaryData && !courseSummaryErrors && (
        <div className="m-3">
          <h4>Course Summary: {courseSummaryData.title}</h4>
          <table className="table">
            <tbody>
              <tr>
                <td>UUID</td>
                <td>{courseSummaryData.uuid}</td>
              </tr>
              <tr>
                <td>Course Key</td>
                <td>{courseSummaryData.key}</td>
              </tr>
              <tr>
                <td>Course Runs</td>
                <td>{renderCourseRuns(courseSummaryData)}</td>
              </tr>
              <tr>
                <td>Level</td>
                <td>{courseSummaryData.levelType}</td>
              </tr>
              <tr>
                <td>Marketing</td>
                <td>
                  <a
                    href={courseSummaryData.marketingUrl}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Marketing URL
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
          {renderHideButton()}
        </div>
      )}
    </section>
  );
}

CourseSummary.propTypes = {
  courseUUID: PropTypes.string.isRequired,
  clearHandler: PropTypes.func,
  forwardedRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
};

CourseSummary.defaultProps = {
  clearHandler: null,
  forwardedRef: null,
};
