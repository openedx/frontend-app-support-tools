export const downloadableCertificate = {
  courseKey: 'course-v1:testX+test123+2030',
  type: 'verified',
  status: 'passing',
  grade: '60',
  modified: new Date('2020/01/01').toLocaleString(),
  downloadUrl: '/certificates/1234-abcd',
  regenerate: false,
};

export const regeneratableCertificate = {
  courseKey: 'course-v1:testX+test123+2030',
  type: 'verified',
  status: 'passing',
  grade: '60',
  modified: new Date('2020/01/01').toLocaleString(),
  downloadUrl: null,
  regenerate: true,
};

export const pdfCertificate = {
  courseKey: 'course-v1:testX+test123+2030',
  type: 'verified',
  status: 'passing',
  is_pdf_certificate: true,
  grade: '60',
  modified: new Date('2020/01/01').toLocaleString(),
  downloadUrl: 'https://www.example.com',
  regenerate: true,
};
