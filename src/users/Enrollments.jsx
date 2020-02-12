import React, { useMemo } from 'react';
import Table from '@edx/paragon/dist/Table';
import Collapsible from '@edx/paragon/dist/Collapsible';


export default function Enrollments({ data }) {

  const tableData = useMemo(() => {
    if (data === null || data.length === 0) {
      return [];
    }
    debugger;
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
  ];

  return (
    <section className="container-fluid">
      <h3>Enrollments</h3>
      <Collapsible title={`Enrollments (${tableData.length})`}>
        <Table
          data={tableData}
          columns={columns}
        />
      </Collapsible>
    </section>
  );
}
