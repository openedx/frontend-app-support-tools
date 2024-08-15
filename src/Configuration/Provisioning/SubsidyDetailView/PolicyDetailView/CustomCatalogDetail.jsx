import {
  Hyperlink,
} from '@openedx/paragon';
import PropTypes from 'prop-types';
import { getConfig } from '@edx/frontend-platform';
import PROVISIONING_PAGE_TEXT, { DJANGO_ADMIN_RETRIEVE_CATALOG_PATH } from '../../data/constants';

const { FORM: { CUSTOM_CATALOG } } = PROVISIONING_PAGE_TEXT;

const CustomCatalogDetail = ({ catalogUuid, catalogTitle }) => {
  const { DJANGO_ADMIN_LMS_BASE_URL } = getConfig();
  return (
    <div className="mb-1 mt-4.5">
      <h4>{CUSTOM_CATALOG.DETAIL_HEADER.TITLE}</h4>
      <div className="mb-1 ml-3 mt-3">
        <h5>{CUSTOM_CATALOG.DETAIL_HEADER.UUID_FIELD}</h5>
        <p className="small">
          <Hyperlink
            target="_blank"
            destination={`${DJANGO_ADMIN_LMS_BASE_URL}${DJANGO_ADMIN_RETRIEVE_CATALOG_PATH(catalogUuid)}`}
          >
            {catalogUuid}
          </Hyperlink>
        </p>
        <h5>{CUSTOM_CATALOG.DETAIL_HEADER.TITLE_FIELD}</h5>
        <p className="small">
          {catalogTitle}
        </p>
      </div>
    </div>
  );
};

CustomCatalogDetail.propTypes = {
  catalogUuid: PropTypes.string.isRequired,
  catalogTitle: PropTypes.string.isRequired,
};

export default CustomCatalogDetail;
