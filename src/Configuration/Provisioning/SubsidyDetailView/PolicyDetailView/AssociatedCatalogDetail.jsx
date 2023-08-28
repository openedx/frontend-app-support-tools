import PropTypes from 'prop-types';
import CustomCatalogDetail from './CustomCatalogDetail';
import PROVISIONING_PAGE_TEXT from '../../data/constants';

const { FORM: { CATALOG } } = PROVISIONING_PAGE_TEXT;

// finds the catalog in associatedCatalog string,
// e.g. "9c1fd12b-2365-4100-8e3e-01d2ff1414e0 - Executive Education budget"
// returns "Executive Education"
function getCatalogType(associatedCatalog) {
  let catalogType = null;
  if (associatedCatalog) {
    if (associatedCatalog.includes(CATALOG.OPTIONS.openCourses)) {
      catalogType = CATALOG.OPTIONS.openCourses;
    } else if (associatedCatalog.includes(CATALOG.OPTIONS.executiveEducation)) {
      catalogType = CATALOG.OPTIONS.executiveEducation;
    } else if (associatedCatalog.includes(CATALOG.OPTIONS.everything)) {
      catalogType = CATALOG.OPTIONS.everything;
    } else {
      catalogType = CATALOG.OPTIONS.custom;
    }
  }
  return catalogType;
}

const AssociatedCatalogDetail = ({ associatedCatalog }) => {
  const catalogType = getCatalogType(associatedCatalog);

  return (
    <div className="mb-1 mt-3">
      <h3>{CATALOG.TITLE}</h3>
      <div className="mb-1 ml-3 mt-3">
        <h4>{CATALOG.SUB_TITLE}</h4>
        <p className="small">
          {catalogType}
        </p>
        {(catalogType === CATALOG.OPTIONS.custom) && <CustomCatalogDetail catalogTitle={associatedCatalog} />}
      </div>
    </div>
  );
};

AssociatedCatalogDetail.propTypes = {
  associatedCatalog: PropTypes.string.isRequired,
};

export default AssociatedCatalogDetail;
