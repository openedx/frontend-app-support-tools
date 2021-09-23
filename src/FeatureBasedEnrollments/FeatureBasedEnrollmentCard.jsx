import React from 'react';
import PropTypes from 'prop-types';
import {
  Card, Badge,
} from '@edx/paragon';
import { formatDate } from '../utils';

export default function FeatureBasedEnrollmentCard({ title, fbeData }) {
  return (
    <Card className="px-3 mb-1">
      <Card.Body className="p-0">
        <Card.Title as="h3" className="btn-header mt-4">
          {title} { fbeData.enabled ? <Badge variant="success">Enabled</Badge> : <Badge variant="danger">Disabled</Badge> }
        </Card.Title>

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
      </Card.Body>
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
