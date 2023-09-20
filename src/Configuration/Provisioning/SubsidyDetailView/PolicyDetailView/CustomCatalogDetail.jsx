import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router';
import { logError } from '@edx/frontend-platform/logging';
import LmsApiService from '../../../../data/services/EnterpriseApiService';
import PROVISIONING_PAGE_TEXT from '../../data/constants';
import ROUTES from '../../../../data/constants/routes';

const { FORM: { CUSTOM_CATALOG } } = PROVISIONING_PAGE_TEXT;

function getCustomCatalogTitle(catalogTitle) {
  let customCatalogTitle;
  const separator = ' - ';
  if (catalogTitle.includes(separator)) {
    [, customCatalogTitle] = catalogTitle.split(separator);
  }
  return customCatalogTitle;
}

async function getCatalogQueries() {
  const { data } = await LmsApiService.fetchEnterpriseCatalogQueries();
  return data;
}

const CustomCatalogDetail = ({ catalogTitle }) => {
  const history = useHistory();
  const { SUB_DIRECTORY: { ERROR } } = ROUTES.CONFIGURATION.SUB_DIRECTORY.PROVISIONING;

  const [catalogQueryContentFilter, setCatalogQueryContentFilter] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const redirectOnError = (statusCode, message) => {
    history.push(ERROR, {
      errorMessage: `Error ${statusCode}: ${message}`,
    });
  };

  const formatCatalogTitle = getCustomCatalogTitle(catalogTitle);

  useEffect(() => {
    const fetchCatalogQueryContentFilter = async () => {
      try {
        const catalogQueries = await getCatalogQueries();
        const findCatalogQuery = catalogQueries.results.filter(
          catalogQuery => formatCatalogTitle === catalogQuery.title,
        );
        setCatalogQueryContentFilter(JSON.stringify(findCatalogQuery[0]?.content_filter, null, 2));
        setIsLoading(false);
      } catch (error) {
        const { customAttributes } = error;
        logError(error);
        redirectOnError(customAttributes?.httpErrorStatus, error);
      }
    };
    fetchCatalogQueryContentFilter();
  }, [catalogTitle]);

  return (
    !isLoading ? (
      <div className="mb-1 mt-4.5">
        <h4>{CUSTOM_CATALOG.HEADER.DEFINE.TITLE}</h4>
        <div className="mb-1 ml-3 mt-3">
          <h5>{CUSTOM_CATALOG.OPTIONS.enterpriseCatalogQuery.title}</h5>
          <p className="small">
            {catalogTitle}
          </p>
          <h5>{CUSTOM_CATALOG.OPTIONS.catalogTitle}</h5>
          <p className="small">
            {getCustomCatalogTitle(catalogTitle)}
          </p>
          <h5>{CUSTOM_CATALOG.OPTIONS.contentFilter}</h5>
          <pre data-testid="content-filter" style={{ font: 'inherit' }} className="text-gray-500">
            <span className="small">
              {catalogQueryContentFilter}
            </span>
          </pre>
        </div>
      </div>
    ) : null
  );
};

CustomCatalogDetail.propTypes = {
  catalogTitle: PropTypes.string.isRequired,
};

export default CustomCatalogDetail;
