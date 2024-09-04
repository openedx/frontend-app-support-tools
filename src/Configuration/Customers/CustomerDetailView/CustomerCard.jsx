import PropTypes from 'prop-types';
import {
  ActionRow, Button, Card, Icon, Hyperlink, Toast, useToggle,
} from '@openedx/paragon';
import { Launch, ContentCopy } from '@openedx/paragon/icons';
import { getConfig } from '@edx/frontend-platform';
import { formatDate, useCopyToClipboard } from '../data/utils';
import DJANGO_ADMIN_BASE_URL from '../data/constants';
import CustomerDetailModal from './CustomerDetailModal';

const CustomerCard = ({ enterpriseCustomer }) => {
  const { ADMIN_PORTAL_BASE_URL } = getConfig();
  const { showToast, copyToClipboard, setShowToast } = useCopyToClipboard();
  const [isDetailsOpen, openDetails, closeDetails] = useToggle(false);

  return (
    <div>
      <CustomerDetailModal
        customer={enterpriseCustomer}
        isOpen={isDetailsOpen}
        close={closeDetails}
      />
      <Card variant="dark" className="mb-0">
        <Card.Section
          actions={(
            <ActionRow>
              <Button onClick={openDetails}>View Details</Button>
              <Button
                className="text-dark-500"
                as="a"
                href={`${DJANGO_ADMIN_BASE_URL}/admin/enterprise/enterprisecustomer/${enterpriseCustomer.uuid}/change`}
                variant="inverse-primary"
                target="_blank"
                rel="noopener noreferrer"
                iconAfter={Launch}
              >
                Open in Django
              </Button>
            </ActionRow>
          )}
        >
          <p className="small font-weight-bold mb-0 mt-2">
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
          <div
            role="presentation"
            className="pgn-doc__icons-table__preview-footer"
          >
            <p className="small mb-1">
              {enterpriseCustomer.uuid}
            </p>
            <Icon
              key="ContentCopy"
              src={ContentCopy}
              data-testid="copy"
              onClick={() => copyToClipboard(enterpriseCustomer.uuid)}
            />
          </div>
          <p className="small mb-1">
            Created {formatDate(enterpriseCustomer.created)} • Last modified {formatDate(enterpriseCustomer.modified)}
          </p>
        </Card.Section>
      </Card>
      <Toast
        onClose={() => setShowToast(false)}
        show={showToast}
        delay={2000}
      >
        Copied to clipboard
      </Toast>
    </div>

  );
};

CustomerCard.propTypes = {
  enterpriseCustomer: PropTypes.shape({
    created: PropTypes.string,
    modified: PropTypes.string,
    slug: PropTypes.string,
    name: PropTypes.string,
    uuid: PropTypes.string,
  }).isRequired,
};

export default CustomerCard;
