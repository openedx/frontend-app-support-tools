import React from 'react';
import PropTypes from 'prop-types';
import { Hyperlink } from '@edx/paragon';
import { getConfig } from '@edx/frontend-platform';
import TableV2 from '../../components/Table';
import {
  CourseColumns,
  EnrollmentColumns,
} from './utils/constants';

export default function EnrollmentDetails({ enrollments }) {
  const { LMS_BASE_URL } = getConfig();
  return enrollments ? (
    enrollments.map((enrollment) => (
      <div key={enrollment.program_uuid} className="enrollments">
        <h3>
          Program: {enrollment.program_name} ({enrollment.program_uuid})
        </h3>
        <TableV2
          columns={EnrollmentColumns}
          data={[
            {
              status: enrollment.status,
              createdAt: enrollment.created,
              lastUpdate: enrollment.modified,
              externalUserKey: enrollment.external_user_key,
            },
          ]}
          styleName="custom-table enrollment-details"
        />
        <div>
          <h5>Program Course Enrollments</h5>
          <TableV2
            columns={CourseColumns}
            data={enrollment.program_course_enrollments.map(
              (programCourseEnrollment) => ({
                courseKey: (
                  <Hyperlink
                    destination={`${LMS_BASE_URL}${programCourseEnrollment.course_url}`}
                  >
                    {programCourseEnrollment.course_key}
                  </Hyperlink>
                ),
                status: programCourseEnrollment.status,
                created: programCourseEnrollment.created,
                update: programCourseEnrollment.modified,
                courseID: programCourseEnrollment.course_enrollment
                  ? programCourseEnrollment.course_enrollment.course_id
                  : 'N/A',
                isActive:
                  programCourseEnrollment.course_enrollment
                  && programCourseEnrollment.course_enrollment.is_active
                    ? 'True'
                    : 'False',
                mode: programCourseEnrollment.course_enrollment?.mode,
              }),
            )}
            styleName="custom-table course-enrollment-details"
          />
        </div>
      </div>
    ))
  ) : (
    <></>
  );
}

EnrollmentDetails.propTypes = {
  enrollments: PropTypes.arrayOf(
    PropTypes.shape({
      created: PropTypes.string,
      external_user_key: PropTypes.string,
      modified: PropTypes.string,
      program_course_enrollments: PropTypes.arrayOf(
        PropTypes.shape({
          course_key: PropTypes.string,
          course_url: PropTypes.string,
          created: PropTypes.string,
          modified: PropTypes.string,
          status: PropTypes.string,
          course_enrollment: PropTypes.shape({
            course_id: PropTypes.string,
            is_active: PropTypes.bool,
            mode: PropTypes.string,
          }),
        }),
      ),
    }),
  ),
};

EnrollmentDetails.defaultProps = {
  enrollments: null,
};
