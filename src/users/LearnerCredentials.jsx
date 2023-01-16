/* eslint-disable react/jsx-no-useless-fragment */
import PropTypes from 'prop-types';
import {
  Hyperlink, TransitionReplace, Button, Alert,
} from '@edx/paragon';
import React, { useEffect, useState } from 'react';
import Table from '../components/Table';
import { getUserProgramCredentials } from './data/api';

export default function LearnerCredentials({ username }) {
  const [credentials, setCredentials] = useState(null);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  // eslint-disable-next-line react/no-unstable-nested-components
  const Attributes = ({ attributes }) => (
    <>
      <TransitionReplace>
        {isOpen ? (
          <>
            <Button
              variant="link"
              size="inline"
              onClick={() => setIsOpen(false)}
            >
              Hide
            </Button>
            <Table
              columns={[
                {
                  Header: 'Name',
                  accessor: 'name',
                },
                {
                  Header: 'Value',
                  accessor: 'value',
                },
              ]}
              data={attributes.map((attribute) => ({
                name: attribute.name,
                value: attribute.value,
              }))}
              styleName="custom-table"
            />
          </>
        ) : (
          <Button variant="link" size="inline" onClick={() => setIsOpen(true)}>
            Show
          </Button>
        )}
      </TransitionReplace>
    </>
  );

  Attributes.propTypes = {
    attributes: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired,
      }),
    ).isRequired,
  };

  useEffect(() => {
    if (username) {
      getUserProgramCredentials(username).then((response) => {
        if (response.count > 0) {
          setCredentials(response.results);
        } else if (response.errors) {
          setError(response.errors[0]);
        }
      });
    }
  }, [username]);

  return (
    <>
      <section className="mb-3">
        <h3>Learner Credentials</h3>
        {credentials ? (
          <Table
            columns={[
              {
                Header: 'Credential Type',
                accessor: 'credentialType',
              },
              {
                Header: 'Program ID',
                accessor: 'programID',
              },
              {
                Header: 'Status',
                accessor: 'status',
              },
              {
                Header: 'Certificate Link',
                accessor: 'certificateUrl',
              },
              {
                Header: 'Attributes',
                accessor: 'attributes',
              },
            ]}
            data={credentials.map((credential) => ({
              credentialType: credential.credential.type,
              programID: credential.credential.program_uuid,
              status: credential.status,
              certificateUrl: (
                <Hyperlink destination={credential.certificate_url}>
                  {credential.uuid}
                </Hyperlink>
              ),
              attributes: <Attributes attributes={credential.attributes} />,
            }))}
            styleName="custom-table"
          />
        ) : (
          <>
            {error ? (
              <>
                <Alert variant="danger">{error.text}</Alert>
              </>
            ) : (
              <p className="ml-4">No Credentials were Found.</p>
            )}
          </>
        )}
      </section>
    </>
  );
}

LearnerCredentials.propTypes = {
  username: PropTypes.string.isRequired,
};
