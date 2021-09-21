export const fbeGatingConfigEnabled = {
  enabled: true,
  enabledAsOf: new Date('2020/01/01').toISOString(),
  reason: 'Site',
};

export const fbeDurationConfigEnabled = {
  enabled: true,
  enabledAsOf: new Date('2020/02/01').toISOString(),
  reason: 'Site Config',
};

export const fbeGatingConfigDisabled = {
  enabled: false,
  enabledAsOf: 'N/A',
  reason: '',
};

export const fbeDurationConfigDisabled = {
  enabled: false,
  enabledAsOf: 'N/A',
  reason: '',
};

export const fbeEnabledResponse = {
  courseId: 'course-v1:testX+test123+2030',
  courseName: 'test course',
  gatingConfig: fbeGatingConfigEnabled,
  durationConfig: fbeDurationConfigEnabled,
};
