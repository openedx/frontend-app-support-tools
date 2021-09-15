import React from 'react';
import PropTypes from 'prop-types';
import {
  Card, Row, Col,
} from '@edx/paragon';
import TableV2 from '../../components/Table';
import { formatDate } from '../../utils';
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
      const value = data[key].toString();
      if (value.length > 14) {
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
          <Card.Title as="h3" className="btn-header mt-4">
            {ssoRecord.provider}
          </Card.Title>
          <Row>
            <Col>
              <Card.Subtitle align="left" as="h4">
                {ssoRecord.uid}
              </Card.Subtitle>
            </Col>
            <Col>
              <Card.Subtitle align="right" as="h4">
                Last Modified: {formatDate(ssoRecord.modified)}
              </Card.Subtitle>
            </Col>
          </Row>

          <Card.Title as="h5" className="btn-header mt-4">
            Additional Data
          </Card.Title>

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
