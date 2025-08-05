import React, { useEffect, useState, useRef } from 'react';
import { useIntl } from '@edx/frontend-platform/i18n';
import {
  Button,
  Form,
  DataTable,
  Badge,
  Dropdown,
} from '@openedx/paragon';
import { ArrowDropDown } from '@openedx/paragon/icons';
import PropTypes from 'prop-types';
import messages from './messages';
import SortableHeader from './customSortableHeader';
import TableActions from './customTableActions';

export default function CoursesTable({ username, userCourses }) {
  const intl = useIntl();
  let userCoursesData = userCourses;

  // Change role null to 'null' for sorting to working correctly
  // As we are considering 'null' to appear as staff with disabled dropdown
  userCoursesData = userCoursesData.map((course) => ({
    ...course,
    role: course.role === null ? 'null' : course.role,
  }));
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [org, setOrg] = useState('');
  const [sortBy, setSortBy] = useState([]);
  // Track roles for each course row, keyed by run
  const [rowRoles, setRowRoles] = useState(() => userCoursesData.reduce((acc, row) => {
    acc[row.run] = row.role;
    return acc;
  }, {}));
  const searchInputRef = useRef(null);

  const sortedAndFilteredData = React.useMemo(() => {
    let data = userCoursesData.map((row) => ({
      ...row,
      role: rowRoles[row.run] !== undefined ? rowRoles[row.run] : 'null',
    }));

    // Manual Filtering for all columns in single search box
    data = data.filter(
      (row) => (row.course_name.toLowerCase().includes(search.toLowerCase())
          || row.number.toLowerCase().includes(search.toLowerCase())
          || row.run.toLowerCase().includes(search.toLowerCase())
      )
      && (status === '' || row.status === status)
      && (org === '' || row.org === org),
    );

    // Manual sorting
    if (sortBy.length > 0) {
      const { id, desc } = sortBy[0];
      data = [...data].sort((a, b) => {
        const aValue = a[id];
        const bValue = b[id];
        if (aValue < bValue) { return desc ? 1 : -1; }
        if (aValue > bValue) { return desc ? -1 : 1; }
        return 0;
      });
    }

    return data;
  }, [search, status, org, userCoursesData, rowRoles, sortBy]);

  // Focus the search input when the component mounts
  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  // Custom checkbox selection state, keyed by run
  const [checkedRows, setCheckedRows] = useState(() => {
    const initial = {};
    userCoursesData.forEach((row) => {
      if (row.role === 'staff' || row.role === 'instructor') {
        initial[row.run] = true;
      }
    });
    return initial;
  });

  const handleCheckboxChange = (runId) => {
    setCheckedRows((prev) => ({ ...prev, [runId]: !prev[runId] }));
  };

  // Select all/clear all logic for header checkbox
  const headerCheckboxRef = useRef(null);
  const allRowIds = sortedAndFilteredData.map((row) => row.run);
  const numChecked = allRowIds.filter((id) => checkedRows[id]).length;
  const allChecked = numChecked === allRowIds.length && allRowIds.length > 0;
  const someChecked = numChecked > 0 && numChecked < allRowIds.length;
  useEffect(() => {
    if (headerCheckboxRef.current) {
      headerCheckboxRef.current.indeterminate = someChecked && !allChecked;
    }
  }, [someChecked, allChecked, numChecked, sortBy]);

  const handleHeaderCheckboxChange = () => {
    if (allChecked) {
      // Clear all
      setCheckedRows((prev) => {
        const updated = { ...prev };
        allRowIds.forEach((id) => {
          updated[id] = false;
        });
        return updated;
      });
    } else {
      // Select all
      setCheckedRows((prev) => {
        const updated = { ...prev };
        allRowIds.forEach((id) => {
          updated[id] = true;
        });
        return updated;
      });
    }
  };

  // Generate unique orgs for org filterChoices
  const orgFilterChoices = Array.from(new Set(userCoursesData.map((row) => row.org)))
    .filter(Boolean)
    .map((organization) => ({ name: organization, value: organization }));

  const formatStatus = ({ value }) => (
    <Badge
      className="course-team-management-course-status-badge"
      variant={value === 'active' ? 'success' : 'light'}
    >
      {value === 'active'
        ? intl.formatMessage(messages.activeCoursesFilterLabel)
        : intl.formatMessage(messages.archivedCoursesFilterLabel)}
    </Badge>
  );

  const formatCourseName = ({ row }) => {
    const courseLink = row.original.course_url;
    const courseName = row.original.course_name;
    return (
      <a href={courseLink} target="_blank" rel="noopener noreferrer">
        {courseName}
      </a>
    );
  };

  const formatRole = ({ row }) => {
    const runId = row.original.run;
    const value = rowRoles[runId];
    // If role is 'null', default to staff for display only
    const displayValue = value === 'null' ? 'staff' : value;
    let title = 'Staff';
    if (displayValue === 'instructor') { title = 'Admin'; }
    // Enable dropdown if checkbox is checked, otherwise disable
    const isChecked = !!checkedRows[runId];
    const isDisabled = !isChecked;
    return (
      <Dropdown>
        <Dropdown.Toggle
          as="button"
          className="course-team-management-role-col-dropdown"
          data-testid={`role-dropdown-${runId}`}
          variant="outline-primary"
          disabled={isDisabled}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '2px 8px',
            width: '95px',
            borderRadius: '6px',
          }}
        >
          <span>{title}</span>
          <ArrowDropDown className="ml-2" />
        </Dropdown.Toggle>

        <Dropdown.Menu placement="top">
          <Dropdown.Item
            data-testid={`role-dropdown-item-staff-${runId}`}
            eventKey="staff"
            active={displayValue === 'staff'}
            onClick={() => setRowRoles((prev) => ({ ...prev, [runId]: 'staff' }))}
          >
            {intl.formatMessage(messages.statusStaffFilterLabelChoice)}
          </Dropdown.Item>
          <Dropdown.Item
            data-testid={`role-dropdown-item-instructor-${runId}`}
            eventKey="instructor"
            active={displayValue === 'instructor'}
            onClick={() => setRowRoles((prev) => ({ ...prev, [runId]: 'instructor' }))}
          >
            {intl.formatMessage(messages.statusAdminFilterLabelChoice)}
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    );
  };

  // Custom filter UI for tableActions
  const tableActions = (
    <TableActions
      search={search}
      setSearch={setSearch}
      searchInputRef={searchInputRef}
      status={status}
      setStatus={setStatus}
      org={org}
      setOrg={setOrg}
      orgFilterChoices={orgFilterChoices}
      setRowRoles={setRowRoles}
      sortedAndFilteredData={sortedAndFilteredData}
      checkedRows={checkedRows}
      userCoursesData={userCoursesData}
    />
  );
  // eslint-disable-next-line react/no-unstable-nested-components
  const CheckboxHeader = () => (
    <Form.Check
      ref={headerCheckboxRef}
      type="checkbox"
      checked={allChecked}
      onChange={handleHeaderCheckboxChange}
      aria-label="Select all rows"
      style={{ marginLeft: 8 }}
    />
  );
  // eslint-disable-next-line react/no-unstable-nested-components
  const CheckboxCell = ({ row }) => (
    <Form.Check
      type="checkbox"
      checked={!!checkedRows[row.original.run]}
      onChange={() => handleCheckboxChange(row.original.run)}
      aria-label={`Select row for ${row.original.course_name}`}
      style={{ marginLeft: 8 }}
    />
  );
  const sortableHeader = (id, label) => (
    <SortableHeader
      id={id}
      label={label}
      sortBy={sortBy}
      setSortBy={setSortBy}
    />
  );

  return (
    <div className="course-team-management-courses-table">
      <header className="course-team-management-courses-table-title">
        {intl.formatMessage(messages.courseAccessForUsernameTitle, {
          username,
        })}
      </header>{' '}
      {}
      <div className="course-team-management-courses-table-description">
        <p>{intl.formatMessage(messages.courseAccessDescription)}</p>
      </div>
      <DataTable
        isSortable
        manualSortBy
        sortBy={sortBy}
        onSortByChange={setSortBy}
        isFilterable
        itemCount={userCoursesData.length}
        tableActions={[tableActions]}
        data={sortedAndFilteredData}
        columns={[
          {
            Header: CheckboxHeader,
            accessor: 'checkbox',
            disableFilters: true,
            disableSortBy: true,
            id: 'checkbox',
            Cell: CheckboxCell,
          },
          {
            Header: sortableHeader('course_name', messages.tableHeaderNameLabel),
            accessor: 'course_name',
            id: 'course_name',
            Cell: formatCourseName,
            disableFilters: true,
          },
          {
            Header: sortableHeader('number', messages.tableHeaderNumberLabel),
            accessor: 'number',
            id: 'number',
            disableFilters: true,
          },
          {
            Header: sortableHeader('run', messages.tableHeaderRunLabel),
            accessor: 'run',
            id: 'run',
            disableFilters: true,
          },
          {
            Header: sortableHeader('status', messages.tableHeaderAllCoursesStatusLabel),
            accessor: 'status',
            id: 'status',
            Cell: formatStatus,
            disableFilters: true,
          },
          {
            Header: sortableHeader('role', messages.tableHeaderRoleLabel),
            accessor: 'role',
            id: 'role',
            Cell: formatRole,
            disableFilters: true,
          },
        ]}
        getRowId={(row) => row.run}
      >
        <DataTable.TableControlBar />
        <div style={{ height: 450, overflow: 'auto' }}>
          {sortedAndFilteredData.length > 0 && <DataTable.Table />}
          {sortedAndFilteredData.length === 0 && (
            <div className="pgn__data-table-empty">{intl.formatMessage(messages.noResultsFoundForTable)}</div>
          )}
        </div>
        {sortedAndFilteredData.length > 0 && <DataTable.TableFooter />}
      </DataTable>
      <div className="py-4 my-2 d-flex justify-content-end align-items-center">
        <Button variant="brand" style={{ width: '8%' }}>
          {intl.formatMessage(messages.saveButtonLabel)}
        </Button>
      </div>
    </div>
  );
}

CoursesTable.propTypes = {
  username: PropTypes.string.isRequired,
  userCourses: PropTypes.string.isRequired,
  row: PropTypes.shape({
    run: PropTypes.string.isRequired,
    original: PropTypes.shape({
      run: PropTypes.string.isRequired,
      course_name: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};
