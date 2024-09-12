import PropTypes from 'prop-types';
import {
  ActionRow, Badge, Button, Icon, ModalDialog,
} from '@openedx/paragon';
import { Check, Close, Launch } from '@openedx/paragon/icons';
import { getConfig } from '@edx/frontend-platform';

const CustomerDetailModal = ({ customer, isOpen, close }) => {
  const { DJANGO_ADMIN_LMS_BASE_URL } = getConfig();
  const DATA_SHARING_CONSENT = {
    at_enrollment: 'At enrollment',
    externally_managed: 'Externally managed',
  };
  return (
    <ModalDialog
      title="Enterprise customer details"
      isOpen={isOpen}
      onClose={close}
      size="lg"
      hasCloseButton
      isFullscreenOnMobile
    >
      <ModalDialog.Header>
        <h1>
          {customer.name}
        </h1>
      </ModalDialog.Header>

      <ModalDialog.Body>
        <Badge variant="light" style={{ width: 'fit-content' }}>View only</Badge>
        <h3 className="mb-3">Enterprise info</h3>
        <h4 className="mb-0">Name</h4>
        <p>{customer.name || '--'}</p>
        <p className="d-flex">
          <Icon
            className="mr-3"
            src={customer.active ? Check : Close}
          />
          Active Admin Portal
        </p>
        <h4 className="mb-0">Slug</h4>
        <p>/{customer.slug || '--'}/</p>
        <h4 className="mb-0">Auth org id</h4>
        <p>{customer.authOrgId || '--'}</p>
        <h4 className="mb-0">Country</h4>
        <p>{customer.country || '--'}</p>
        <h3 className="mt-4 mb-3">Data sharing consent</h3>
        <p className="d-flex">
          <Icon
            className="mr-3"
            src={customer.enableDataSharingConsent ? Check : Close}
          />
          Activate data sharing consent prompt
        </p>
        <h4 className="mb-0">Data sharing consent enforcement</h4>
        <p>{DATA_SHARING_CONSENT[customer.enforceDataSharingConsent]}</p>
        <h3 className="mt-4 mb-3">Email and language</h3>
        <h4 className="mb-0">Customer admin contact email</h4>
        <p>{customer.contactEmail || '--'}</p>
        <h4 className="mb-0">Customer reply-to email</h4>
        <p>{customer.replyTo || '--'}</p>
        <h4 className="mb-0">Automated email sender alias</h4>
        <p>{customer.senderAlias || '--'}</p>
        <h4 className="mb-0">Learner default language</h4>
        <p>{customer.defaultLanguage || '--'}</p>
        <p className="d-flex">
          <Icon
            className="mr-3"
            src={customer.hideLaborMarketData ? Check : Close}
          />
          Hide labor market data
        </p>
        <h3 className="mt-4 mb-3">Integration and learner platform settings</h3>
        <p className="d-flex">
          <Icon
            className="mr-3"
            src={customer.enablePortalReportingConfigScreen ? Check : Close}
          />
          Display learning platform configuration screen
        </p>
        <p className="d-flex">
          <Icon
            className="mr-3"
            src={customer.enablePortalSamlConfigurationScreen ? Check : Close}
          />
          Display SSO configuration screen
        </p>
        <p className="d-flex">
          <Icon
            className="mr-3"
            src={customer.enableSlugLogin ? Check : Close}
          />
          Allow slug login for SSO
        </p>
        <p className="d-flex">
          <Icon
            className="mr-3"
            src={customer.replaceSensitiveSsoUsername ? Check : Close}
          />
          Replace sensitive SSO username
        </p>
        <p className="d-flex">
          <Icon
            className="mr-3"
            src={customer.hideCourseOriginalPrice ? Check : Close}
          />
          Hide course price on learning platform
        </p>
        <p className="d-flex">
          <Icon
            className="mr-3"
            src={customer.enableGenerationOfApiCredentials ? Check : Close}
          />
          Allow generation of API credentials
        </p>
      </ModalDialog.Body>

      <ModalDialog.Footer>
        <ActionRow>
          <ModalDialog.CloseButton variant="tertiary" onClick={close}>
            Close
          </ModalDialog.CloseButton>
          <Button
            as="a"
            href={`${DJANGO_ADMIN_LMS_BASE_URL}/admin/enterprise/enterprisecustomer/${customer.uuid}/change`}
            target="_blank"
            rel="noopener noreferrer"
            iconAfter={Launch}
          >
            Open in Django
          </Button>
        </ActionRow>
      </ModalDialog.Footer>
    </ModalDialog>
  );
};

CustomerDetailModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  customer: PropTypes.shape({
    active: PropTypes.bool,
    authOrgId: PropTypes.string,
    contactEmail: PropTypes.string,
    country: PropTypes.string,
    defaultLanguage: PropTypes.string,
    enableDataSharingConsent: PropTypes.bool,
    enableGenerationOfApiCredentials: PropTypes.bool,
    enablePortalReportingConfigScreen: PropTypes.bool,
    enablePortalSamlConfigurationScreen: PropTypes.bool,
    enableSlugLogin: PropTypes.bool,
    enforceDataSharingConsent: PropTypes.string,
    hideCourseOriginalPrice: PropTypes.bool,
    hideLaborMarketData: PropTypes.bool,
    modified: PropTypes.string,
    name: PropTypes.string,
    replaceSensitiveSsoUsername: PropTypes.bool,
    replyTo: PropTypes.string,
    senderAlias: PropTypes.string,
    slug: PropTypes.string,
    uuid: PropTypes.string,
  }).isRequired,
};

export default CustomerDetailModal;
