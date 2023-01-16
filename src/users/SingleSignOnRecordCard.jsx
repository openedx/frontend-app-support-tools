/* eslint-disable react-hooks/rules-of-hooks */

import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  Card, Row, Col, Button, ModalDialog, ActionRow,
} from '@edx/paragon';
import Table from '../components/Table';
import { formatDate, formatUnixTimestamp } from '../utils';
import CopyShowHyperlinks from './CopyShowHyperLinks';

export default function SingleSignOnRecordCard({ ssoRecord }) {
  let data;
  let columns;
  const [showHistory, setShowHistory] = useState(false);

  if (ssoRecord != null) {
    data = { ...ssoRecord.extraData };
    columns = React.useMemo(() => Object.keys(data)
      .sort((a, b) => a > b)
      .map((key) => ({
        Header: key,
        accessor: key,
      })));

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
    data = React.useMemo(() => data);
  }

  const historyHeaders = ['created', 'extraData', 'historyDate', 'modified', 'provider', 'uid'];

  const historyColumns = React.useMemo(
    () => historyHeaders.map((key) => ({
      Header: key,
      accessor: key,
    })),
    [],
  );

  const ssoHistoryTableData = useMemo(() => {
    if (ssoRecord == null || ssoRecord.history == null) {
      return [];
    }
    return ssoRecord.history.map((history) => ({
      created: formatDate(history.created),
      extraData: history.extraData,
      historyDate: formatDate(history.historyDate),
      modified: formatDate(history.modified),
      provider: history.provider,
      uid: history.uid,
    }));
  }, [ssoRecord]);

  return ssoRecord ? (
    <span>
      <ModalDialog
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
        hasCloseButton
        dialogClassName="modal-xl modal-dialog-centered"
      >
        <ModalDialog.Header className="mb-3">
          <ModalDialog.Title className="modal-title">
            SSO History
          </ModalDialog.Title>
        </ModalDialog.Header>
        <ModalDialog.Body>
          <Table
            styleName="sso-table"
            id="sso-history-data-new"
            data={ssoHistoryTableData}
            columns={historyColumns}
          />
        </ModalDialog.Body>
        <ModalDialog.Footer>
          <ActionRow>
            <ModalDialog.CloseButton
              variant="link"
            >
              Close
            </ModalDialog.CloseButton>
          </ActionRow>
        </ModalDialog.Footer>
      </ModalDialog>
      <Card className="pt-2 px-3 mb-1 w-100">
        <Card.Header
          title={(
            <span className="h3 card-title">
              {ssoRecord.provider} <span span className="h5 text-muted">(Provider)</span>
            </span>
          )}
        />
        <Card.Section>
          <Row>
            <Col className="text-left" as="h4">
              {ssoRecord.uid} <span className="h6 text-muted">(UID)</span>
            </Col>
            <Col className="text-right" as="h4">
              {formatDate(ssoRecord.modified)}{' '}
              <span className="h5 text-muted">(Last Modified)</span>
            </Col>
          </Row>
          <Row>
            <div className="history">
              <Button
                className="history-button"
                onClick={() => setShowHistory(true)}
                variant="link"
              >
                History
              </Button>
            </div>
          </Row>

        </Card.Section>
        <Card.Header title={(
          <p
            className="h5 card-title"
          >
            Additional Data
          </p>
       )}
        />
        <Card.Section>
          <Table
            styleName="sso-table"
            id="sso-data-new"
            data={[data]}
            columns={columns}
          />
        </Card.Section>
      </Card>

    </span>
  ) : (
    <></> // eslint-disable-line react/jsx-no-useless-fragment
  );
}

SingleSignOnRecordCard.propTypes = {
  ssoRecord: PropTypes.shape({
    provider: PropTypes.string,
    uid: PropTypes.string,
    modified: PropTypes.string,
    extraData: PropTypes.shape({}),
    history: PropTypes.arrayOf(PropTypes.shape({
      created: PropTypes.string,
      extraData: PropTypes.shape({}),
      historyDate: PropTypes.string,
      modified: PropTypes.string,
      provider: PropTypes.string,
      uid: PropTypes.string,
    })),
  }).isRequired,
};
