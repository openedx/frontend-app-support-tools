import React, {
  useMemo,
  useState,
  useCallback,
  useRef,
  useLayoutEffect,
  useEffect,
  useContext,
} from 'react';

import { Button, TransitionReplace, Collapsible } from '@edx/paragon';
import { camelCaseObject, getConfig } from '@edx/frontend-platform';
import PropTypes from 'prop-types';
import Certificates from './Certificates';
import EnrollmentForm from './EnrollmentForm';
import EnrollmentExtra from './EnrollmentExtra';
import { CREATE, CHANGE } from './constants';
import PageLoading from '../../components/common/PageLoading';
import UserMessagesContext from '../../userMessages/UserMessagesContext';
import Table from '../../Table';
import { formatDate, sort } from '../../utils';
import { getEnrollments } from '../data/api';
import AlertList from '../../userMessages/AlertList';

export default function Enrollments({
  changeHandler, user, expanded,
}) {
  const { add, clear } = useContext(UserMessagesContext);
  const [sortColumn, setSortColumn] = useState('created');
  const [sortDirection, setSortDirection] = useState('desc');
  const [formType, setFormType] = useState(null);
  const [enrollmentData, setEnrollmentData] = useState(null);
  const [enrollmentToChange, setEnrollmentToChange] = useState(undefined);
  const [enrollmentExtraData, setEnrollmentExtraData] = useState(undefined);
  const [selectedCourseId, setSelectedCourseId] = useState(undefined);
  const formRef = useRef(null);
  const extraRef = useRef(null);

  function setupEnrollmentExtraData(enrollment) {
    const extraData = {
      courseName: enrollment.courseName,
      lastModified: enrollment.manualEnrollment ? formatDate(enrollment.manualEnrollment.timeStamp) : 'N/A',
      lastModifiedBy: enrollment.manualEnrollment && enrollment.manualEnrollment.enrolledBy ? enrollment.manualEnrollment.enrolledBy : 'N/A',
      reason: enrollment.manualEnrollment && enrollment.manualEnrollment.reason ? enrollment.manualEnrollment.reason : 'N/A',
    };
    setSelectedCourseId(undefined);
    setEnrollmentExtraData(extraData);
  }

  useEffect(() => {
    clear('enrollments');
    getEnrollments(user).then((result) => {
      const camelCaseResult = camelCaseObject(result);
      if (camelCaseResult.errors) {
        camelCaseResult.errors.forEach(error => add(error));
        setEnrollmentData([]);
      } else {
        setEnrollmentData(camelCaseResult);
      }
    });
  }, [user]);

  useLayoutEffect(() => {
    if (enrollmentExtraData !== undefined && selectedCourseId === undefined) {
      extraRef.current.focus();
    }
  });

  const tableData = useMemo(() => {
    if (enrollmentData === null || enrollmentData.length === 0) {
      return [];
    }
    return enrollmentData.map(enrollment => ({
      courseId: {
        displayValue: <a href={`${getConfig().LMS_BASE_URL}/courses/${enrollment.courseId}`} rel="noopener noreferrer" target="_blank" className="word_break">{enrollment.courseId}</a>,
        value: enrollment.courseId,
      },
      courseName: {
        value: enrollment.courseName,
      },
      courseStart: {
        displayValue: formatDate(enrollment.courseStart),
        value: enrollment.courseStart,
      },
      courseEnd: {
        displayValue: formatDate(enrollment.courseEnd),
        value: enrollment.courseEnd,
      },
      upgradeDeadline: {
        displayValue: formatDate(enrollment.verifiedUpgradeDeadline),
        value: enrollment.verifiedUpgradeDeadline,
      },
      created: {
        displayValue: formatDate(enrollment.created),
        value: enrollment.created,
      },
      pacingType: {
        value: enrollment.pacingType,
      },
      active: {
        value: enrollment.isActive ? 'True' : 'False',
      },
      mode: {
        value: enrollment.mode,
      },
      actions: {
        displayValue: (
          <div>
            <Button
              type="button"
              variant="outline-primary"
              id="enrollment-change"
              onClick={() => {
                setEnrollmentToChange(enrollment);
                setFormType(CHANGE);
              }}
            >
              Change
            </Button>
            <Button
              type="button"
              id="extra-data"
              variant="primary mt-2 mr-2"
              onClick={() => {
                setupEnrollmentExtraData(enrollment);
              }}
            >
              Show Extra
            </Button>
            <Button
              type="button"
              id="certificate"
              variant="outline-primary mt-2 mr-2"
              onClick={() => {
                setSelectedCourseId(enrollment.courseId);
              }}
            >
              View Certificate
            </Button>
          </div>
        ),
        value: 'Change',
      },
    }));
  }, [enrollmentData]);

  const setSort = useCallback((column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'desc' ? 'asc' : 'desc');
    } else {
      setSortDirection('desc');
    }
    setSortColumn(column);
  });

  useLayoutEffect(() => {
    if (formType != null) {
      formRef.current.focus();
    }
  });

  const columns = [
    {
      label: 'Course Run ID', key: 'courseId', columnSortable: true, onSort: () => setSort('courseId'), width: 'col-3',
    },
    {
      label: 'Course Title', key: 'courseName', columnSortable: true, onSort: () => setSort('courseName'), width: 'col-3',
    },
    {
      label: 'Course Start', key: 'courseStart', columnSortable: true, onSort: () => setSort('courseStart'), width: 'col-3',
    },
    {
      label: 'Course End', key: 'courseEnd', columnSortable: true, onSort: () => setSort('courseEnd'), width: 'col-3',
    },
    {
      label: 'Upgrade Deadline', key: 'upgradeDeadline', columnSortable: true, onSort: () => setSort('upgradeDeadline'), width: 'col-3',
    },
    {
      label: 'Enrollment Date', key: 'created', columnSortable: true, onSort: () => setSort('created'), width: 'col-3',
    },
    {
      label: 'Pacing Type', key: 'pacingType', columnSortable: true, onSort: () => setSort('pacingType'), width: 'col-3',
    },
    {
      label: 'Mode', key: 'mode', columnSortable: true, onSort: () => setSort('mode'), width: 'col-3',
    },
    {
      label: 'Active', key: 'active', columnSortable: true, onSort: () => setSort('active'), width: 'col-3',
    },
    {
      label: 'Actions', key: 'actions', columnSortable: true, onSort: () => {}, width: 'col-3',
    },
  ];

  const tableDataSortable = [...tableData];
  return (
    <section className="mb-3">
      <div className="d-flex flex-row justify-content-between mb-2">
        {!formType && (
          <Button
            id="create-enrollment-button"
            type="button"
            variant="outline-primary"
            onClick={() => {
              setEnrollmentToChange(undefined);
              setFormType(CREATE);
            }}
          >
            Create New Enrollment
          </Button>
        )}
      </div>
      <AlertList topic="enrollments" className="mb-3" />
      <TransitionReplace>
        {formType != null ? (
          <EnrollmentForm
            key="enrollment-form"
            enrollment={enrollmentToChange}
            formType={formType}
            user={user}
            submitHandler={() => {}}
            changeHandler={changeHandler}
            closeHandler={() => setFormType(null)}
            forwardedRef={formRef}
          />
        ) : (<React.Fragment key="nothing" />) }
      </TransitionReplace>
      <TransitionReplace>
        {enrollmentExtraData !== undefined ? (
          <EnrollmentExtra
            closeHandler={() => setEnrollmentExtraData(undefined)}
            enrollmentExtraData={enrollmentExtraData}
            forwardedRef={extraRef}
          />
        ) : (<React.Fragment key="nothing" />) }
      </TransitionReplace>
      <TransitionReplace>
        {selectedCourseId !== undefined ? (
          <Certificates
            key="certificates-data"
            closeHandler={() => setSelectedCourseId(undefined)}
            courseId={selectedCourseId}
            username={user}
          />
        ) : (<React.Fragment key="nothing" />) }
      </TransitionReplace>
      <Collapsible title={`Enrollments (${tableData.length})`} defaultOpen={expanded}>
        {enrollmentData
          ? (
            <Table
              className="w-auto"
              data={tableDataSortable.sort(
                (firstElement, secondElement) => sort(firstElement, secondElement, sortColumn, sortDirection),
              )}
              columns={columns}
              tableSortable
              defaultSortedColumn="created"
              defaultSortDirection="desc"
            />
          )
          : <PageLoading srMessage="Loading" />}
      </Collapsible>
    </section>
  );
}

Enrollments.propTypes = {
  changeHandler: PropTypes.func.isRequired,
  user: PropTypes.string.isRequired,
  expanded: PropTypes.bool,
};

Enrollments.defaultProps = {
  expanded: false,
};
