import React, {
  useMemo,
} from 'react';
import PropTypes from 'prop-types';

import { Table } from '@edx/paragon';


export default function Entitlements({ data }) {
  /*
    Process is the big process - when does osmeone build a tool for us?

    amnual refund - useless
    enrollment - core one
      Verification Deadline - useless
      - course ids as hyperlinks
      - see course name
      -
  */

  /*
{
              label: 'Name',
              key: 'name',
              columnSortable: true,
              onSort: () => {},
              width: 'col-3',
            },
  */


  /*
user: "verified"
uuid: "e1de5a74-6620-4b49-9277-fed49b307804"
course_uuid: "2b189662-9c60-4951-ac3c-95478ca4ac78"
expired_at: null
created: "2020-02-11T18:48:41.583418Z"
modified: "2020-02-11T18:48:41.646333Z"
mode: "verified"
refund_locked: true
order_number: null
support_details: Array(1)
0:
support_user: "staff"
action: "CREATE"
comments: "Woohah"
unenrolled_run: null
created: "2020-02-11T18:48:42.357567Z"
 */

  const tableData = useMemo(() => {
    if (data === null) {
      return [];
    }
    return data.results.map(result => ({
      user: result.name,
      courseUuid: result.name,
      mode: result.name,
      enrollment: result.name,
      expiredAt: result.name,
      created: result.name,
      modified: result.name,
      orderNumber: result.name,
      actions: result.name,
    }));
  }, [data]);

  const columns = [
    {
      label: 'User', key: 'user', columnSortable: true, onSort: () => {}, width: 'col-3',
    },
    {
      label: 'Course UUID', key: 'courseUuid', columnSortable: true, onSort: () => {}, width: 'col-3',
    },
    {
      label: 'Mode', key: 'mode', columnSortable: true, onSort: () => {}, width: 'col-3',
    },
    {
      label: 'Enrollment', key: 'enrollment', columnSortable: true, onSort: () => {}, width: 'col-3',
    },
    {
      label: 'Expired At', key: 'expiredAt', columnSortable: true, onSort: () => {}, width: 'col-3',
    },
    {
      label: 'Created', key: 'created', columnSortable: true, onSort: () => {}, width: 'col-3',
    },
    {
      label: 'Modified', key: 'modified', columnSortable: true, onSort: () => {}, width: 'col-3',
    },
    {
      label: 'Order', key: 'orderNumber', columnSortable: true, onSort: () => {}, width: 'col-3',
    },
    {
      label: 'Actions', key: 'actions', columnSortable: true, onSort: () => {}, width: 'col-3',
    },
  ];

  return (
    <section className="container-fluid">
      <h3>Entitlements</h3>
      <Table
        data={tableData}
        columns={columns}
      />
      <p />
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
