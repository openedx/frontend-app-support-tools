import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';

import { camelCaseObject } from '@edx/frontend-platform';
import { FormattedMessage } from '@edx/frontend-platform/i18n';
import { Modal, Hyperlink } from '@edx/paragon';

import PageLoading from '../../components/common/PageLoading';
import TableV2 from '../../components/Table';
import { formatDate } from '../../utils';
import { getVerifiedNameHistory } from '../data/api';

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

  // Modal to display verified name history
  const openVerifiedNameModal = (data) => {
    const tableData = data.map(result => ({
      verifiedName: result.verifiedName,
      profileName: result.profileName,
      status: result.status,
      idvAttemptId: result.verificationAttemptId,
      proctoringAttemptId: result.proctoringAttemptId,
      createdAt: formatDate(result.created),
    }));
    setVerifiedNameHistoryData(tableData);
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
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Verified Name History"
        id="verified-name-history"
        dialogClassName="modal-xl modal-dialog-centered justify-content-center"
        body={(
          <TableV2
            data={verifiedNameHistoryData}
            columns={verifiedNameHistoryColumns}
            styleName="idv-table"
          />
        )}
        data-testid="history-modal"
      />
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
            <TableV2
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
