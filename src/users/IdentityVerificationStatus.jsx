import React, { useState, useEffect, useContext } from 'react';
import { camelCaseObject } from '@edx/frontend-platform';
import PropTypes from 'prop-types';
import { Modal, Button } from '@edx/paragon';
import Table from '../Table';
import UserMessagesContext from '../userMessages/UserMessagesContext';
import { getUserVerificationStatus } from './data/api';
import { formatDate } from '../utils';
import PageLoading from '../components/common/PageLoading';
import AlertList from '../userMessages/AlertList';

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

  const idvDetailsColumns = [
    {
      label: 'Type',
      key: 'type',
    },
    {
      label: 'Status',
      key: 'status',
    },
    {
      label: 'Expiration Date',
      key: 'expirationDatetime',
    },
    {
      label: 'Message',
      key: 'message',
    },
    {
      label: 'Updated',
      key: 'updatedAt',
    },
  ];

  const idvColumns = [
    {
      label: 'Status',
      key: 'status',
    },
    {
      label: 'Expiration Date',
      key: 'expirationDatetime',
    },
    {
      label: 'Is Verified',
      key: 'isVerified',
    },
    {
      label: 'Details',
      key: 'extra',
    },
  ];

  let IdvData = [];
  if (verificationData !== null && Object.keys(verificationData).length !== 0) {
    IdvData = [verificationData].map(result => ({
      status: result.status,
      isVerified: result.isVerified.toString(),
      expirationDatetime: formatDate(result.expirationDatetime),
      extra: {
        displayValue: result.extraData && result.extraData.length > 0 ? (
          <Button
            variant="link"
            className="px-0 neg-margin-top"
            onClick={() => openIDVModal('ID Verification Details', result.extraData)}
          >
            Show
          </Button>
        ) : 'N/A',
        value: result.extraData,
      },
    }));
  }

  return (
    <div>

      <Modal
        open={isIdvModalOpen}
        onClose={() => setIsIdvModalOpen(false)}
        title={detailIdvDataTitle}
        id="idv-extra-data"
        body={(
          <Table
            data={detailIdvData}
            columns={idvDetailsColumns}
          />
          )}
      />
      <div className="flex-column p-4 m-3 card">
        <h4>ID Verification Status</h4>
        <AlertList topic="idvStatus" className="mb-3" />
        {verificationData
          ? (
            <Table
              id="idv-data"
              data={IdvData}
              columns={idvColumns}
            />
          )
          : <PageLoading srMessage="Loading" />}
      </div>
    </div>
  );
}

IdentityVerificationStatus.propTypes = {
  username: PropTypes.string.isRequired,
};
