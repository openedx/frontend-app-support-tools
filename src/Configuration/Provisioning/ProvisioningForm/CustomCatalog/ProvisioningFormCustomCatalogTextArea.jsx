import {
  Stack,
  Form,
} from '@edx/paragon';
import { useState } from 'react';
import PROVISIONING_PAGE_TEXT from '../../data/constants';

const ProvisioningFormCustomCatalogTextArea = () => {
  const { CUSTOM_CATALOG } = PROVISIONING_PAGE_TEXT.FORM;
  // TODO: Replace this with a real API response
  const sampleContentFilterResponse = {
    content_type: 'course',
    partner: 'edx',
    level_type: [
      'Introductory',
      'Intermediate',
      'Advanced',
    ],
    availability: [
      'Current',
      'Starting Soon',
      'Upcoming',
    ],
    status: 'published',
  };
  const sampleCourseModesResponse = [
    'verified',
    'professional',
    'no-id-professional',
    'audit',
    'honor',
  ];
  const [contentFilter] = useState(JSON.stringify(sampleContentFilterResponse, null, 4));
  const [courseModes] = useState(JSON.stringify(sampleCourseModesResponse, null, 4));
  return (
    <Stack className="mt-4.5">
      <Form.Control
        className="mb-1"
        as="textarea"
        style={{ height: '200px' }}
        floatingLabel={CUSTOM_CATALOG.OPTIONS.contentFilter}
        value={contentFilter}
        disabled
      />
      <Form.Control
        className="mt-4.5"
        as="textarea"
        style={{ height: '200px' }}
        floatingLabel={CUSTOM_CATALOG.OPTIONS.courseModes}
        value={courseModes}
        disabled
      />
    </Stack>
  );
};

export default ProvisioningFormCustomCatalogTextArea;
