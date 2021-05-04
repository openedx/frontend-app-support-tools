/* eslint-disable react/jsx-indent */
import React from 'react';
import PropTypes from 'prop-types';

export default function EnrollmentExtra({
  enrollmentExtraData, closeHandler, forwardedRef,
}) {
  return (
    <section className="card mb-3">
        <div className="m-3">
          <h4>Course Title: {enrollmentExtraData.courseName}</h4>
      <table className="table">
        <tbody>

          <tr>
            <td>Last Modified</td>
            <td>{enrollmentExtraData.lastModified}</td>
          </tr>

          <tr>
            <td>Last Modified By</td>
            <td>{enrollmentExtraData.lastModifiedBy}</td>
          </tr>

          <tr>
            <td>Reason</td>
            <td>{enrollmentExtraData.reason}</td>
          </tr>
        </tbody>

      </table>

      <div className="d-flex flex-row justify-content-end mb-2">
        <button
          onClick={closeHandler}
          className="btn btn-outline-secondary"
          type="button"
          ref={forwardedRef}
        >
            Hide
        </button>
      </div>
        </div>
    </section>
  );
}

EnrollmentExtra.propTypes = {
  enrollmentExtraData: PropTypes.shape({
    courseName: PropTypes.string,
    lastModified: PropTypes.string,
    lastModifiedBy: PropTypes.string,
    reason: PropTypes.string,
  }),
  closeHandler: PropTypes.func,
  forwardedRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
};

EnrollmentExtra.defaultProps = {
  enrollmentExtraData: null,
  closeHandler: null,
  forwardedRef: null,
};
