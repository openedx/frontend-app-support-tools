import React, { useMemo, useState, useCallback, useRef, useLayoutEffect } from 'react';

import { Button, TransitionReplace, Collapsible } from '@edx/paragon';
import { getConfig } from '@edx/frontend-platform';
import PropTypes from 'prop-types';
import EnrollmentForm from './EnrollmentForm';
import sort from './sort';
import Table from '../Table';

export default function Enrollments({
  data, changeHandler, user, expanded,
}) {
  const [sortColumn, setSortColumn] = useState('created');
  const [sortDirection, setSortDirection] = useState('desc');
  const [formType, setFormType] = useState(null);
  const [enrollmentToChange, setEnrollmentToChange] = useState(undefined);
  const formRef = useRef(null);

  const tableData = useMemo(() => {
    if (data === null || data.length === 0) {
      return [];
    }
    return data.map(result => ({
      courseId: <a href={`${getConfig().LMS_BASE_URL}/courses/${result.courseId}`} rel="noopener noreferrer" target="_blank">{result.courseId}</a>,
      courseStart: result.courseStart,
      courseEnd: result.courseEnd,
      upgradeDeadline: result.verifiedUpgradeDeadline,
      created: result.created,
      reason: result.manualEnrollment ? result.manualEnrollment.reason : '',
      lastModifiedBy: result.manualEnrollment ? result.manualEnrollment.enrolledBy : '',
      lastModified: result.manualEnrollment ? result.manualEnrollment.timeStamp : '',
      active: result.isActive ? 'True' : 'False',
      mode: result.mode,
      actions: (
        <Button
          type="button"
          onClick={() => {
            setEnrollmentToChange(result);
            setFormType('CHANGE');
          }}
          className="btn-outline-primary"
        >
          Change
        </Button>
      ),
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
    if(formType != null) {
      formRef.current.focus();
    }
  });

  const columns = [
    {
      label: 'Course Run ID', key: 'courseId', columnSortable: true, onSort: () => setSort('courseId'), width: 'col-3',
    },
    {
      label: 'Course Start', date: true, key: 'courseStart', columnSortable: true, onSort: () => setSort('courseStart'), width: 'col-3',
    },
    {
      label: 'Course End', date: true, key: 'courseEnd', columnSortable: true, onSort: () => setSort('courseEnd'), width: 'col-3',
    },
    {
      label: 'Upgrade Deadline', date: true, key: 'upgradeDeadline', columnSortable: true, onSort: () => setSort('upgradeDeadline'), width: 'col-3',
    },
    {
      label: 'Enrollment Date', date: true, key: 'created', columnSortable: true, onSort: () => setSort('created'), width: 'col-3',
    },
    {
      label: 'Reason', key: 'reason', columnSortable: true, onSort: () => setSort('reason'), width: 'col-3',
    },
    {
      label: 'Last Modified By', key: 'lastModifiedBy', columnSortable: true, onSort: () => setSort('lastModifiedBy'), width: 'col-3',
    },
    {
      label: 'Last Modified', date: true, key: 'lastModified', columnSortable: true, onSort: () => setSort('lastModifiedBy'), width: 'col-3',
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
      <h3>Enrollments</h3>
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
        ) : (<React.Fragment key="nothing"></React.Fragment>) }
      </TransitionReplace>
      <Collapsible title={`Enrollments (${tableData.length})`} defaultOpen={expanded}>
        <Table
          className="w-100"
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
