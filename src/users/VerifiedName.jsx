import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';

import { camelCaseObject } from '@edx/frontend-platform';
import { FormattedMessage } from '@edx/frontend-platform/i18n';
import {
  Button, Hyperlink, OverlayTrigger, Popover, ModalDialog, ActionRow,
} from '@edx/paragon';

import PageLoading from '../components/common/PageLoading';
import Table from '../components/Table';
import { formatDate } from '../utils';
import { getVerifiedNameHistory, getVerificationAttemptDetailsById } from './data/api';

export default function VerifiedName({ username }) {
  const [verifiedNameData, setVerifiedNameData] = useState(null);
  const [verifiedNameHistoryData, setVerifiedNameHistoryData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [verificationAttemptDetails, setVerificationAttemptDetails] = useState({});

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
              <Popover.Title as="h5">{verificationAttemptDetails[result.verificationAttemptId].status}</Popover.Title>
              <Popover.Content data-testid="verificationAttemptTooltip">
                {verificationAttemptDetails[result.verificationAttemptId].message}
              </Popover.Content>
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
  ), [verifiedNameHistoryData, verificationAttemptDetails]);

  // Modal to display verified name history
  const openVerifiedNameModal = async (data) => {
    for (let idx = 0; idx < data.length; idx++) {
      const historyItem = data[idx];
      if (historyItem.verificationAttemptId && !(historyItem.verificationAttemptId in verificationAttemptDetails)) {
        // eslint-disable-next-line no-await-in-loop
        await getVerificationAttemptDetailsById(historyItem.verificationAttemptId).then((response) => {
          const camelCaseDetailsData = camelCaseObject(response);
          verificationAttemptDetails[historyItem.verificationAttemptId] = camelCaseDetailsData;
          setVerificationAttemptDetails(verificationAttemptDetails);
        });
      }
    }
    setVerifiedNameHistoryData(data);
    setIsModalOpen(true);
  };

  const verifiedNameColumns = useMemo(() => [
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
  ], []);

  const verifiedNameHistoryColumns = useMemo(() => [
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
  ], []);

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
          ) : <></>
        ) : <PageLoading srMessage="Loading" />}
      </div>
    </div>
  );
}

VerifiedName.propTypes = {
  username: PropTypes.string.isRequired,
};
