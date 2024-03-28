import React from 'react';
import {
  ActionRow,
  Hyperlink,
  Stack,
  Icon,
  Col,
} from '@openedx/paragon';
import { getConfig } from '@edx/frontend-platform';
import { Warning } from '@openedx/paragon/icons';
import PROVISIONING_PAGE_TEXT, { DJANGO_ADMIN_ADD_CATALOG_PATH } from '../../data/constants';
import { indexOnlyPropType, selectProvisioningContext } from '../../data/utils';

const ProvisioningFormDefineCustomCatalogHeader = ({ index }) => {
  const { CUSTOM_CATALOG } = PROVISIONING_PAGE_TEXT.FORM;
  const { DJANGO_ADMIN_LMS_BASE_URL } = getConfig();
  const [formData] = selectProvisioningContext('formData');
  return (
    <>
      <ActionRow className="mb-1">
        <h3>{CUSTOM_CATALOG.HEADER.TITLE}</h3>
        <ActionRow.Spacer />
        <Hyperlink
          target="_blank"
          destination={`${DJANGO_ADMIN_LMS_BASE_URL}${DJANGO_ADMIN_ADD_CATALOG_PATH}`}
        >
          {CUSTOM_CATALOG.BUTTON.createCatalog}
        </Hyperlink>
      </ActionRow>
      {
        // Only render the warning header if we plan to display a catalog selector drop-down.
        !formData.policies[index].customCatalog && (
          <Stack direction="horizontal">
            <Icon src={Warning} className="align-self-start" />
            <Col className="col-8 pl-2">
              {CUSTOM_CATALOG.HEADER.WARN_SUB_TITLE}
            </Col>
          </Stack>
        )
      }
    </>
  );
};

ProvisioningFormDefineCustomCatalogHeader.propTypes = indexOnlyPropType;

export default ProvisioningFormDefineCustomCatalogHeader;
