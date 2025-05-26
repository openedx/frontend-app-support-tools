import React, {
  useContext,
  useEffect,
  useState,
  useRef,
  useLayoutEffect,
} from 'react';
import { camelCaseObject, getConfig } from '@edx/frontend-platform';
import PropTypes from 'prop-types';
import {
  ActionRow, Alert, Button, ModalDialog,
} from '@openedx/paragon';
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
  const TABLE_DATA_TEST_ID = 'certificate-info-table';

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
  }, []);

  function usePrevious(value) {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    }, [value]);
    return ref.current;
  }

  const postGenerateCertificate = () => {
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
  };

  const postRegenerateCertificate = () => {
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
  };

  /**
   * For a pdf certificate, the download url is already a valid and complete Url.
   * LMS base is only attached for non-pdf certificates.
   */
  function certificateDownloadUrl(certificateInfo) {
    if (certificateInfo.isPdfCertificate) {
      return certificateInfo.downloadUrl;
    }
    return `${getConfig().LMS_BASE_URL}${certificateInfo.downloadUrl}`;
  }

  const certificateInfo = (
    <section data-testid="certificates" ref={certificateRef}>
      {!certificate && !displayCertErrors && <PageLoading srMessage="Loading" /> }
      {displayCertErrors && <AlertList topic="certificates" />}

      {certificate && !displayCertErrors && (

      <div>
        {status && (<Alert variant="info">{status}</Alert>)}
        <table data-testid={TABLE_DATA_TEST_ID} className="certificate-info-table">
          <tbody>

            <tr data-testid={`${TABLE_DATA_TEST_ID}-row`}>
              <th>Course ID</th>
              <td>{certificate.courseKey}</td>
            </tr>

            <tr data-testid={`${TABLE_DATA_TEST_ID}-row`}>
              <th>Certificate Type</th>
              <td>{certificate.type ? certificate.type : 'Not Available'}</td>
            </tr>

            <tr data-testid={`${TABLE_DATA_TEST_ID}-row`}>
              <th>Status</th>
              <td>{certificate.status ? certificate.status : 'Not Available'}</td>
            </tr>

            <tr data-testid={`${TABLE_DATA_TEST_ID}-row`}>
              <th>Grade</th>
              <td>{certificate.grade ? certificate.grade : 'Not Available'}</td>
            </tr>

            <tr data-testid={`${TABLE_DATA_TEST_ID}-row`}>
              <th>Last Updated</th>
              <td>{formatDate(certificate.modified)}</td>
            </tr>

            <tr data-testid={`${TABLE_DATA_TEST_ID}-row`}>
              <th>Download URL</th>
              <td>{certificate.downloadUrl ? <a href={certificateDownloadUrl(certificate)}>Download</a> : 'Not Available'}</td>
            </tr>

            <tr data-testid={`${TABLE_DATA_TEST_ID}-row`}>
              <th>Actions</th>
              <td>
                {
                    certificate.regenerate
                      ? (
                        <Button
                          data-testid="regenerate-certificate-button"
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
                          data-testid="generate-certificate-button"
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
    <ModalDialog
      data-testid="certificate-modal-dialogue"
      isOpen={modalIsOpen}
      onClose={() => {
        closeHandler();
        setModalIsOpen(false);
      }}
      hasCloseButton
      id="certificate"
      size="lg"
    >
      <ModalDialog.Header className="mb-3">
        <ModalDialog.Title className="modal-title">
          Certificate
        </ModalDialog.Title>
      </ModalDialog.Header>
      <ModalDialog.Body>
        { certificateInfo}
      </ModalDialog.Body>
      <ModalDialog.Footer>
        <ActionRow>
          <ModalDialog.CloseButton
            data-testid="certificates-btn-link"
            variant="link"
          >
            Close
          </ModalDialog.CloseButton>
        </ActionRow>
      </ModalDialog.Footer>
    </ModalDialog>
  );
}

Certificates.propTypes = {
  username: PropTypes.string.isRequired,
  courseId: PropTypes.string.isRequired,
  closeHandler: PropTypes.func.isRequired,
};
