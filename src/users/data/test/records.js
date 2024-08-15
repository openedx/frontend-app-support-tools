const records = [
  {
    record: {
      learner: {
        full_name: 'Sebastian Malone',
        username: 'username',
        email: 'email@example.com',
      },
      program: {
        name: 'Tightrope walking',
        type: 'professional-certificate',
        type_name: 'Professional Certificate',
        completed: false,
        empty: false,
        last_updated: '2022-06-28T18:46:59.978935+00:00',
        school: 'edX',
      },
      platform_name: 'Open edX',
      grades: [
        {
          name: 'Intro to Tightrope walking',
          school: 'edX',
          attempts: 1,
          course_id: 'course-v1:edX+Tightrope101+2T2022',
          issue_date: '2022-06-28T18:46:59+00:00',
          percent_grade: 1.0,
          letter_grade: 'Pass',
        },
        {
          name: 'Advanced Tightrope Walking',
          school: 'edX',
          attempts: 0,
          course_id: '',
          issue_date: '',
          percent_grade: 0.0,
          letter_grade: '',
        },
      ],
      pathways: [
        {
          name: 'Funambulist',
          id: 1,
          status: 'sent',
          is_active: true,
          pathway_type: 'credit',
        },
      ],
      shared_program_record_uuid: '99a78cf1-354a-4f8a-8922-913f695e187f',
    },
    is_public: false,
    uuid: '82d38639ccc340db8be5f0f259500dde',
    records_help_url: 'http://localhost:18000/faq',
  },
];

export default records;
