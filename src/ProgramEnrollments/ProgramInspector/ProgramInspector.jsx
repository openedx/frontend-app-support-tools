import React, { useEffect, useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Alert, Col, Row, Button, Form,
} from '@openedx/paragon';
import { getSsoRecords } from '../../users/data/api';
import EnrollmentDetails from './EnrollmentDetails';
import SingleSignOnRecordCard from '../../users/SingleSignOnRecordCard';
import {
  getProgramEnrollmentsInspector,
  getSAMLProviderList,
} from './data/api';
import VerifiedName from '../../users/VerifiedName';
import { extractParams } from '../../utils';

export default function ProgramInspector() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = extractParams(location.search);
  const [ssoRecords, setSsoRecords] = useState([]);
  const [error, setError] = useState(undefined);
  const [learnerProgramEnrollment, setLearnerProgramEnrollment] = useState(undefined);
  const [username, setUsername] = useState(params.get('edx_user'));
  const [activeOrgKey, setActiveOrgKey] = useState(params.get('org_key'));
  const [orgKeyList, setOrgKeyList] = useState(undefined);
  const [externalUserKey, setExternalUserKey] = useState(params.get('external_user_key'));
  const [clickEventCall, setClickEventCall] = useState(false);

  const getOrgKeyList = () => (orgKeyList
    ? orgKeyList.map((data) => ({
      value: data,
      label: data,
    }))
    : orgKeyList);

  const handleSubmit = () => {
    if (!username && !externalUserKey) {
      setUsername(undefined);
      setExternalUserKey(undefined);
      setLearnerProgramEnrollment(undefined);
      setSsoRecords([]);
      navigate('/programs');
    } else {
      const newLink = `/programs?edx_user=${
        username || ''
      }&org_key=${activeOrgKey}&external_user_key=${externalUserKey || ''}`;
      if (newLink === location.pathname + location.search) {
        setClickEventCall(!clickEventCall);
      } else {
        navigate(newLink);
      }
    }
  };

  const submit = useCallback((event) => {
    event.preventDefault();
    handleSubmit();
    return false;
  });

  const fetchInspectorData = (param) => {
    if (param) {
      getProgramEnrollmentsInspector({
        params: param,
      }).then((response) => {
        setError(response.error);
        setActiveOrgKey(response.org_keys);
        setLearnerProgramEnrollment(response.learner_program_enrollments);
      });
    }
  };

  useEffect(() => {
    fetchInspectorData(location.search);
  }, [location.search, clickEventCall]);

  useEffect(() => {
    if (!orgKeyList) {
      getSAMLProviderList().then((response) => {
        setOrgKeyList(response);
        if (response && response.length) {
          setActiveOrgKey(response[0]);
        }
      });
    }
  }, []);

  useEffect(() => {
    setSsoRecords([]);
    if (
      learnerProgramEnrollment
      && learnerProgramEnrollment.user
      && learnerProgramEnrollment.user.sso_list
    ) {
      getSsoRecords(learnerProgramEnrollment.user.username).then((response) => {
        response.map((data) => {
          if (
            learnerProgramEnrollment.user.sso_list.length
            && learnerProgramEnrollment.user.sso_list.some(
              (sso) => sso.uid === data.uid,
            )) {
            setSsoRecords((arr) => [...arr, data]);
          }
          return data;
        });
      });
    }
  }, [learnerProgramEnrollment]);

  return (
    <>
      {error && !Array.isArray(error) && (
        <Alert variant="danger">{error}</Alert>
      )}
      <h3>Program Enrollments Inspector</h3>
      <section className="my-3">
        <form>
          <div className="d-flex">
            <div className="col-sm-4 pl-0">
              <Form.Group>
                <Form.Label htmlFor="username">edX username or email</Form.Label>
                <Form.Control
                  name="username"
                  defaultValue={username}
                  onChange={(e) => (e.target.value
                    ? setUsername(e.target.value)
                    : setUsername(undefined))}
                  placeholder="edx@example.com"
                />
              </Form.Group>
            </div>
            <div className="col-sm-4">
              <Form.Group>
                <Form.Label htmlFor="orgKey">Identity-providing institution</Form.Label>
                <Form.Control
                  name="orgKey"
                  as="select"
                  defaultValue={activeOrgKey}
                  onChange={(e) => setActiveOrgKey(e.target.value)}
                >
                  { getOrgKeyList() && getOrgKeyList().map(
                    (
                      { label, value, disabled },
                    ) => <option key={value} value={value} disabled={disabled}>{label}</option>,
                  )}
                </Form.Control>
              </Form.Group>
            </div>
            <div className="col-sm-4 pr-0">
              <Form.Group>
                <Form.Label htmlFor="externalKey">Institution user key</Form.Label>
                <Form.Control
                  name="externalKey"
                  defaultValue={externalUserKey}
                  onChange={(e) => (e.target.value
                    ? setExternalUserKey(e.target.value)
                    : setExternalUserKey(undefined))}
                  placeholder="ex. GTPersonDirectoryID for GT Students"
                />
              </Form.Group>
            </div>
          </div>
          <Button type="submit" className="mt-4" onClick={submit}>
            Search Program Records
          </Button>
        </form>
      </section>

      {learnerProgramEnrollment && learnerProgramEnrollment.user && (
        <>
          <div className="d-flex">
            <div className="col-sm-6 my-3 pl-0 mr-1">
              <Row className="inspector-name-row mx-1">
                <Col>
                  <p className="h5">Username</p>
                </Col>
                <Col>
                  <p className="small mb-0">
                    {learnerProgramEnrollment.user.username}
                  </p>
                </Col>
              </Row>
              <Row className="mt-2 inspector-name-row  mx-1">
                <Col>
                  <p className="h5">Email</p>
                </Col>
                <Col>
                  <p className="small mb-0">
                    {learnerProgramEnrollment.user.email}
                  </p>
                </Col>
              </Row>
              {learnerProgramEnrollment && learnerProgramEnrollment.user && (
                <div className="pt-3">
                  <VerifiedName
                    username={learnerProgramEnrollment.user.username}
                  />
                </div>
              )}
            </div>
            <div className="col-sm-6 sso-records ml-1">
              <h4>SSO Records</h4>
              {ssoRecords && ssoRecords.length ? (
                ssoRecords.map((ssoRecord) => (
                  <SingleSignOnRecordCard ssoRecord={ssoRecord} />
                ))
              ) : (
                <Alert variant="danger">SSO Record Not Found</Alert>
              )}
            </div>
          </div>
          <div className="mt-2">
            {learnerProgramEnrollment
              && learnerProgramEnrollment.enrollments && (
                <EnrollmentDetails
                  enrollments={learnerProgramEnrollment.enrollments}
                />
            )}
          </div>
        </>
      )}
    </>
  );
}
