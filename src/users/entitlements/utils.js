export default function makeRequestData({
  expiredAt = null, enrollmentCourseRun, action, comments,
}) {
  return {
    expired_at: expiredAt,
    support_details: [{
      unenrolled_run: enrollmentCourseRun,
      action,
      comments,
    }],
  };
}
