import React, {
  useContext,
  useEffect,
  useState,
  useLayoutEffect,
  useMemo,
  useRef,
} from 'react';
import { camelCaseObject } from '@edx/frontend-platform';
import PropTypes from 'prop-types';
import { ModalDialog, ActionRow } from '@openedx/paragon';
import PageLoading from '../../components/common/PageLoading';
import { formatDate } from '../../utils';
import UserMessagesContext from '../../userMessages/UserMessagesContext';
import AlertList from '../../userMessages/AlertList';
import { getCourseData } from '../data/api';
import Table from '../../components/Table';

export default function CourseSummary({
  courseUUID, closeHandler,
}) {
  const { add, clear } = useContext(UserMessagesContext);
  const [courseSummaryErrors, setCourseSummaryErrors] = useState(false);
  const [courseSummaryData, setCourseSummaryData] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(true);
  const courseSummaryRef = useRef(null);

  useEffect(() => {
    setCourseSummaryData(null);
  }, [courseUUID]);

  useEffect(() => {
    clear('course-summary');
    if (courseSummaryData === null) {
      getCourseData(courseUUID).then((result) => {
        const camelCaseResult = camelCaseObject(result);
        if (camelCaseResult.errors) {
          camelCaseResult.errors.forEach(error => add(error));
          setCourseSummaryErrors(true);
        } else {
          setCourseSummaryErrors(false);
          setCourseSummaryData(camelCaseResult);
        }
      });
    }
  }, [courseSummaryData, courseUUID]);

  useLayoutEffect(() => {
    if (courseSummaryRef !== null) {
      courseSummaryRef.current.focus();
    }
  }, []);

  const courseRunsColumn = useMemo(
    () => [
      {
        Header: 'Course Run ID', accessor: 'course_id', sortable: true,
      },
      {
        Header: 'Start Date', accessor: 'start', sortable: true,
      },
      {
        Header: 'End Date', accessor: 'end', sortable: true,
      },
    ],
    [],
  );

  const tableData = useMemo(() => {
    if (!courseSummaryData || courseSummaryData.courseRuns === []) {
      return [];
    }
    return courseSummaryData.courseRuns.map((item) => ({
      course_id: item.key,
      start: formatDate(item.start),
      end: formatDate(item.end),
    }));
  }, [courseSummaryData]);

  function renderCourseRuns() {
    return (
      <Table
        columns={courseRunsColumn}
        data={tableData}
        styleName="course-runs-table"
      />
    );
  }

  const courseSummaryInfo = (
    <section data-testid="course-summary-info" ref={courseSummaryRef}>
      {!courseSummaryData && !courseSummaryErrors && <PageLoading srMessage="Loading" />}
      {courseSummaryErrors && <AlertList topic="course-summary" className="m-3" />}

      {courseSummaryData && !courseSummaryErrors && (
        <div>
          <table className="course-summary-table">
            <tbody>

              <tr>
                <th>UUID</th>
                <td>{courseSummaryData.uuid}</td>
              </tr>

              <tr>
                <th>Course Key</th>
                <td>{courseSummaryData.key}</td>
              </tr>

              <tr>
                <th>Course Runs</th>
                <td>
                  {courseSummaryData.courseRuns.length === 0 ? (
                    <div>No Course Runs available</div>
                  )
                    : renderCourseRuns()}
                </td>
              </tr>

              <tr>
                <th>Level</th>
                <td>{courseSummaryData.levelType}</td>
              </tr>

              <tr>
                <th>Marketing</th>
                <td>
                  <a
                    href={courseSummaryData.marketingUrl}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Marketing URL
                  </a>
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
      isOpen={modalIsOpen}
      onClose={() => {
        closeHandler();
        setModalIsOpen(false);
      }}
      hasCloseButton
      id="course-summary"
      size="lg"
    >
      <ModalDialog.Header className="mb-3">
        <ModalDialog.Title className="mb-3">
          {
            courseSummaryData && !courseSummaryErrors
              ? `Course Summary: ${courseSummaryData.title}`
              : 'Course Summary'
          }
        </ModalDialog.Title>
      </ModalDialog.Header>
      <ModalDialog.Body ref={courseSummaryRef}>
        {courseSummaryInfo}
      </ModalDialog.Body>
      <ModalDialog.Footer>
        <ActionRow>
          <ModalDialog.CloseButton
            data-testid="course-summary-modal-close-button"
            id="closeBtnTest"
            variant="link"
          >
            Close
          </ModalDialog.CloseButton>
        </ActionRow>
      </ModalDialog.Footer>
    </ModalDialog>
  );
}

CourseSummary.propTypes = {
  courseUUID: PropTypes.string.isRequired,
  closeHandler: PropTypes.func.isRequired,
};
