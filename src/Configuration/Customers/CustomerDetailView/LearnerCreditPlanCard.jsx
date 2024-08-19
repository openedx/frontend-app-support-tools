import PropTypes from 'prop-types';
import {
  ActionRow,
  Button,
  Card,
  Chip,
  Stack,
} from '@openedx/paragon';
import { Launch } from '@openedx/paragon/icons';
import { getConfig } from '@edx/frontend-platform';
import { formatDate } from '../data/utils';

const LearnerCreditPlanCard = ({ isActive, policy, slug }) => {
  const { ADMIN_PORTAL_BASE_URL, ENTERPRISE_ACCESS_BASE_URL } = getConfig();
  const startDate = formatDate(policy.subsidyActiveDatetime);
  const endDate = formatDate(policy.subsidyExpirationDatetime);
  const createdDate = formatDate(policy.created);

  return (
    <Card className="mb-4">
      <Card.Section
        className="pb-0 mb-4"
        actions={(
          <ActionRow>
            <Button
              data-testid="admin-portal-button"
              as="a"
              href={`${ADMIN_PORTAL_BASE_URL}/${slug}/admin/learner-credit/${policy.uuid}`}
              target="_blank"
              rel="noopener noreferrer"
              variant="inverse-primary"
            >View budgets
            </Button>
            <Button
              data-testid="django-button"
              as="a"
              href={`${ENTERPRISE_ACCESS_BASE_URL}/admin/subsidy_access_policy/${policy.policyType.toLowerCase()}/${policy.uuid}`}
              variant="primary"
              target="_blank"
              rel="noopener noreferrer"
              iconAfter={Launch}
            >
              Open in Django
            </Button>
          </ActionRow>
        )}
      >
        <Stack
          gap={2}
          direction="horizontal"
        >
          {!isActive ? <Chip variant="dark" className="bg-danger-500">Inactive</Chip> : null}
          <h6 className="mb-0">LEARNER CREDIT PLAN</h6>
        </Stack>
        <p className="mt-0 mb-0 lead font-weight-bold">{startDate} - {endDate}</p>
        <p className="x-small text-light-900">Created {createdDate}</p>
      </Card.Section>
    </Card>
  );
};

LearnerCreditPlanCard.propTypes = {
  isActive: PropTypes.bool.isRequired,
  policy: PropTypes.shape({
    uuid: PropTypes.string.isRequired,
    subsidyActiveDatetime: PropTypes.string.isRequired,
    subsidyExpirationDatetime: PropTypes.string.isRequired,
    policyType: PropTypes.string.isRequired,
    created: PropTypes.string.isRequired,
  }).isRequired,
  slug: PropTypes.string.isRequired,
};

export default LearnerCreditPlanCard;
