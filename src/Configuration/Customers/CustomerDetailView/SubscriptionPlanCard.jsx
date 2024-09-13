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

const SubscriptionPlanCard = ({ isActive, subscription, slug }) => {
  const { ADMIN_PORTAL_BASE_URL, LICENSE_MANAGER_DJANGO_URL } = getConfig();
  const startDate = formatDate(subscription.startDate);
  const endDate = formatDate(subscription.expirationDate);
  const createdDate = formatDate(subscription.created);
  return (
    <Card className="mb-4">
      <Card.Section
        className="pb-0 mb-4"
        actions={(
          <ActionRow>
            <Button
              as="a"
              href={`${ADMIN_PORTAL_BASE_URL}/${slug}/admin/subscriptions/manage-learners/${subscription.uuid}`}
              target="_blank"
              rel="noopener noreferrer"
              variant="inverse-primary"
            >View plan
            </Button>
            <Button
              as="a"
              href={`${LICENSE_MANAGER_DJANGO_URL}/admin/subscriptions/subscriptionplan/${subscription.uuid}/change`}
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
          <h6 className="mb-0">SUBSCRIPTION PLAN</h6>
        </Stack>
        <h3 className="mt-0 mb-0">{startDate} - {endDate}</h3>
        <p className="x-small text-gray-400">Created {createdDate}</p>
      </Card.Section>
    </Card>
  );
};

SubscriptionPlanCard.propTypes = {
  isActive: PropTypes.bool.isRequired,
  subscription: PropTypes.shape({
    uuid: PropTypes.string.isRequired,
    startDate: PropTypes.string.isRequired,
    expirationDate: PropTypes.string.isRequired,
    created: PropTypes.string.isRequired,
  }).isRequired,
  slug: PropTypes.string.isRequired,
};

export default SubscriptionPlanCard;
