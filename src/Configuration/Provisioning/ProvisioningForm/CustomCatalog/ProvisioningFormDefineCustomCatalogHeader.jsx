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
import PropTypes from 'prop-types';
import { useContextSelector } from 'use-context-selector';
import PROVISIONING_PAGE_TEXT, { CATALOG_QUERY_PATH } from '../../data/constants';
import { ProvisioningContext } from '../../ProvisioningContext';

const ProvisioningFormDefineCustomCatalogHeader = ({ index }) => {
  const { CUSTOM_CATALOG } = PROVISIONING_PAGE_TEXT.FORM;
  const { LMS_BASE_URL } = getConfig();
  const { formData } = useContextSelector(ProvisioningContext, v => v[0]);

  return (
    <>
      <ActionRow className="mb-4.5">
        <h3>{CUSTOM_CATALOG.HEADER.DEFINE.TITLE}</h3>
        <ActionRow.Spacer />
        <Hyperlink
          target="_blank"
          destination={`${LMS_BASE_URL}${CATALOG_QUERY_PATH}`}
        >
          {CUSTOM_CATALOG.BUTTON.createQuery}
        </Hyperlink>
      </ActionRow>
      {formData.policies[index].customerCatalog === false && (
      <Stack direction="horizontal">
        <Icon src={Warning} className="align-self-start" />
        <Col className="col-8 pl-2">
          {CUSTOM_CATALOG.HEADER.DEFINE.SUB_TITLE}
        </Col>
      </Stack>
      )}
    </>
  );
};

ProvisioningFormDefineCustomCatalogHeader.propTypes = {
  index: PropTypes.number.isRequired,
};

export default ProvisioningFormDefineCustomCatalogHeader;
