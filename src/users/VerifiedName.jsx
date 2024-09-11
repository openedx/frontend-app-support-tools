import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';

import { camelCaseObject } from '@edx/frontend-platform';
import { FormattedMessage } from '@edx/frontend-platform/i18n';
import {
  Button, Hyperlink, OverlayTrigger, Popover, ModalDialog, ActionRow,
} from '@openedx/paragon';

import PageLoading from '../components/common/PageLoading';
import Table from '../components/Table';
import { formatDate } from '../utils';
import { getVerifiedNameHistory } from './data/api';

const verifiedNameColumns = [
  {
    Header: 'Verified Name',
    accessor: 'verifiedName',
  },
  {
    Header: 'Status',
    accessor: 'status',
  },
  {
    Header: 'Verification Type',
    accessor: 'verificationType',
  },
  {
    Header: 'History',
    accessor: 'history',
  },
];

const verifiedNameHistoryColumns = [
  {
    Header: 'Verified Name',
    accessor: 'verifiedName',
  },
  {
    Header: 'Profile Name',
    accessor: 'profileName',
  },
  {
    Header: 'Status',
    accessor: 'status',
  },
  {
    Header: 'IDV Attempt ID',
    accessor: 'idvAttemptId',
  },
  {
    Header: 'Proctoring Attempt ID',
    accessor: 'proctoringAttemptId',
  },
  {
    Header: 'Created At',
    accessor: 'createdAt',
  },
];

// Human readable formatter for the status. Possible status list on:
// https://github.com/edx/edx-solutions-edx-platform/blob/0ebc69f86548a44b7947decfe308032028721907/lms/djangoapps/verify_student/models.py#L104
const idvStatusFormat = status => {
  // Capitalize first letter
  const properStatus = `${status.at(0).toUpperCase()}${status?.slice(1)}`;

  // Replace underscores with spaces
  return properStatus.replace('_', ' ');
};

export default function VerifiedName({ username }) {
  const [verifiedNameData, setVerifiedNameData] = useState(null);
  const [verifiedNameHistoryData, setVerifiedNameHistoryData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      await getVerifiedNameHistory(username).then((data) => {
        if (isMounted) {
          const camelCaseData = camelCaseObject(data);
          setVerifiedNameData(camelCaseData);
        }
      });
    };
    fetchData();
    return () => {
      isMounted = false;
    };
  }, [username]);

  const VerifiedNameHistoryTableData = useMemo(() => verifiedNameHistoryData.map(
    result => ({
      verifiedName: result.verifiedName,
      profileName: result.profileName,
      status: result.status,
      idvAttemptId: result.verificationAttemptId ? (
        <OverlayTrigger
          placement="right"
          trigger="hover"
          overlay={(
            <Popover id={`${result.verificationAttemptId}-details-tooltip`} aria-hidden="true">
              <Popover.Title data-testid="verificationAttemptTooltipTitle">
                {result.verificationAttemptStatus ? idvStatusFormat(result.verificationAttemptStatus) : 'Missing data'}
              </Popover.Title>
            </Popover>
          )}
        >
          <Button variant="link" size="inline">
            {result.verificationAttemptId}
          </Button>
        </OverlayTrigger>
      ) : '',
      proctoringAttemptId: result.proctoredExamAttemptId,
      createdAt: formatDate(result.created),
    }),
  ), [verifiedNameHistoryData]);

  // Modal to display verified name history
  const openVerifiedNameModal = async (data) => {
    setVerifiedNameHistoryData(data);
    setIsModalOpen(true);
  };

  const verifiedNameParsedData = useMemo(() => [{
    verifiedName: (
      verifiedNameData?.verifiedName || verifiedNameData?.error || 'Error while fetching data'
    ),
    status: verifiedNameData?.status || 'N/A',
    verificationType: verifiedNameData?.verificationType || 'N/A',
    history: verifiedNameData?.history?.length > 0 ? (
      <Hyperlink
        destination="#"
        onClick={e => {
          e.preventDefault();
          openVerifiedNameModal(verifiedNameData.history);
        }}
      >
        Show
      </Hyperlink>
    ) : 'N/A',
  }], [verifiedNameData]);
  return (
    <div>
      <ModalDialog
        isOpen={isModalOpen}
        size="lg"
        onClose={() => { setIsModalOpen(false); }}
        hasCloseButton
        id="verified-name-history"
        data-testid="history-modal"

      >
        <ModalDialog.Header className="mb-3">
          <ModalDialog.Title className="modal-title">
            Verified Name History
          </ModalDialog.Title>
        </ModalDialog.Header>
        <ModalDialog.Body>
          <Table
            data={VerifiedNameHistoryTableData}
            columns={verifiedNameHistoryColumns}
            styleName="idv-table"
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
      <div className="flex-column p-4 m-3 card">
        <FormattedMessage
          id="supportTools.learnerInformation.verifiedNameHeader"
          defaultMessage="Verified Name Status"
          description="Verified Name Card Title"
        >
          {text => <h3>{text}</h3>}
        </FormattedMessage>
        {/* eslint-disable-next-line no-nested-ternary */}
        {verifiedNameData ? (
          verifiedNameParsedData.length ? (
            <Table
              id="verified-name-data"
              data={verifiedNameParsedData}
              columns={verifiedNameColumns}
              styleName="idv-table"
            />
          ) : null
        ) : <PageLoading srMessage="Loading" />}
      </div>
    </div>
  );
}

VerifiedName.propTypes = {
  username: PropTypes.string.isRequired,
};
