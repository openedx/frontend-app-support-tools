import messages from './messages';

export const INSTRUCTOR_ROLE = 'instructor';
export const STAFF_ROLE = 'staff';
export const NULL_ROLE = 'null';
export const ACTIVE_COURSE_STATUS = 'active';
export const ARCHIVED_COURSE_STATUS = 'archived';

export const COURSE_STATUS_DROPDOWN_OPTIONS = [
  { value: '', label: messages.allCoursesFilterLabel },
  { value: ACTIVE_COURSE_STATUS, label: messages.activeCoursesFilterLabel },
  { value: ARCHIVED_COURSE_STATUS, label: messages.archivedCoursesFilterLabel },
];

export const ROLE_DROPDOWN_OPTIONS = [
  { value: STAFF_ROLE, label: messages.statusStaffFilterLabel },
  { value: INSTRUCTOR_ROLE, label: messages.statusAdminFilterLabel },
];
