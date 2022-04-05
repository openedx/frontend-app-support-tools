import React from 'react';
import PropTypes from 'prop-types';
import Table from '../components/Table';
import { extractMessageTuple } from '../utils/index';

export default function LinkProgramEnrollmentsTable({
  successMessage,
  errorMessage,
}) {
  return (
    <>
      {successMessage && successMessage.length > 0 && (
        <div className="my-2 success-message">
          <h4>Successes</h4>
          <Table
            columns={[
              {
                Header: 'External User Key',
                accessor: 'external_user_key',
              },
              {
                Header: 'LMS Username',
                accessor: 'lms_username',
              },
              {
                Header: 'Message',
                accessor: 'message',
              },
            ]}
            data={successMessage.map((text) => {
              const pair = extractMessageTuple(text);
              return {
                external_user_key: pair[0],
                lms_username: pair[1],
                message: 'Linkage Successfully Created',
              };
            })}
            styleName="custom-table success-table"
          />
        </div>
      )}
      {errorMessage && errorMessage.length > 0 && (
        <div className="my-2 error-message">
          <h4>Errors</h4>
          <Table
            columns={[
              {
                Header: 'Error Messages',
                accessor: 'message',
              },
            ]}
            data={errorMessage.map((text) => ({ message: text }))}
            styleName="custom-table error-table"
          />
        </div>
      )}
    </>
  );
}

LinkProgramEnrollmentsTable.propTypes = {
  successMessage: PropTypes.arrayOf(PropTypes.string),
  errorMessage: PropTypes.arrayOf(PropTypes.string),
};

LinkProgramEnrollmentsTable.defaultProps = {
  successMessage: [],
  errorMessage: [],
};
