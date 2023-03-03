import React from 'react';
import {
  ActionRow,
  Hyperlink,
  Stack,
  Icon,
  Col,
} from '@edx/paragon';
import { getConfig } from '@edx/frontend-platform';
import { Warning } from '@edx/paragon/icons';
import PROVISIONING_PAGE_TEXT from '../../data/constants';

const ProvisioningFormCustomCatalogHeader = () => {
  const { CUSTOM_CATALOG } = PROVISIONING_PAGE_TEXT.FORM;
  const { LMS_BASE_URL } = getConfig();
  return (
    <>
      <ActionRow className="mb-4.5">
        <h3>{CUSTOM_CATALOG.TITLE}</h3>
        <ActionRow.Spacer />
        <Hyperlink
          target="_blank"
          destination={`${LMS_BASE_URL}/admin/enterprise/enterprisecustomercatalog`}
        >
          {CUSTOM_CATALOG.BUTTON.create}
        </Hyperlink>
      </ActionRow>
      <Stack direction="horizontal">
        <Icon src={Warning} className="align-self-start" />
        <Col className="col-8 pl-2">
          {CUSTOM_CATALOG.SUB_TITLE}
        </Col>
      </Stack>
    </>
  );
};

export default ProvisioningFormCustomCatalogHeader;
