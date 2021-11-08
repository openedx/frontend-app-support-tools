import React, {
  useState, useEffect, useContext, useMemo,
} from 'react';
import { camelCaseObject } from '@edx/frontend-platform';
import PropTypes from 'prop-types';
import { Modal, Hyperlink } from '@edx/paragon';
import { FormattedMessage } from '@edx/frontend-platform/i18n';
import TableV2 from '../../components/Table';
import UserMessagesContext from '../../userMessages/UserMessagesContext';
import { getUserVerificationStatus } from '../data/api';
import { formatDate } from '../../utils';
import PageLoading from '../../components/common/PageLoading';
import AlertList from '../../userMessages/AlertList';

export default function IdentityVerificationStatus({
  username,
}) {
  const { add, clear } = useContext(UserMessagesContext);
  const [verificationData, setVerificationData] = useState(null);
  const [detailIdvDataTitle, setDetailIdvDataTitle] = useState('');
  const [detailIdvData, setDetailIdvData] = useState([]);
  const [isIdvModalOpen, setIsIdvModalOpen] = useState(false);
  useEffect(() => {
    clear('idvStatus');
    getUserVerificationStatus(username).then((result) => {
      const camelCaseResult = camelCaseObject(result);
      if (camelCaseResult.errors) {
        camelCaseResult.errors.forEach(error => add(error));
        setVerificationData({});
      } else {
        setVerificationData(camelCaseResult);
      }
    });
  }, [username]);

  // Modal to display extra data for Idv records
  const openIDVModal = (title, data) => {
    const tableData = data.map(result => ({
      type: result.type,
      status: result.status,
      updatedAt: formatDate(result.updatedAt),
      expirationDatetime: formatDate(result.expirationDatetime),
      message: result.message,
    }));
    setDetailIdvData(tableData);
    setDetailIdvDataTitle(title);
    setIsIdvModalOpen(true);
  };

  const idvDetailsColumns = useMemo(() => [
    {
      Header: 'Type',
      accessor: 'type',
    },
    {
      Header: 'Status',
      accessor: 'status',
    },
    {
      Header: 'Expiration Date',
      accessor: 'expirationDatetime',
    },
    {
      Header: 'Message',
      accessor: 'message',
    },
    {
      Header: 'Updated',
      accessor: 'updatedAt',
    },
  ], []);

  const idvColumns = useMemo(() => [
    {
      Header: 'Status',
      accessor: 'status',
    },
    {
      Header: 'Expiration Date',
      accessor: 'expirationDatetime',
    },
    {
      Header: 'Is Verified',
      accessor: 'isVerified',
    },
    {
      Header: 'Details',
      accessor: 'extra',
    },
  ], []);

  const IdvData = useMemo(() => {
    if (verificationData === null || Object.keys(verificationData).length === 0) {
      return [];
    }
    return [verificationData].map(result => ({
      status: result.status,
      isVerified: result.isVerified.toString(),
      expirationDatetime: formatDate(result.expirationDatetime),
      extra: result.extraData && result.extraData.length > 0 ? (
        <Hyperlink
          destination="#"
          target="_blank"
          onClick={e => {
            e.preventDefault();
            openIDVModal('ID Verification Details', result.extraData);
          }}
        >
          Show
        </Hyperlink>
      ) : 'N/A',
    }));
  }, [verificationData]);

  return (
    <div>

      <Modal
        open={isIdvModalOpen}
        onClose={() => setIsIdvModalOpen(false)}
        title={detailIdvDataTitle}
        id="idv-extra-data"
        dialogClassName="modal-lg modal-dialog-centered justify-content-center"
        body={(
          <TableV2
            data={detailIdvData}
            columns={idvDetailsColumns}
            styleName="idv-table"
          />
          )}
      />
      <div className="flex-column p-4 m-3 card">
        <FormattedMessage
          id="supportTools.learnerInformation.idvHeader"
          defaultMessage="Identity Verification Status"
          description="Identity Verification Card Title"
        >
          {text => <h3>{text}</h3>}
        </FormattedMessage>
        <AlertList topic="idvStatus" className="mb-3" />
        {/* eslint-disable-next-line no-nested-ternary */}
        {verificationData ? (
          IdvData.length ? (
            <TableV2
              id="idv-data"
              data={IdvData}
              columns={idvColumns}
              styleName="idv-table"
            />
          ) : <></>
        ) : <PageLoading srMessage="Loading" />}
      </div>
    </div>
  );
}

IdentityVerificationStatus.propTypes = {
  username: PropTypes.string.isRequired,
};
