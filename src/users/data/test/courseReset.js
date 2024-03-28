export const expectedGetData = [
  {
    course_id: 'course-v1:edX+DemoX+Demo_Course',
    display_name: 'Demonstration Course',
    can_reset: false,
    status: 'Enqueued - Created 2024-02-28 11:29:06.318091+00:00 by edx',
  },
  {
    course_id: 'course-v1:EdxOrg+EDX101+2024_Q1',
    display_name: 'Intro to edx',
    can_reset: true,
    status: 'Available',
  },
  {
    course_id: 'course-v1:EdxOrg+EDX201+2024_Q2',
    display_name: 'Intro to new course',
    can_reset: false,
    status: 'in progress',
  },
];

export const expectedPostData = {
  course_id: 'course-v1:EdxOrg+EDX101+2024_Q1',
  display_name: 'Intro to edx',
  can_reset: false,
  status: 'Enqueued - Created 2024-02-28 11:29:06.318091+00:00 by edx',
};
