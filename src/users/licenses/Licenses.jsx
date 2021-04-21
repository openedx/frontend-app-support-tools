import React, {
  useMemo,
  useState,
  useCallback,
} from 'react';
import PropTypes from 'prop-types';
import { Collapsible, Badge } from '@edx/paragon';
import Table from '../../Table';
import { formatDate, sort } from '../../utils';

export default function Licenses({
  data, status, expanded,
}) {
  const [sortColumn, setSortColumn] = useState('status');
  const [sortDirection, setSortDirection] = useState('desc');
  const responseStatus = useMemo(() => status, [status]);
  const tableData = useMemo(() => {
    if (data === null || data.length === 0) {
      return [];
    }
    return data.map(result => ({
      status: {
        value: result.status,
      },
      assignedDate: {
        displayValue: formatDate(result.assignedDate),
        value: result.assignedDate,
      },
      activationDate: {
        displayValue: formatDate(result.activationDate),
        value: result.activationDate,
      },
      revokedDate: {
        displayValue: formatDate(result.revokedDate),
        value: result.revokedDate,
      },
      lastRemindDate: {
        displayValue: formatDate(result.lastRemindDate),
        value: result.lastRemindDate,
      },
      subscriptionPlanTitle: {
        value: result.subscriptionPlanTitle,
      },
      subscriptionPlanExpirationDate: {
        displayValue: formatDate(result.subscriptionPlanExpirationDate),
        value: result.subscriptionPlanExpirationDate,
      },
      activationLink: {
        displayValue: <a href={result.activationLink} rel="noopener noreferrer" target="_blank" className="word_break">{result.activationLink}</a>,
        value: result.activationLink,
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
  const columns = [

    {
      label: 'Status', key: 'status', columnSortable: true, onSort: () => setSort('status'), width: 'col-3',
    },
    {
      label: 'Assigned Date', key: 'assignedDate', columnSortable: true, onSort: () => setSort('assignedDate'), width: 'col-3',
    },
    {
      label: 'Activation Date', key: 'activationDate', columnSortable: true, onSort: () => setSort('activationDate'), width: 'col-3',
    },
    {
      label: 'Revoked Date', key: 'revokedDate', columnSortable: true, onSort: () => setSort('revokedDate'), width: 'col-3',
    },
    {
      label: 'Last Remind Date', key: 'lastRemindDate', columnSortable: true, onSort: () => setSort('lastRemindDate'), width: 'col-3',
    },
    {
      label: 'Subscription Plan Title', key: 'subscriptionPlanTitle', columnSortable: true, onSort: () => setSort('subscriptionPlanTitle'), width: 'col-3',
    },
    {
      label: 'Subscription Plan Expiration Date', key: 'subscriptionPlanExpirationDate', columnSortable: true, onSort: () => setSort('subscriptionPlanExpirationDate'), width: 'col-3',
    },
    {
      label: 'Activation Link', key: 'activationLink', columnSortable: true, onSort: () => setSort('activationLink'), width: 'col-3',
    },
  ];

  const tableDataSortable = [...tableData];
  let statusMsg;
  if (responseStatus !== '') {
    statusMsg = <Badge variant="light">{`Fetch Status: ${responseStatus}`}</Badge>;
  } else {
    statusMsg = null;
  }

  return (
    <section className="mb-3">
      <Collapsible
        title={(
          <>
            {`Licenses (${tableData.length})`}
            {statusMsg}
          </>
        )}
        defaultOpen={expanded}
      >
        <Table
          className="w-auto"
          data={tableDataSortable.sort(
            (firstElement, secondElement) => sort(firstElement, secondElement, sortColumn, sortDirection),
          )}
          columns={columns}
          tableSortable
          defaultSortedColumn="status"
          defaultSortDirection="desc"
        />
      </Collapsible>
    </section>
  );
}

Licenses.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    status: PropTypes.string,
    assignedDate: PropTypes.string,
    revokedDate: PropTypes.string,
    activationDate: PropTypes.string,
    subscriptionPlanTitle: PropTypes.string,
    lastRemindDate: PropTypes.string,
    activationLink: PropTypes.string,
    subscriptionPlanExpirationDate: PropTypes.string,
  })),
  status: PropTypes.string,
  expanded: PropTypes.bool,
};

Licenses.defaultProps = {
  data: null,
  status: '',
  expanded: false,
};
