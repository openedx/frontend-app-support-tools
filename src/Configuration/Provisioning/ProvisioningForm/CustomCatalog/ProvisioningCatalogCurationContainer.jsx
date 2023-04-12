import CatalogCurationContextProvider from '../CatalogCuration/CatalogCurationContext';
import CatalogCurationSearch from '../CatalogCuration/CatalogCurationSearch';
import { Button } from '@edx/paragon';

import EnterpriseCatalogApiService from '../../../../data/services/EnterpriseCatalogApiService';
import { selectProvisioningContext } from '../../data/utils';
import { logError } from '@edx/frontend-platform/logging';
import { useContextSelector } from 'use-context-selector';
import { CatalogCurationContext } from '../CatalogCuration/CatalogCurationContext';
import { useEffect, useState } from 'react';
import { Form } from '@edx/paragon';
import PROVISIONING_PAGE_TEXT from '../../data/constants';


const ProvisioningCatalogCurationContainer = () => {
  const { CUSTOM_CATALOG } = PROVISIONING_PAGE_TEXT.FORM;
  const { startDate, endDate } = useContextSelector(CatalogCurationContext, v => v[0]);
  let searchParams = new URLSearchParams(window.location.search);

  const [catalogQuery, setCatalogQuery] = useState({});
  useEffect(() => {
    let baseQuery = {
      "content_type": [
        "learnerpathway",
        "course"
      ],
      "availability": [
        "Current",
        "Starting Soon",
        "Upcoming"
      ],
      "partner": "edx",
      "level_type": [
        "Introductory",
        "Intermediate",
        "Advanced"
      ],
      "status": [
        "published",
        "active"
      ],
      "org__exclude": [
        "StanfordOnline",
        "PennX"
      ]
    };
    if (startDate !== '') {
      baseQuery['start'] = startDate;
    }
    if (endDate !== '') {
      baseQuery['end'] = endDate;
    }
    if (searchParams) {
      searchParams.forEach((value, key) => {
        baseQuery[key] = value;
      });
    }
    setCatalogQuery(baseQuery)
  }, [startDate, endDate, window.location.search]);

  // const [catalogQueryContentFilter, setCatalogQueryContentFilter] = useState(

  // );

  const [formData] = selectProvisioningContext('formData');
  const handleClick = () => {
    EnterpriseCatalogApiService.generateNewCustomerCatalog(
      formData.enterpriseUUID,
      catalogQuery,
    )
      .then((response) => {
        console.log(response);
      })
      .catch((err) => {
        console.log("sad");
      });
  };
  return (
    <>
      <CatalogCurationSearch />
      <Form.Control
        className="mb-1 bg-gray-600"
        as="textarea"
        style={{ height: '200px' }}
        floatingLabel={CUSTOM_CATALOG.OPTIONS.queryPreview}
        value={JSON.stringify(catalogQuery, null, 4)}
        disabled
      />
      <Button
        onClick={handleClick}
      >
        Submit Catalog
      </Button>
    </>
  )
};

export default ProvisioningCatalogCurationContainer;
