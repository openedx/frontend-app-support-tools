import React, { useState, useEffect, useContext } from 'react';
import { camelCaseObject } from '@edx/frontend-platform';
import PropTypes from 'prop-types';
import {
  Row, Col,
} from '@edx/paragon';
import { FormattedMessage } from '@edx/frontend-platform/i18n';
import UserMessagesContext from '../../userMessages/UserMessagesContext';
import { getSsoRecords } from '../data/api';
import PageLoading from '../../components/common/PageLoading';
import AlertList from '../../userMessages/AlertList';
import SingleSignOnRecordCard from './SingleSignOnRecordCard';

export default function SingleSignOnRecords({ username }) {
  const [ssoRecords, setSsoRecords] = useState(null);
  const { add, clear } = useContext(UserMessagesContext);
  useEffect(() => {
    clear('ssoRecords');
    getSsoRecords(username).then((result) => {
      const camelCaseResult = camelCaseObject(result);
      if (camelCaseResult.errors) {
        camelCaseResult.errors.forEach((error) => add(error));
        setSsoRecords({});
      } else {
        setSsoRecords(camelCaseResult);
      }
    });
  }, [username]);

  return (
    <section className="mb-3">
      <AlertList topic="ssoRecords" className="mb-3" />
      <FormattedMessage
        id="supportTools.learnerInformation.ssoHeader"
        defaultMessage="Single Sign-on Records"
        description="Single Sign-On Listing Title"
      >
        {text => <h3 id="sso-title-header" className="ml-4">{text}</h3>}
      </FormattedMessage>
      {/* eslint-disable-next-line no-nested-ternary */}
      {ssoRecords ? (
        ssoRecords.length ? (
          <Row id="sso-records-list">
            {ssoRecords.map(record => (
              <Col xs={12}>
                <SingleSignOnRecordCard ssoRecord={record} />
              </Col>
            ))}
          </Row>
        ) : (
          <p className="ml-4">No SSO Records were Found.</p>
        ))
        : (
          <PageLoading srMessage="Loading" />
        )}
    </section>
  );
}

SingleSignOnRecords.propTypes = {
  username: PropTypes.string.isRequired,
};
