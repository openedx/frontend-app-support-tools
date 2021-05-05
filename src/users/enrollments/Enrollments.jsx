import React, {
  useMemo,
  useState,
  useCallback,
  useRef,
  useLayoutEffect,
} from 'react';

import { Button, TransitionReplace, Collapsible } from '@edx/paragon';
import { getConfig } from '@edx/frontend-platform';
import PropTypes from 'prop-types';
import EnrollmentForm from './EnrollmentForm';
import EnrollmentExtra from './EnrollmentExtra';
import Table from '../../Table';
import { formatDate, sort } from '../../utils';

export default function Enrollments({
  data, changeHandler, user, expanded,
}) {
  const [sortColumn, setSortColumn] = useState('created');
  const [sortDirection, setSortDirection] = useState('desc');
  const [formType, setFormType] = useState(null);
  const [enrollmentToChange, setEnrollmentToChange] = useState(undefined);
  const [enrollmentExtraData, setEnrollmentExtraData] = useState(undefined);
  const formRef = useRef(null);
  const extraRef = useRef(null);

  function setupEnrollmentExtraData(enrollment) {
    const extraData = {
      courseName: enrollment.courseName,
      lastModified: enrollment.manualEnrollment ? formatDate(enrollment.manualEnrollment.timeStamp) : 'N/A',
      lastModifiedBy: enrollment.manualEnrollment && enrollment.manualEnrollment.enrolledBy ? enrollment.manualEnrollment.enrolledBy : 'N/A',
      reason: enrollment.manualEnrollment && enrollment.manualEnrollment.reason ? enrollment.manualEnrollment.reason : 'N/A',
    };
    setEnrollmentExtraData(extraData);
  }

  useLayoutEffect(() => {
    if (enrollmentExtraData !== undefined) {
      extraRef.current.focus();
    }
  });

  const tableData = useMemo(() => {
    if (data === null || data.length === 0) {
      return [];
    }
    return data.map(result => ({
      courseId: {
        displayValue: <a href={`${getConfig().LMS_BASE_URL}/courses/${result.courseId}`} rel="noopener noreferrer" target="_blank" className="word_break">{result.courseId}</a>,
        value: result.courseId,
      },
      courseName: {
        value: result.courseName,
      },
      courseStart: {
        displayValue: formatDate(result.courseStart),
        value: result.courseStart,
      },
      courseEnd: {
        displayValue: formatDate(result.courseEnd),
        value: result.courseEnd,
      },
      upgradeDeadline: {
        displayValue: formatDate(result.verifiedUpgradeDeadline),
        value: result.verifiedUpgradeDeadline,
      },
      created: {
        displayValue: formatDate(result.created),
        value: result.created,
      },
      pacingType: {
        value: result.pacingType,
      },
      active: {
        value: result.isActive ? 'True' : 'False',
      },
      mode: {
        value: result.mode,
      },
      actions: {
        displayValue: (
          <div>
            <Button
              type="button"
              variant="outline-primary"
              id="enrollment-change"
              onClick={() => {
                setEnrollmentToChange(result);
                setFormType('CHANGE');
              }}
            >
              Change
            </Button>
            <Button
              type="button"
              id="extra-data"
              variant="primary mt-2 mr-2"
              onClick={() => {
                setupEnrollmentExtraData(result);
              }}
            >
              Show Extra
            </Button>
          </div>
        ),
        value: 'Change',
      },
    }));
  }, [data]);

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
      <TransitionReplace>
        {formType != null ? (
          <EnrollmentForm
            key="enrollment-form"
            enrollment={enrollmentToChange}
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
      <Collapsible title={`Enrollments (${tableData.length})`} defaultOpen={expanded}>
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
      </Collapsible>
    </section>
  );
}

Enrollments.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object),
  changeHandler: PropTypes.func.isRequired,
  user: PropTypes.string.isRequired,
  expanded: PropTypes.bool,
};

Enrollments.defaultProps = {
  data: null,
  expanded: false,
};
