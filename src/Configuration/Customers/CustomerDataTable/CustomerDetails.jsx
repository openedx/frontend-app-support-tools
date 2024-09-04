import {
  Hyperlink,
  Icon,
  Toast,
} from '@openedx/paragon';
import { getConfig } from '@edx/frontend-platform';
import { Check, ContentCopy } from '@openedx/paragon/icons';
import PropTypes from 'prop-types';
import ROUTES from '../../../data/constants/routes';
import { useCopyToClipboard } from '../data/utils';

const { HOME } = ROUTES.CONFIGURATION.SUB_DIRECTORY.CUSTOMERS;

export const CustomerDetailLink = ({ row }) => {
  const { showToast, copyToClipboard, setShowToast } = useCopyToClipboard();
  const { ADMIN_PORTAL_BASE_URL } = getConfig();

  return (
    <div>
      <div>
        <Hyperlink
          destination={`${HOME}/${row.original.uuid}/view`}
          key={row.original.uuid}
          rel="noopener noreferrer"
          variant="muted"
          target="_blank"
          showLaunchIcon={false}
          className="customer-name"
        >
          {row.original.name}
        </Hyperlink>
      </div>
      <div>
        <Hyperlink
          destination={`${ADMIN_PORTAL_BASE_URL}/${row.original.slug}/admin/learners`}
          key={row.original.uuid}
          rel="noopener noreferrer"
          variant="muted"
          target="_blank"
          showLaunchIcon
        >
          /{row.original.slug}/
        </Hyperlink>
        <div
          role="presentation"
          className="pgn-doc__icons-table__preview-footer"
        >
          <div>{row.original.uuid}</div>
          <Icon
            key="ContentCopy"
            src={ContentCopy}
            data-testid="copy"
            onClick={() => copyToClipboard(row.original.uuid)}
          />
        </div>
      </div>
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

export const LmsCheck = ({ row }) => {
  if (row.original.activeIntegrations.length) {
    return (
      <Icon src={Check} screenReaderText="Lms Check" />
    );
  }
  return null;
};

export const SSOCheck = ({ row }) => {
  if (row.original.activeSsoConfigurations.length) {
    return (
      <Icon src={Check} screenReaderText="SSO Check" />
    );
  }
  return null;
};

export const ApiCheck = ({ row }) => {
  if (row.original.enableGenerationOfApiCredentials) {
    return (
      <Icon src={Check} screenReaderText="API Check" />
    );
  }
  return null;
};

LmsCheck.propTypes = {
  row: PropTypes.shape({
    original: PropTypes.shape({
      activeIntegrations: PropTypes.arrayOf(PropTypes.shape({
        channelCode: PropTypes.string,
        created: PropTypes.string,
        modified: PropTypes.string,
        displayName: PropTypes.string,
        active: PropTypes.bool,
      })),
    }),
  }).isRequired,
};

SSOCheck.propTypes = {
  row: PropTypes.shape({
    original: PropTypes.shape({
      activeSsoConfigurations: PropTypes.arrayOf(PropTypes.shape({
        created: PropTypes.string,
        modified: PropTypes.string,
        active: PropTypes.bool,
        displayName: PropTypes.string,
      })),
    }),
  }).isRequired,
};

ApiCheck.propTypes = {
  row: PropTypes.shape({
    original: PropTypes.shape({
      enableGenerationOfApiCredentials: PropTypes.bool,
    }),
  }).isRequired,
};

CustomerDetailLink.propTypes = {
  row: PropTypes.shape({
    original: PropTypes.shape({
      name: PropTypes.string,
      uuid: PropTypes.string,
      slug: PropTypes.string,
    }),
  }).isRequired,
};
