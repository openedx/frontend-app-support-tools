import React, { useEffect, useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Alert, Col, Row, Button, Input,
} from '@openedx/paragon';
import { getSsoRecords, getUser } from '../../users/data/api';
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

  const [query, setQuery] = useState(null);

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
      const newLink = `?edx_user=${
        username || ''
      }&org_key=${activeOrgKey}&external_user_key=${externalUserKey || ''}`;
      if (newLink === location.search) {
        setClickEventCall(!clickEventCall);
      } else {
        setQuery(newLink);
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
        const name = response?.learner_program_enrollments?.user?.username;
        return name;
      }).then((name) => getUser(name)).then((res) => {
        navigate(`?edx_user_id=${res.id}`);
      })
        .catch(err => {
          console.error(err);
          setError('An error occured while fetching user id');
          navigate('/programs');
        });
    }
  };

  useEffect(() => {
    if (query) {
      fetchInspectorData(query);
    }
  }, [query]);

  useEffect(() => {
    const userId = new URLSearchParams(location.search).get('edx_user_id');
    if (userId) {
      getUser(userId).then(res => {
        setUsername(res.username);
        setQuery(`?edx_user=${res.username}&org_key=${activeOrgKey}&external_user_key=${externalUserKey}`);
      }).catch(err => {
        console.error(err);
        setError('An error occured while fetching user id');
        navigate('/programs');
      });
    }
  }, []);

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
              <label htmlFor="username">edX username or email</label>
              <Input
                className="col-sm-12"
                name="username"
                type="text"
                defaultValue={username}
                onChange={(e) => (e.target.value
                  ? setUsername(e.target.value)
                  : setUsername(undefined))}
                placeholder="edx@example.com"
              />
            </div>
            <div className="col-sm-4">
              <label htmlFor="orgKey">Identity-providing institution</label>
              <Input
                className="col-sm-12"
                name="orgKey"
                type="select"
                defaultValue={activeOrgKey}
                options={getOrgKeyList()}
                onChange={(e) => setActiveOrgKey(e.target.value)}
              />
            </div>
            <div className="col-sm-4 pr-0">
              <label htmlFor="externalKey">Institution user key</label>
              <Input
                className="col-sm-12"
                name="externalKey"
                type="text"
                defaultValue={externalUserKey}
                onChange={(e) => (e.target.value
                  ? setExternalUserKey(e.target.value)
                  : setExternalUserKey(undefined))}
                placeholder="ex. GTPersonDirectoryID for GT Students"
              />
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
