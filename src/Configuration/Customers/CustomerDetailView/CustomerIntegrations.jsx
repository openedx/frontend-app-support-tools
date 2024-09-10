import { getConfig } from '@edx/frontend-platform';
import PropTypes from 'prop-types';

import CustomerViewCard from './CustomerViewCard';
import { formatDate } from '../data/utils';

const CustomerIntegrations = ({
  slug, activeIntegrations, activeSSO, apiCredentialsEnabled,
}) => {
  const { ADMIN_PORTAL_BASE_URL } = getConfig();
  const ssoDateText = ({ sso }) => (`Created ${formatDate(sso?.created)} • Last modified ${formatDate(sso?.modifed)}`);
  const configDateText = ({ config }) => (`Created ${formatDate(config?.created)} • Last modified ${formatDate(config?.lastModifiedAt)}`);
  let integrationCount = (activeSSO ? activeSSO.length : 0) + (activeIntegrations ? activeIntegrations.length : 0);
  if (apiCredentialsEnabled) {
    integrationCount++;
  }

  return (
    <div>
      {(integrationCount > 0) && (
      <div>
        <h2>Associated integrations ({integrationCount})</h2>
        <hr />
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
            header="Learning platform"
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
        />
        )}
      </div>
      )}
    </div>
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
