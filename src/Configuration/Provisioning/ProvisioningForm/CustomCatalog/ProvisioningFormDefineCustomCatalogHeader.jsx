import React from 'react';
import {
  ActionRow,
  Stack,
  Icon,
  Col,
  Button,
} from '@edx/paragon';
import { Warning } from '@edx/paragon/icons';
import PropTypes from 'prop-types';
import PROVISIONING_PAGE_TEXT from '../../data/constants';
import { selectProvisioningContext } from '../../data/utils';

const ProvisioningFormDefineCustomCatalogHeader = ({ index, handleShowCatalogCurationButton, showCatalogCuration }) => {
  const { CUSTOM_CATALOG } = PROVISIONING_PAGE_TEXT.FORM;
  const [formData] = selectProvisioningContext('formData');
  return (
    <>
      <ActionRow className="mb-3">
        <h3>{CUSTOM_CATALOG.HEADER.DEFINE.TITLE}</h3>
        <ActionRow.Spacer />
        <Button onClick={handleShowCatalogCurationButton}>{showCatalogCuration ? 'Hide' : 'Show'} Catalog Curation</Button>
      </ActionRow>
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
  index: PropTypes.number.isRequired,
  handleShowCatalogCurationButton: PropTypes.func.isRequired,
  showCatalogCuration: PropTypes.bool.isRequired,
};

export default ProvisioningFormDefineCustomCatalogHeader;
