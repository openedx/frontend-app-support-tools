import React, { useState, useEffect, useContext } from 'react';
import { camelCaseObject } from '@edx/frontend-platform';
import PropTypes from 'prop-types';
import { Modal, Button } from '@edx/paragon';
import Table from '../Table';
import UserMessagesContext from '../userMessages/UserMessagesContext';
import { getSsoRecords } from './data/api';
import { formatDate } from '../utils';
import PageLoading from '../components/common/PageLoading';
import AlertList from '../userMessages/AlertList';

export default function SingleSignOnRecords({
  username,
}) {
  const [extraSsoDataTitle, setSsoExtraDataTitle] = useState('');
  const [ssoExtraData, setSsoExtraData] = useState([]);
  const [isSsoModalOpen, setIsSsoModalOpen] = useState(false);
  const [ssoRecords, setSsoRecords] = useState(null);
  const { add, clear } = useContext(UserMessagesContext);
  useEffect(() => {
    getSsoRecords(username).then((result) => {
      const camelCaseResult = camelCaseObject(result);
      if (camelCaseResult.errors) {
        clear('ssoRecords');
        camelCaseResult.errors.forEach(error => add(error));
        setSsoRecords({});
      } else {
        setSsoRecords(camelCaseResult);
      }
    });
  }, [username]);

  // Modal to display extra data for SSO records
  const openSSOModal = (title, data) => {
    const tableData = Object.entries(data).map(([key, value]) => ({
      dataName: key,
      dataValue: value,
    }));
    setSsoExtraData(tableData);
    setSsoExtraDataTitle(title);
    setIsSsoModalOpen(true);
  };

  const ssoColumns = [
    {
      label: 'Provider',
      key: 'provider',
    },
    {
      label: 'UID',
      key: 'uid',
    },
    {
      label: 'Modified',
      key: 'modified',
    },
    {
      label: 'Extra Data',
      key: 'extra',
    },
  ];

  const columns = [
    {
      label: 'Name',
      key: 'dataName',
    },
    {
      label: 'Value',
      key: 'dataValue',
    },
  ];

  let ssoData = [];
  if (ssoRecords !== null && Object.keys(ssoRecords).length !== 0) {
    ssoData = ssoRecords.map(result => ({
      provider: result.provider,
      uid: result.uid,
      modified: formatDate(result.modified),
      extra: {
        displayValue: Object.keys(result.extraData).length > 0 ? (
          <Button
            variant="link"
            className="px-0 neg-margin-top"
            onClick={() => openSSOModal(result.provider, result.extraData)}
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
        open={isSsoModalOpen}
        onClose={() => setIsSsoModalOpen(false)}
        title={extraSsoDataTitle}
        id="sso-extra-data"
        body={(
          <Table
            data={ssoExtraData}
            columns={columns}
          />
          )}
      />
      <div className="flex-column p-4 m-3 card">
        <h4>SSO Records</h4>
        <AlertList topic="ssoRecords" className="mb-3" />
        {ssoRecords ? (
          <Table
            id="sso-data"
            data={ssoData}
            columns={ssoColumns}
          />
        ) : <PageLoading srMessage="Loading" />}
      </div>
    </div>
  );
}

SingleSignOnRecords.propTypes = {
  username: PropTypes.string.isRequired,
};
