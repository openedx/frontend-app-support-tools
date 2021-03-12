const CourseSummaryData = {
  courseData: {
    title: 'Test Course',
    uuid: '1234-5678-12345678',
    key: 'coursev1+1234',
    level: 'Introductory',
    marketingUrl: 'www.testUrl.com',
    courseRuns: [
      {
        key: 'course-run-1',
        start: Date().toLocaleString(),
        end: Date().toLocaleString(),
      },
      {
        key: 'course-run-2',
        start: Date().toLocaleString(),
        end: Date().toLocaleString(),
      },
    ],
  },
  clearHandler: jest.fn(() => {}),
};

export default CourseSummaryData;
