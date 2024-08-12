import { Container } from '@openedx/paragon';
import { getConfig } from '@edx/frontend-platform';
import PropTypes from 'prop-types';

import CustomerViewCard from './CustomerViewCard';
import { formatDate } from '../data/utils';
import DJANGO_ADMIN_BASE_URL from '../data/constants';

const CustomerIntegrations = ({
  slug, activeIntegrations, activeSSO, apiCredentialsEnabled,
}) => {
  const { ADMIN_PORTAL_BASE_URL } = getConfig();
  const ssoDateText = ({ sso }) => (`Created ${formatDate(sso?.created)} • Last modified ${formatDate(sso?.modifed)}`);
  const configDateText = ({ config }) => (`Last modified ${formatDate(config?.lastModifiedAt)}`);

  return (
    <Container className="mt-3 pr-6 mb-5">
      <div>
        <h2 className="pt-4">Associated Integrations</h2>
        {activeSSO && activeSSO.map((sso) => (
          <CustomerViewCard
            slug={slug}
            header="SSO"
            title={sso.displayName}
            subtext={ssoDateText(sso)}
            buttonText="Open in Admin Portal"
            buttonLink={`${ADMIN_PORTAL_BASE_URL}/${slug}/admin/settings/sso`}
          />
        ))}
        {activeIntegrations && activeIntegrations.map((config) => (
          <CustomerViewCard
            slug={slug}
            header="Learner platform"
            title={config.channelCode[0].toUpperCase() + config.channelCode.substr(1).toLowerCase()}
            subtext={configDateText(config)}
            buttonText="Open in Admin Portal"
            buttonLink={`${ADMIN_PORTAL_BASE_URL}/${slug}/admin/settings/lms`}
          />
        ))}
        {apiCredentialsEnabled && (
        <CustomerViewCard
          slug={slug}
          header="Integration"
          title="API"
          buttonText="Open in Django"
          buttonLink={`${DJANGO_ADMIN_BASE_URL}/admin/enterprise/enterprisecustomerinvitekey/`}
        />
        )}
      </div>
    </Container>
  );
};

CustomerIntegrations.defaultProps = {
  slug: null,
  activeIntegrations: null,
  activeSSO: null,
  apiCredentialsEnabled: false,
};

CustomerIntegrations.propTypes = {
  slug: PropTypes.string,
  activeIntegrations: PropTypes.arrayOf(
    PropTypes.shape({
      channelCode: PropTypes.string,
      lastModifiedAt: PropTypes.string,
    }),
  ),
  activeSSO: PropTypes.arrayOf(
    PropTypes.shape({
      created: PropTypes.string,
      modified: PropTypes.string,
      displayName: PropTypes.string,
    }),
  ),
  apiCredentialsEnabled: PropTypes.bool,
};

export default CustomerIntegrations;
