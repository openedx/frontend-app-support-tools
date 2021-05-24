import React, {
  useContext,
  useEffect,
  useState,
  useRef,
  useLayoutEffect,
} from 'react';
import { camelCaseObject, getConfig } from '@edx/frontend-platform';
import PropTypes from 'prop-types';
import { Button } from '@edx/paragon';
import PageLoading from '../../components/common/PageLoading';
import { formatDate } from '../../utils';
import { getCertificate, generateCertificate, regenerateCertificate } from '../data/api';
import UserMessagesContext from '../../userMessages/UserMessagesContext';
import AlertList from '../../userMessages/AlertList';

export default function Certificates({
  username, courseId, closeHandler,
}) {
  const { add, clear } = useContext(UserMessagesContext);
  const [displayCertErrors, setDisplayCertificateErrors] = useState(false);
  const [certificate, setCertificateData] = useState(undefined);
  const [status, setStatus] = useState(undefined);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  // eslint-disable-next-line no-use-before-define
  const oldCourseId = usePrevious(courseId);
  const certificateRef = useRef(null);

  useEffect(() => {
    if ((certificate === undefined && !displayCertErrors) || (courseId !== oldCourseId)) {
      getCertificate(username, courseId).then((result) => {
        const camelCaseResult = camelCaseObject(result);
        if (camelCaseResult.errors) {
          clear('certificates');
          camelCaseResult.errors.forEach(error => add(error));
          setDisplayCertificateErrors(true);
        } else {
          setDisplayCertificateErrors(false);
          setCertificateData(camelCaseResult);
        }
      });
    }
  }, [certificate, courseId]);

  useLayoutEffect(() => {
    if (certificateRef != null) {
      certificateRef.current.focus();
    }
  });

  function usePrevious(value) {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    }, [value]);
    return ref.current;
  }

  function renderHideButton() {
    return (
      <div className="d-flex flex-row justify-content-end m-2">
        <Button
          onClick={closeHandler}
          ref={certificateRef}
          variant="outline-secondary"
          type="button"
        >
          Hide
        </Button>
      </div>
    );
  }

  function postGenerateCertificate() {
    setButtonDisabled(true);
    setStatus('Generating New Certificate');
    generateCertificate(username, certificate.courseKey).then((result) => {
      if (result.errors) {
        clear('certificates');
        result.errors.forEach(error => add(error));
        setDisplayCertificateErrors(true);
      } else {
        setDisplayCertificateErrors(false);
        setCertificateData(undefined);
      }
      setButtonDisabled(false);
      setStatus(undefined);
    });
  }

  function postRegenerateCertificate() {
    setButtonDisabled(true);
    setStatus('Regenerating Certificate');
    regenerateCertificate(username, certificate.courseKey).then((result) => {
      if (result.errors) {
        clear('certificates');
        result.errors.forEach(error => add(error));
        setDisplayCertificateErrors(true);
      } else {
        setDisplayCertificateErrors(false);
        setCertificateData(undefined);
      }
      setButtonDisabled(false);
      setStatus(undefined);
    });
  }

  return (
    <section className="card mb-3">
      <>
        {renderHideButton()}
      </>

      {!certificate && !displayCertErrors && <PageLoading srMessage="Loading" /> }
      {displayCertErrors && <AlertList topic="certificates" />}

      {certificate && !displayCertErrors && (

      <div className="m-3">
        <h2>Course ID: {certificate.courseKey}</h2>
        {status && (<h3>Status: {status} </h3>)}
        <table className="table">
          <tbody>

            <tr>
              <td><strong>Certificate Type</strong></td>
              <td>{certificate.type ? certificate.type : 'Not Available'}</td>
            </tr>

            <tr>
              <td><strong>Status</strong></td>
              <td>{certificate.status ? certificate.status : 'Not Available'}</td>
            </tr>

            <tr>
              <td><strong>Grade</strong></td>
              <td>{certificate.grade ? certificate.grade : 'Not Available'}</td>
            </tr>

            <tr>
              <td><strong>Last Updated</strong></td>
              <td>{formatDate(certificate.modified)}</td>
            </tr>

            <tr>
              <td><strong>Download URL</strong></td>
              <td>{certificate.downloadUrl ? <a href={`${getConfig().LMS_BASE_URL}${certificate.downloadUrl}`}>Download</a> : 'Not Available'}</td>
            </tr>

            <tr>
              <td><strong>Actions</strong></td>
              <td>
                {
                    certificate.regenerate
                      ? (
                        <Button
                          onClick={postRegenerateCertificate}
                          id="regenerate-certificate"
                          variant="danger"
                          disabled={buttonDisabled}
                        >
                          Regenerate
                        </Button>
                      )
                      : (
                        <Button
                          onClick={postGenerateCertificate}
                          variant="danger"
                          id="generate-certificate"
                          disabled={buttonDisabled}
                        >
                          Generate
                        </Button>
                      )
                }

              </td>
            </tr>
          </tbody>

        </table>
      </div>
      )}
    </section>
  );
}

Certificates.propTypes = {
  username: PropTypes.string,
  courseId: PropTypes.string,
  closeHandler: PropTypes.func,
};

Certificates.defaultProps = {
  username: null,
  courseId: null,
  closeHandler: null,
};
