import React, {
  useMemo, useState, useCallback,
} from 'react';
import PropTypes from 'prop-types';

import { Button, Table, Collapsible } from '@edx/paragon';


const sort = function sort(firstElement, secondElement, key, direction) {
  const directionIsAsc = direction === 'asc';

  if (firstElement[key] > secondElement[key]) {
    return directionIsAsc ? 1 : -1;
  }
  if (firstElement[key] < secondElement[key]) {
    return directionIsAsc ? -1 : 1;
  }
  return 0;
};

export default function Entitlements({ data }) {
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState('desc');

  const tableData = useMemo(() => {
    if (data === null) {
      return [];
    }
    return data.results.map(result => ({
      user: result.user,
      courseUuid: result.courseUuid,
      mode: result.mode,
      enrollment: 'Enrollment data comes from where?',
      expiredAt: result.expiredAt,
      created: result.created,
      modified: result.modified,
      orderNumber: result.orderNumber,
      actions: <Button type="button" onClick={() => console.log('reissue it')} className="btn-outline-primary">Reissue</Button>,
    }));
  }, [data]);

  const setSort = useCallback((column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'desc' ? 'asc' : 'desc');
    }
    setSortColumn(column);
  });

  const columns = [
    {
      label: 'User', key: 'user', columnSortable: true, onSort: () => setSort('user'), width: 'col-3',
    },
    {
      label: 'Course UUID', key: 'courseUuid', columnSortable: true, onSort: () => setSort('courseUuid'), width: 'col-3',
    },
    {
      label: 'Mode', key: 'mode', columnSortable: true, onSort: () => setSort('mode'), width: 'col-3',
    },
    {
      label: 'Enrollment', key: 'enrollment', columnSortable: true, onSort: () => setSort('enrollment'), width: 'col-3',
    },
    {
      label: 'Expired At', key: 'expiredAt', columnSortable: true, onSort: () => setSort('expiredAt'), width: 'col-3',
    },
    {
      label: 'Created', key: 'created', columnSortable: true, onSort: () => setSort('created'), width: 'col-3',
    },
    {
      label: 'Modified', key: 'modified', columnSortable: true, onSort: () => setSort('modified'), width: 'col-3',
    },
    {
      label: 'Order', key: 'orderNumber', columnSortable: true, onSort: () => setSort('orderNumber'), width: 'col-3',
    },
    {
      label: 'Actions', key: 'actions', columnSortable: true, onSort: () => setSort('actions'), width: 'col-3',
    },
  ];

  const tableDataSortable = [...tableData];

  return (
    <section className="container-fluid mb-3">
      <div className="d-flex flex-row justify-content-between mb-2">
        <h3>Entitlements</h3>
        <Button type="button" className="btn-outline-primary">Create New Entitlement</Button>
      </div>
      <Collapsible title={`Entitlements (${tableData.length})`}>

        <Table
          className="w-100"
          data={tableDataSortable.sort((firstElement, secondElement) => sort(firstElement, secondElement, sortColumn, sortDirection))}
          columns={columns}
          tableSortable
          defaultSortedColumn="created"
          defaultSortDirection="desc"
        />
      </Collapsible>
    </section>
  );
}

Entitlements.propTypes = {
  data: PropTypes.shape({
    results: PropTypes.arrayOf(PropTypes.object),
  }),
};

Entitlements.defaultProps = {
  data: null,
};
