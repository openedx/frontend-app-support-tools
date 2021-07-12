import React, {
  useMemo, useState, useCallback, useRef, useLayoutEffect, useContext, useEffect,
} from 'react';
import PropTypes from 'prop-types';

import {
  Button, Collapsible, Modal, TransitionReplace,
} from '@edx/paragon';
import { camelCaseObject, getConfig } from '@edx/frontend-platform';
import EntitlementForm from './EntitlementForm';
import { CREATE, REISSUE, EXPIRE } from './EntitlementActions';
import PageLoading from '../../components/common/PageLoading';
import Table from '../../Table';
import CourseSummary from '../courseSummary/CourseSummary';
import { getEntitlements } from '../data/api';
import UserMessagesContext from '../../userMessages/UserMessagesContext';
import { formatDate, sort } from '../../utils';
import AlertList from '../../userMessages/AlertList';

export default function Entitlements({
  changeHandler, user, expanded,
}) {
  const { add, clear } = useContext(UserMessagesContext);
  const [sortColumn, setSortColumn] = useState('created');
  const [sortDirection, setSortDirection] = useState('desc');
  const [formType, setFormType] = useState(null);
  const [userEntitlement, setUserEntitlement] = useState(undefined);
  const [courseSummaryUUID, setCourseSummaryUUID] = useState(null);
  const [entitlementData, setEntitlementData] = useState(null);
  const [entitlementDetailModalIsOpen, setEntitlementDetailModalIsOpen] = useState(false);
  const [entitlementSupportDetailsTitle, setEntitlementSupportDetailsTitle] = useState('');
  const [entitlementSupportDetails, setEntitlementSupportDetails] = useState([]);
  const formRef = useRef(null);
  const summaryRef = useRef(null);

  useEffect(() => {
    clear('entitlements');
    getEntitlements(user).then((result) => {
      const camelCaseResult = camelCaseObject(result);
      if (camelCaseResult.errors) {
        camelCaseResult.errors.forEach(error => add(error));
        setEntitlementData({ results: [] });
      } else {
        setEntitlementData(camelCaseResult);
      }
    });
  }, [user]);

  useLayoutEffect(() => {
    if (formType != null) {
      formRef.current.focus();
    }
  });

  // Modal to display Support Details for each Entitlement
  const openEntitlementsSupportDetailsModal = (title, supportDetails) => {
    const tableData = supportDetails.map(supportDetail => ({
      action: supportDetail.action,
      comments: supportDetail.comments,
      actionCreated: formatDate(supportDetail.created),
      supportUser: supportDetail.supportUser,
      unenrolledRun: supportDetail.unenrolledRun,
    }));
    setEntitlementSupportDetails(tableData);
    setEntitlementSupportDetailsTitle(title);
    setEntitlementDetailModalIsOpen(true);
  };

  const tableData = useMemo(() => {
    if (entitlementData === null) {
      return [];
    }
    return entitlementData.results.map(entitlement => ({
      courseUuid: {
        displayValue: (
          <Button
            variant="outline-primary"
            onClick={() => {
              setFormType(null);
              setUserEntitlement(undefined);
              setCourseSummaryUUID(entitlement.courseUuid);
            }}
          >
            {entitlement.courseUuid}
          </Button>
        ),
        value: entitlement.courseUuid,
      },
      mode: {
        value: entitlement.mode,
      },
      enrollment: {
        displayValue: (entitlement.enrollmentCourseRun ? (
          <a
            href={`${getConfig().LMS_BASE_URL}/courses/${entitlement.enrollmentCourseRun}`}
            rel="noopener noreferrer"
            target="_blank"
          >
            {entitlement.enrollmentCourseRun}
          </a>
        ) : 'Course Run Not Selected'),
        value: entitlement.enrollmentCourseRun,
      },
      expiredAt: {
        displayValue: formatDate(entitlement.expiredAt),
        value: entitlement.expiredAt,
      },
      created: {
        displayValue: formatDate(entitlement.created),
        value: entitlement.created,
      },
      modified: {
        displayValue: formatDate(entitlement.modified),
        value: entitlement.modified,
      },
      orderNumber: {
        displayValue: (
          <a
            href={`${getConfig().ECOMMERCE_BASE_URL}/dashboard/orders/${entitlement.orderNumber}/`}
            rel="noopener noreferrer"
            target="_blank"
          >
            {entitlement.orderNumber}
          </a>
        ),
        value: entitlement.orderNumber,
      },
      actions: {
        displayValue: (
          <div>
            <Button
              id="details"
              type="button"
              variant="outline-primary"
              onClick={() => {
                openEntitlementsSupportDetailsModal('Entitlement Support Details', entitlement.supportDetails);
              }}
            >
              Details
            </Button>
            <Button
              id="reissue"
              type="button"
              variant="outline-primary mt-2 mr-2"
              disabled={Boolean(!entitlement.enrollmentCourseRun)}
              onClick={() => {
                setCourseSummaryUUID(null);
                setUserEntitlement(entitlement);
                setFormType(REISSUE);
              }}
            >
              Reissue
            </Button>
            <Button
              type="button"
              variant="outline-danger mt-2"
              disabled={Boolean(entitlement.expiredAt)}
              onClick={() => {
                setCourseSummaryUUID(null);
                setUserEntitlement(entitlement);
                setFormType(EXPIRE);
              }}
            >
              Expire
            </Button>
          </div>
        ),
        value: 'Resissue',
      },
    }));
  }, [entitlementData]);

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
      label: 'Actions', key: 'actions', columnSortable: true, onSort: () => { }, width: 'col-3',
    },
  ];

  const supportDetailsColumn = [
    {
      label: 'Action', key: 'action', width: 'col-3',
    },
    {
      label: 'Comments', key: 'comments', width: 'col-3',
    },
    {
      label: 'Action Creation Timestamp', key: 'actionCreated', width: 'col-3',
    },
    {
      label: 'Support User', key: 'supportUser', width: 'col-3',
    },
    {
      label: 'Unenrolled Run', key: 'unenrolledRun', width: 'col-3',
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
              setCourseSummaryUUID(null);
              setUserEntitlement(undefined);
              setFormType(CREATE);
            }}
          >
            Create New Entitlement
          </Button>
        )}
      </div>
      <AlertList topic="entitlements" className="mb-3" />
      <TransitionReplace>
        {formType !== null ? (
          <EntitlementForm
            key="entitlement-form"
            user={user}
            entitlement={userEntitlement}
            formType={formType}
            changeHandler={changeHandler}
            submitHandler={() => { }}
            closeHandler={() => setFormType(null)}
            forwardedRef={formRef}
          />
        ) : (<React.Fragment key="nothing" />)}
      </TransitionReplace>
      <TransitionReplace>
        {courseSummaryUUID !== null ? (
          <CourseSummary
            key="course-summary"
            courseUUID={courseSummaryUUID}
            clearHandler={() => {
              setCourseSummaryUUID(null);
            }}
            forwardedRef={summaryRef}
          />
        ) : (<React.Fragment key="nothing" />)}
      </TransitionReplace>
      <Modal
        open={entitlementDetailModalIsOpen}
        onClose={() => setEntitlementDetailModalIsOpen(false)}
        title={entitlementSupportDetailsTitle}
        id="support-details"
        body={(
          <Table
            data={entitlementSupportDetails}
            columns={supportDetailsColumn}
          />
        )}
      />
      <Collapsible title={`Entitlements (${tableData.length})`} defaultOpen={expanded}>
        {!entitlementData
          ? <PageLoading srMessage="Loading" />
          : (
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
          )}

      </Collapsible>
    </section>
  );
}

Entitlements.propTypes = {
  changeHandler: PropTypes.func.isRequired,
  user: PropTypes.string.isRequired,
  expanded: PropTypes.bool,
};

Entitlements.defaultProps = {
  expanded: false,
};
