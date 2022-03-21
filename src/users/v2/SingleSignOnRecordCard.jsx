import React from 'react';
import PropTypes from 'prop-types';
import {
  Card, Row, Col,
} from '@edx/paragon';
import TableV2 from '../../components/Table';
import { formatDate, formatUnixTimestamp } from '../../utils';
import CopyShowHyperlinks from './CopyShowHyperLinks';

export default function SingleSignOnRecordCard({ ssoRecord }) {
  let data;
  let columns;

  if (ssoRecord != null) {
    data = { ...ssoRecord.extraData };
    columns = React.useMemo(
      () => Object.keys(data)
        .sort((a, b) => a > b)
        .map((key) => ({
          Header: key,
          accessor: key,
        })),
    );

    Object.keys(data).forEach((key) => {
      const value = data[key] ? data[key].toString() : '';

      if (key === 'authTime') {
        data[key] = formatUnixTimestamp(data[key]);
      } else if (key === 'expires') {
        data[key] = data[key] ? `${data[key].toString()}s` : 'N/A';
      } else if (value.length > 14) {
        data[key] = <CopyShowHyperlinks text={value} />;
      }
    });
    data = React.useMemo(
      () => data,
    );
  }

  return (
    ssoRecord ? (
      <Card className="pt-2 px-3 mb-1 w-100">
        <Card.Body className="p-0">
          <Card.Header as="h3" className="btn-header mt-4" title={`${ssoRecord.provider} <span className="h5 text-muted">(Provider)</span>`} />
          <Row>
            <Col>
              <Card.Header align="left" as="h4" subTitle={`${ssoRecord.uid} <span className="h6 text-muted">(UID)</span>`} />
            </Col>
            <Col>
              <Card.Header align="right" as="h4" subTitle={`${formatDate(ssoRecord.modified)} <span className="h5 text-muted"> (Last Modified)</span>`} />
            </Col>
          </Row>

          <Card.Header as="h5" className="btn-header mt-4" title="Additional Data" />

          <TableV2
            styleName="sso-table"
            id="sso-data-new"
            data={[data]}
            columns={columns}
          />
        </Card.Body>
      </Card>
    ) : (
      <></>
    )
  );
}

SingleSignOnRecordCard.propTypes = {
  ssoRecord: PropTypes.shape({
    provider: PropTypes.string,
    uid: PropTypes.string,
    modified: PropTypes.string,
    extraData: PropTypes.object,
  }).isRequired,
};
