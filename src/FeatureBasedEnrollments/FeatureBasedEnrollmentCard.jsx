import React from 'react';
import PropTypes from 'prop-types';
import {
  Card, Badge,
} from '@openedx/paragon';
import { formatDate } from '../utils';

export default function FeatureBasedEnrollmentCard({ title, fbeData }) {
  return (
    <Card data-testid="feature-based-enrollment-card">
      <Card.Header
        title={(
          <span
            className="card-title"
          >
            {title} { fbeData.enabled ? <Badge variant="success">Enabled</Badge> : <Badge variant="danger">Disabled</Badge> }
          </span>
        )}
        as="h3"
      />
      <Card.Section>
        <table className="fbe-table">
          <tbody>

            <tr>
              <th>Enabled As Of</th>
              <td>{fbeData.enabledAsOf !== 'N/A' ? formatDate(fbeData.enabledAsOf) : fbeData.enabledAsOf}</td>
            </tr>

            <tr>
              <th>Reason</th>
              <td>{fbeData.reason}</td>
            </tr>

          </tbody>

        </table>
      </Card.Section>
      <Card.Footer />
    </Card>
  );
}

FeatureBasedEnrollmentCard.propTypes = {
  title: PropTypes.string.isRequired,
  fbeData: PropTypes.shape({
    enabled: PropTypes.bool.isRequired,
    reason: PropTypes.string.isRequired,
    enabledAsOf: PropTypes.string.isRequired,
  }).isRequired,
};
