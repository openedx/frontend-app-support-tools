import { Stack } from '@edx/paragon';
import AssociatedCatalogDetail from './AssociatedCatalogDetail';
import PolicyDescription from './PolicyDescription';
import PolicyDetail from './PolicyDetail';
import PolicyDetailHeader from './PolicyDetailHeader';
import PolicyLimitsDetail from './PolicyLimitsDetail';

function getBudgetDisplayName(subsidyTitle, catalogTitle) {
  let budgetDisplayName;
  if (subsidyTitle && catalogTitle) {
    const associatedCatalog = catalogTitle.split(' - ')[1];
    budgetDisplayName = `${subsidyTitle} - ${associatedCatalog}`;
  }
  return budgetDisplayName;
}

const PolicyContainer = ({ data }) => {
  const { subsidy, policies, catalogs } = data;
  const renderPolicy = policies.map((policy) => catalogs.map(catalog => {
    if (catalog.uuid === policy.catalog_uuid) {
      return (
        <Stack key={policy.catalog_uuid} gap={48}>
          <PolicyDetailHeader policiesLength={policies.length} accountType={catalog.title} />
          <PolicyDetail
            displayName={getBudgetDisplayName(subsidy.title, catalog.title)}
            spendLimit={policy.spend_limit}
          />
          <PolicyDescription description={policy.description} />
          <AssociatedCatalogDetail associatedCatalog={catalog.title} />
          <PolicyLimitsDetail perLearnerLimit={policy.per_learner_spend_limit} />
        </Stack>
      );
    }
    return null;
  }));
  return renderPolicy;
};

export default PolicyContainer;
