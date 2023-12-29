import React, {
  useEffect,
  useContext,
  useState,
} from 'react';
import { camelCaseObject } from '@edx/frontend-platform';
import { Row, Col } from '@openedx/paragon';
import PropTypes from 'prop-types';

import UserMessagesContext from '../userMessages/UserMessagesContext';
import AlertList from '../userMessages/AlertList';
import getFeatureBasedEnrollmentDetails from './data/api';
import PageLoading from '../components/common/PageLoading';
import FeatureBasedEnrollmentCard from './FeatureBasedEnrollmentCard';

export default function FeatureBasedEnrollment({ courseId, apiFetchSignal }) {
  const [fbeData, setFBEData] = useState(undefined);
  const { add, clear } = useContext(UserMessagesContext);

  useEffect(() => {
    clear('featureBasedEnrollment');
    setFBEData(undefined);
    getFeatureBasedEnrollmentDetails(courseId).then((response) => {
      const camelCaseResponse = camelCaseObject(response);
      if (camelCaseResponse.errors) {
        camelCaseResponse.errors.forEach(error => add(error));
      } else {
        setFBEData(camelCaseResponse);
      }
    });
  }, [apiFetchSignal]);

  return (
    <section className="mb-3">
      <AlertList topic="featureBasedEnrollment" className="mb-3" />
      <h3 id="fbe-title-header" className="my-4">Feature Based Enrollment Configuration</h3>

      {/* eslint-disable-next-line no-nested-ternary */}
      {fbeData
        ? (
          (Object.keys(fbeData).length > 0
            ? (
              <>
                <h4 className="my-4">Course Title: {fbeData.courseName}</h4>
                <Row>
                  <Col>
                    <FeatureBasedEnrollmentCard title="Content Type Gating" fbeData={fbeData.gatingConfig} />
                  </Col>
                  <Col>
                    <FeatureBasedEnrollmentCard title="Duration Config" fbeData={fbeData.durationConfig} />
                  </Col>
                </Row>
              </>
            )
            : (<p className="my-4">No Feature Based Enrollment Configurations were found.</p>)
          )
        )
        : (
          <PageLoading srMessage="Loading" />
        )}
    </section>
  );
}

FeatureBasedEnrollment.propTypes = {
  courseId: PropTypes.string.isRequired,
  apiFetchSignal: PropTypes.bool.isRequired,
};
