import React, {
  useState,
  useEffect,
} from 'react';
import PropTypes from 'prop-types';
import { camelCaseObject } from '@edx/frontend-platform';
import {
  Row, Col,
} from '@edx/paragon';
import { getLicense } from '../../data/api';
import PageLoading from '../../../components/common/PageLoading';
import LicenseCard from './LicenseCard';

export default function Licenses({
  userEmail,
}) {
  const [licenses, setLicensesData] = useState(null);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    getLicense(userEmail).then((data) => {
      const camelCaseData = camelCaseObject(data);
      setLicensesData(camelCaseData.results);
      setStatus(camelCaseData.status);
    });
  }, [userEmail]);

  return (
    <section className="mb-3">
      <h3 id="licenses-title-header" className="ml-4 mt-4">Licenses Subscription</h3>
      {/* eslint-disable-next-line no-nested-ternary */}
      {licenses ? (
        licenses.length ? (
          <Row id="licenses-records-list">
            {licenses.map(record => (
              <Col xs={12}>
                <LicenseCard licenseRecord={record} />
              </Col>
            ))}
          </Row>
        ) : (
          <p className="ml-4">{status}</p>
        )
      ) : (
        <PageLoading srMessage="Loading" />
      )}
    </section>
  );
}

Licenses.propTypes = {
  userEmail: PropTypes.string.isRequired,
};
