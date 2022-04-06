import React, {
  useContext,
  useEffect,
  useState,
  useRef,
  useLayoutEffect,
} from 'react';
import { camelCaseObject, getConfig } from '@edx/frontend-platform';
import PropTypes from 'prop-types';
import { Alert, Button, Modal } from '@edx/paragon';
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
  const [certificate, setCertificate] = useState(undefined);
  const [status, setStatus] = useState(undefined);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(true);
  // eslint-disable-next-line no-use-before-define
  const oldCourseId = usePrevious(courseId);
  const certificateRef = useRef(null);

  useEffect(() => {
    setCertificate(undefined);
  }, [courseId]);

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
          setCertificate(camelCaseResult);
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
        setCertificate(undefined);
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
        setCertificate(undefined);
      }
      setButtonDisabled(false);
      setStatus(undefined);
    });
  }

  const certificateInfo = (
    <section ref={certificateRef}>
      {!certificate && !displayCertErrors && <PageLoading srMessage="Loading" /> }
      {displayCertErrors && <AlertList topic="certificates" />}

      {certificate && !displayCertErrors && (

      <div>
        {status && (<Alert variant="info">{status}</Alert>)}
        <table className="certificate-info-table">
          <tbody>

            <tr>
              <th>Course ID</th>
              <td>{certificate.courseKey}</td>
            </tr>

            <tr>
              <th>Certificate Type</th>
              <td>{certificate.type ? certificate.type : 'Not Available'}</td>
            </tr>

            <tr>
              <th>Status</th>
              <td>{certificate.status ? certificate.status : 'Not Available'}</td>
            </tr>

            <tr>
              <th>Grade</th>
              <td>{certificate.grade ? certificate.grade : 'Not Available'}</td>
            </tr>

            <tr>
              <th>Last Updated</th>
              <td>{formatDate(certificate.modified)}</td>
            </tr>

            <tr>
              <th>Download URL</th>
              <td>{certificate.downloadUrl ? <a href={`${getConfig().LMS_BASE_URL}${certificate.downloadUrl}`}>Download</a> : 'Not Available'}</td>
            </tr>

            <tr>
              <th>Actions</th>
              <td>
                {
                    certificate.regenerate
                      ? (
                        <Button
                          onClick={postRegenerateCertificate}
                          id="regenerate-certificate"
                          variant="outline-danger"
                          disabled={buttonDisabled}
                        >
                          Regenerate
                        </Button>
                      )
                      : (
                        <Button
                          onClick={postGenerateCertificate}
                          id="generate-certificate"
                          variant="outline-danger"
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

  return (
    <Modal
      open={modalIsOpen}
      onClose={() => {
        closeHandler();
        setModalIsOpen(false);
      }}
      title="Certificate"
      id="certificate"
      dialogClassName="modal-lg"
      body={(
        certificateInfo
    )}
    />
  );
}

Certificates.propTypes = {
  username: PropTypes.string.isRequired,
  courseId: PropTypes.string.isRequired,
  closeHandler: PropTypes.func.isRequired,
};
