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

const LearnerCreditPlanCard = ({ isActive, subsidy, slug }) => {
  const { ADMIN_PORTAL_BASE_URL, SUBSIDY_BASE_DJANGO_URL } = getConfig();
  const startDate = formatDate(subsidy.activeDatetime);
  const endDate = formatDate(subsidy.expirationDatetime);
  const createdDate = formatDate(subsidy.created);

  return (
    <Card className="mb-4">
      <Card.Section
        className="pb-0 mb-4"
        actions={(
          <ActionRow>
            <Button
              data-testid="admin-portal-button"
              as="a"
              href={`${ADMIN_PORTAL_BASE_URL}/${slug}/admin/learner-credit/`}
              target="_blank"
              rel="noopener noreferrer"
              variant="inverse-primary"
            >View budgets
            </Button>
            <Button
              data-testid="django-button"
              as="a"
              href={`${SUBSIDY_BASE_DJANGO_URL}/admin/subsidy/subsidy/${subsidy.uuid}/change/`}
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
        <h3 className="mt-0 mb-0 lead">{startDate} - {endDate}</h3>
        <p className="x-small text-gray-400">Created {createdDate}</p>
      </Card.Section>
    </Card>
  );
};

LearnerCreditPlanCard.propTypes = {
  isActive: PropTypes.bool.isRequired,
  subsidy: PropTypes.shape({
    uuid: PropTypes.string.isRequired,
    activeDatetime: PropTypes.string.isRequired,
    expirationDatetime: PropTypes.string.isRequired,
    created: PropTypes.string.isRequired,
  }).isRequired,
  slug: PropTypes.string.isRequired,
};

export default LearnerCreditPlanCard;
