import React from 'react';
import PropTypes from 'prop-types';
import PageLoading from '../components/common/PageLoading';
import formatDate from '../dates/formatDate';
import AlertList from '../user-messages/AlertList';

export default function CourseSummary({
  courseData,
  errors,
  clearHandler,
  forwardedRef,
}) {
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
      {!courseData && !errors && <PageLoading srMessage="Loading" />}
      {errors && (
        <>
          <AlertList topic="course-summary" className="m-3" />
          {renderHideButton()}
        </>
      )}
      {courseData && !errors && (
        <div className="m-3">
          <h4>Course Summary: {courseData.title}</h4>
          <table className="table">
            <tbody>
              <tr>
                <td>UUID</td>
                <td>{courseData ? courseData.uuid : ''}</td>
              </tr>
              <tr>
                <td>Course Key</td>
                <td>{courseData ? courseData.key : ''}</td>
              </tr>
              <tr>
                <td>Course Runs</td>
                <td>{renderCourseRuns(courseData)}</td>
              </tr>
              <tr>
                <td>Level</td>
                <td>{courseData ? courseData.levelType : ''}</td>
              </tr>
              <tr>
                <td>Marketing</td>
                <td>
                  {courseData ? (
                    <a
                      href={courseData.marketingUrl}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      Marketing URL
                    </a>
                  ) : (
                    ''
                  )}
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
  courseData: PropTypes.shape({
    title: PropTypes.string,
    uuid: PropTypes.string,
    key: PropTypes.string,
    levelType: PropTypes.string,
    marketingUrl: PropTypes.string,
    courseRuns: PropTypes.arrayOf(
      PropTypes.shape({
        key: PropTypes.string,
      }),
    ),
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
