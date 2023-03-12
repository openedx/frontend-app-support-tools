import {
  Stack,
  Form,
} from '@edx/paragon';
import { useState } from 'react';
import { useContextSelector } from 'use-context-selector';
import PROVISIONING_PAGE_TEXT from '../../data/constants';
import { ProvisioningContext } from '../../ProvisioningContext';

const ProvisioningFormCustomCatalogTextArea = () => {
  const { CUSTOM_CATALOG } = PROVISIONING_PAGE_TEXT.FORM;
  const { catalogQueries: { data: { contentFilter } } } = useContextSelector(ProvisioningContext, v => v[0]);
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

  const [catalogQueryContentFilter] = useState(JSON.stringify(sampleContentFilterResponse, null, 4));
  const [courseModes] = useState(JSON.stringify(sampleCourseModesResponse, null, 4));
  return (
    <Stack className="mt-4.5">
      <Form.Control
        className="mb-1"
        as="textarea"
        style={{ height: '200px' }}
        floatingLabel={CUSTOM_CATALOG.OPTIONS.contentFilter}
        value={catalogQueryContentFilter}
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
