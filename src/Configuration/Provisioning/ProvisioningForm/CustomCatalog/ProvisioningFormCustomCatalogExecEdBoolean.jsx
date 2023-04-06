import { ActionRow, Icon } from '@edx/paragon';
import { CheckCircle, Close } from '@edx/paragon/icons';
import { useEffect, useState } from 'react';
import { selectProvisioningContext } from '../../data/utils';
import PROVISIONING_PAGE_TEXT from '../../data/constants';

const ProvisioningFormCustomCatalogExecEdBoolean = () => {
  const { includeExecEd2UCourses } = PROVISIONING_PAGE_TEXT.FORM.CUSTOM_CATALOG.OPTIONS;
  const [formData] = selectProvisioningContext('formData');
  const [includeExecEdCourses, setIncludeExecEdCourses] = useState(
    formData.policies[0].catalogQueryMetadata.catalogQuery.includeExecEd2UCourses,
  );

  useEffect(() => {
    setIncludeExecEdCourses(formData.policies[0].catalogQueryMetadata.catalogQuery.includeExecEd2UCourses);
  }, [formData.policies[0].catalogQueryMetadata.catalogQuery.includeExecEd2UCourses]);

  return (
    <ActionRow>
      {includeExecEdCourses
        ? <Icon src={CheckCircle} className="text-success" />
        : <Icon src={Close} className="text-danger" />}
      <h4 className="ml-2">{includeExecEd2UCourses}</h4>
    </ActionRow>
  );
};

export default ProvisioningFormCustomCatalogExecEdBoolean;
