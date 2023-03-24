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
import { lmsCustomerCatalog, selectProvisioningContext } from '../../data/utils';

const ProvisioningFormSourceCustomCatalogHeader = () => {
  const { CUSTOM_CATALOG } = PROVISIONING_PAGE_TEXT.FORM;
  const { LMS_BASE_URL } = getConfig();
  const [formData] = selectProvisioningContext('formData');

  return (
    <>
      <ActionRow className="mb-4.5">
        <h3>{CUSTOM_CATALOG.HEADER.SOURCE.TITLE}</h3>
        <ActionRow.Spacer />
        <Hyperlink
          target="_blank"
          destination={`${LMS_BASE_URL}${lmsCustomerCatalog.queryBy(formData?.enterpriseUUID || null)}`}
        >
          {CUSTOM_CATALOG.BUTTON.viewCustomerCatalog}
        </Hyperlink>
      </ActionRow>
      <Stack direction="horizontal">
        <Icon src={Warning} className="align-self-start" />
        <Col className="col-8 pl-2">
          {CUSTOM_CATALOG.HEADER.SOURCE.SUB_TITLE}
        </Col>
      </Stack>
    </>
  );
};

export default ProvisioningFormSourceCustomCatalogHeader;
