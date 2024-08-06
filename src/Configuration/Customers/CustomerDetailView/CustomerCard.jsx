import { ActionRow, Button, Card, Hyperlink } from '@openedx/paragon';
import { Launch } from '@openedx/paragon/icons';
import { getConfig } from '@edx/frontend-platform';
import { formatDate } from '../data/utils';

const CustomerCard = ({ enterpriseCustomer }) => {
  const { ADMIN_PORTAL_BASE_URL } = getConfig();

  return (
    <Card variant="dark mb-0">
      <Card.Section
        actions={
          <ActionRow>
            <Button>View Details</Button>
            <Button variant="inverse-primary" iconAfter={Launch}>Open in Django</Button>
          </ActionRow>
        }
      >
        <p className="small font-weight-bold mb-0 mt-4">
          CUSTOMER RECORD
        </p>
        <p className="lead font-weight-bold mb-0">
          {enterpriseCustomer.name}
        </p>
        <Hyperlink
          destination={`${ADMIN_PORTAL_BASE_URL}/${enterpriseCustomer.slug}/admin/learners`}
          variant="muted"
          target="_blank"
          showLaunchIcon
          className="small mb-1"
        >
          /{enterpriseCustomer.slug}/
        </Hyperlink>
        <p className="small mb-1">
          {enterpriseCustomer.uuid}
        </p>
        <p className="small mb-1">
          Created {enterpriseCustomer.created} • Last modified {formatDate(enterpriseCustomer.modified)}
        </p>
      </Card.Section>
    </Card>
  )
};

export default CustomerCard;