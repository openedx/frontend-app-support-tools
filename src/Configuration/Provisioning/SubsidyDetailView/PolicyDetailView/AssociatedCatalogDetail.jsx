import CustomCatalogDetail from './CustomCatalogDetail';
import PROVISIONING_PAGE_TEXT from '../../data/constants';
import { indexOnlyPropType, selectProvisioningContext } from '../../data/utils';

const { FORM } = PROVISIONING_PAGE_TEXT;

const AssociatedCatalogDetail = ({ index }) => {
  const [formData] = selectProvisioningContext('formData');
  return (
    <div className="mb-1 mt-3">
      <h3>{FORM.CATALOG.TITLE}</h3>
      <div className="mb-1 ml-3 mt-3">
        <h4>{FORM.CATALOG.SUB_TITLE}</h4>
        <p className="small">
          {
            formData.policies[index].customCatalog
              ? FORM.CATALOG.OPTIONS.custom
              : FORM.CATALOG.OPTIONS[formData.policies[index].predefinedQueryType]
          }
        </p>
        {
          formData.policies[index].customCatalog
           && (
             <CustomCatalogDetail
               catalogUuid={formData.policies[index].catalogUuid}
               catalogTitle={formData.policies[index].catalogTitle}
             />
           )
        }
      </div>
    </div>
  );
};

AssociatedCatalogDetail.propTypes = indexOnlyPropType;

export default AssociatedCatalogDetail;
