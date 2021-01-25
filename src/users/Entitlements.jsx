import React, {
  useMemo, useState, useCallback, useRef, useLayoutEffect, useContext,
} from 'react';
import PropTypes from 'prop-types';

import {
  Button, Collapsible, TransitionReplace,
} from '@edx/paragon';
import { camelCaseObject, getConfig } from '@edx/frontend-platform';
import EntitlementForm, { CREATE, REISSUE } from './EntitlementForm';
import sort from './sort';
import Table from '../Table';
import CourseSummary from './CourseSummary';
import { getCourseData } from './data/api';
import UserMessagesContext from '../user-messages/UserMessagesContext';
import formatDate from '../dates/formatDate';

export default function Entitlements({
  data, changeHandler, user, expanded,
}) {
  const { add, clear } = useContext(UserMessagesContext);
  const [sortColumn, setSortColumn] = useState('created');
  const [sortDirection, setSortDirection] = useState('desc');
  const [formType, setFormType] = useState(null);
  const [entitlementToReissue, setEntitlementToReissue] = useState(undefined);
  const [courseSummaryUUID, setCourseSummaryUUID] = useState(null);
  const [courseSummaryData, setCourseSummaryData] = useState(null);
  const [courseSummaryErrors, setCourseSummaryErrors] = useState(false);
  const formRef = useRef(null);
  const summaryRef = useRef(null);

  useLayoutEffect(() => {
    if (formType != null) {
      formRef.current.focus();
    } else if (formType === null && (courseSummaryData != null || courseSummaryErrors)) {
      summaryRef.current.focus();
    }
  });

  function clearCourseSummary() {
    clear('course-summary');
    setCourseSummaryData(null);
    setCourseSummaryUUID(null);
    setCourseSummaryErrors(false);
  }

  const handleCourseSummaryDataGet = useCallback((courseUUID) => {
    if (courseUUID !== null && courseUUID !== undefined) {
      setCourseSummaryData(null);
      getCourseData(courseUUID).then((result) => {
        const camelResult = camelCaseObject(result);
        clear('course-summary');
        if (camelResult.errors) {
          camelResult.errors.forEach(error => add(error));
          setCourseSummaryErrors(true);
        } else {
          setCourseSummaryErrors(false);
          setCourseSummaryData(camelResult);
        }
      });
    }
  });

  const tableData = useMemo(() => {
    if (data === null) {
      return [];
    }
    return data.results.map(result => ({
      courseUuid: {
        displayValue: (
          <Button
            className="btn btn-link"
            onClick={() => {
              setFormType(null);
              setEntitlementToReissue(undefined);
              setCourseSummaryUUID(result.courseUuid);
              handleCourseSummaryDataGet(result.courseUuid);
            }}
          >
            {result.courseUuid}
          </Button>
        ),
        value: result.courseUuid,
      },
      mode: {
        value: result.mode,
      },
      enrollment: {
        displayValue: (result.enrollmentCourseRun ? (
          <a
            href={`${getConfig().LMS_BASE_URL}/courses/${result.enrollmentCourseRun}`}
            rel="noopener noreferrer"
            target="_blank"
          >
            {result.enrollmentCourseRun}
          </a>
        ) : 'Course Run Not Selected'),
        value: result.enrollmentCourseRun,
      },
      expiredAt: {
        displayValue: formatDate(result.expiredAt),
        value: result.expiredAt,
      },
      created: {
        displayValue: formatDate(result.created),
        value: result.created,
      },
      modified: {
        displayValue: formatDate(result.modified),
        value: result.modified,
      },
      orderNumber: {
        displayValue: (
          <a
            href={`${getConfig().ECOMMERCE_BASE_URL}/dashboard/orders/${result.orderNumber}/`}
            rel="noopener noreferrer"
            target="_blank"
          >
            {result.orderNumber}
          </a>
        ),
        value: result.orderNumber,
      },
      actions: {
        displayValue: (
          <Button
            type="button"
            disabled={!result.enrollmentCourseRun}
            onClick={() => {
              clearCourseSummary();
              setEntitlementToReissue(result);
              setFormType(REISSUE);
            }}
            className="btn-outline-primary"
          >
            Reissue
          </Button>
        ),
        value: 'Resissue',
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
      label: 'Actions', key: 'actions', columnSortable: true, onSort: () => {}, width: 'col-3',
    },
  ];

  const tableDataSortable = [...tableData];

  return (
    <section className="mb-3">
      <div className="d-flex flex-row justify-content-between mb-2">
        {!formType && (
        <Button
          type="button"
          variant="outline-primary"
          onClick={() => {
            clearCourseSummary();
            setEntitlementToReissue(undefined);
            setFormType(CREATE);
          }}
        >
          Create New Entitlement
        </Button>
        )}
      </div>
      <TransitionReplace>
        {formType !== null ? (
          <EntitlementForm
            key="entitlement-form"
            user={user}
            entitlement={entitlementToReissue}
            formType={formType}
            changeHandler={changeHandler}
            submitHandler={() => {}}
            closeHandler={() => setFormType(null)}
            forwardedRef={formRef}
          />
        ) : (<React.Fragment key="nothing" />) }
      </TransitionReplace>
      <TransitionReplace>
        {courseSummaryUUID !== null ? (
          <CourseSummary
            key="course-summary"
            courseUUID={courseSummaryUUID}
            clearHandler={() => {
              clearCourseSummary();
            }}
            courseData={courseSummaryData}
            errors={courseSummaryErrors}
            forwardedRef={summaryRef}
          />
        ) : (<React.Fragment key="nothing" />) }
      </TransitionReplace>
      <Collapsible title={`Entitlements (${tableData.length})`} defaultOpen={expanded}>
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

Entitlements.propTypes = {
  data: PropTypes.shape({
    results: PropTypes.arrayOf(PropTypes.object),
  }),
  changeHandler: PropTypes.func.isRequired,
  user: PropTypes.string.isRequired,
  expanded: PropTypes.bool,
};

Entitlements.defaultProps = {
  data: null,
  expanded: false,
};
