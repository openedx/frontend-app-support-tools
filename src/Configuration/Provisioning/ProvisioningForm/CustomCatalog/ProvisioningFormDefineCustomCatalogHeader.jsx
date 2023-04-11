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
import PROVISIONING_PAGE_TEXT, { CATALOG_QUERY_PATH } from '../../data/constants';
import { indexOnlyPropType, selectProvisioningContext } from '../../data/utils';
import PropTypes from 'prop-types';
import { Button } from '@edx/paragon';

const ProvisioningFormDefineCustomCatalogHeader = ({ index, handleShowCatalogCurationButton, showCatalogCuration }) => {
  const { CUSTOM_CATALOG } = PROVISIONING_PAGE_TEXT.FORM;
  const { DJANGO_ADMIN_LMS_BASE_URL } = getConfig();
  const [formData] = selectProvisioningContext('formData');
  return (
    <>
      <ActionRow className="mb-4.5">
        <h3>{CUSTOM_CATALOG.HEADER.DEFINE.TITLE}</h3>
        <ActionRow.Spacer />
        <Hyperlink
          target="_blank"
          destination={`${DJANGO_ADMIN_LMS_BASE_URL}${CATALOG_QUERY_PATH}`}
        >
          {CUSTOM_CATALOG.BUTTON.createQuery}
        </Hyperlink>
      </ActionRow>
      <Button className="mb-3.5" onClick={handleShowCatalogCurationButton}>{showCatalogCuration ? "Hide" : "Show"} Catalog Curation</Button>
      {(formData.policies[index].customerCatalog === false && !showCatalogCuration) && (
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
  index: PropTypes.number,
  handleShowCatalogCurationButton: PropTypes.func,
  showCatalogCuration: PropTypes.bool,
};

export default ProvisioningFormDefineCustomCatalogHeader;
