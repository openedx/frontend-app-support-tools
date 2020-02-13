import React, { useMemo, useState } from 'react';
import Table from '@edx/paragon/dist/Table';
import Collapsible from '@edx/paragon/dist/Collapsible';
import { Button, TransitionReplace } from '@edx/paragon';
import EnrollmentForm from './EnrollmentForm';
import EntitlementForm from './Entitlements';


export default function Enrollments({ data, user }) {
  const [formType, setFormType] = useState(null);
  const [enrollmentToChange, setEnrollmentToChange] = useState(undefined);

  const tableData = useMemo(() => {
    if (data === null || data.length === 0) {
      return [];
    }

    return data.map(result => ({
      courseId: result.courseId,
      courseStart: result.courseStart,
      courseEnd: result.courseEnd,
      upgradeDeadline: result.verifiedUpgradeDeadline,
      created: result.created,
      reason: '',
      lastModifiedBy: '',
      active: result.isActive,
      mode: result.mode,
      actions: (
        <Button
          type="button"
          onClick={() => {
            setEnrollmentToChange(result);
            setFormType('CHANGE');
            console.log('Enrollment Change!')
          }}
          className="btn-outline-primary"
        >
          Change
        </Button>
      )
    }));
  }, [data]);

  const columns = [
    {
      label: 'Course Run ID', key: 'courseId', columnSortable: true, onSort: () => {}, width: 'col-3',
    },
    {
      label: 'Course Start', key: 'courseStart', columnSortable: true, onSort: () => {}, width: 'col-3',
    },
    {
      label: 'Course End', key: 'courseEnd', columnSortable: true, onSort: () => {}, width: 'col-3',
    },
    {
      label: 'Upgrade Deadline', key: 'upgradeDeadline', columnSortable: true, onSort: () => {}, width: 'col-3',
    },
    {
      label: 'Enrollment Date', key: 'created', columnSortable: true, onSort: () => {}, width: 'col-3',
    },
    {
      label: 'Reason', key: 'reason', columnSortable: true, onSort: () => {}, width: 'col-3',
    },
    {
      label: 'Last Modified By', key: 'lastModifiedBy', columnSortable: true, onSort: () => {}, width: 'col-3',
    },
    {
      label: 'Mode', key: 'mode', columnSortable: true, onSort: () => {}, width: 'col-3',
    },
    {
      label: 'Active', key: 'active', columnSortable: true, onSort: () => {}, width: 'col-3',
    },
    {
      label: 'Actions', key: 'actions', columnSortable: true, onSort: () => {}, width: 'col-3',
    },
  ];

  return (
    <section className="mb-3">
      <h3>Enrollments</h3>
      <TransitionReplace>
        {formType != null ? (
          <EnrollmentForm
            key="enrollment-form"
            enrollment={enrollmentToChange}
            user={user}
            submitHandler={(entitlement) => console.log(entitlement)}
            closeHandler={() => setFormType(null)}
          />
        ) : (<React.Fragment key="nothing"></React.Fragment>) }
      </TransitionReplace>
      <Collapsible title={`Enrollments (${tableData.length})`}>
        <Table
          data={tableData}
          columns={columns}
        />
      </Collapsible>
    </section>
  );
}
