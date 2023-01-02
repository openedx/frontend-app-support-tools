import React, {
  useMemo, useState, useCallback, useRef, useLayoutEffect, useContext, useEffect,
} from 'react';
import PropTypes from 'prop-types';

import {
  Button, TransitionReplace, Dropdown, Hyperlink,
} from '@edx/paragon';
import { camelCaseObject, getConfig } from '@edx/frontend-platform';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import EntitlementForm from './EntitlementForm';
import { CREATE, REISSUE, EXPIRE } from './EntitlementActions';
import PageLoading from '../../components/common/PageLoading';
import CourseSummary from '../courseSummary/CourseSummary';
import Table from '../../components/Table';
import { getEntitlements } from '../data/api';
import UserMessagesContext from '../../userMessages/UserMessagesContext';
import { formatDate } from '../../utils';
import AlertList from '../../userMessages/AlertList';

export default function Entitlements({
  user,
  searchStr,
}) {
  const { add, clear } = useContext(UserMessagesContext);
  const [formType, setFormType] = useState(null);
  const [userEntitlement, setUserEntitlement] = useState(undefined);
  const [courseSummaryUUID, setCourseSummaryUUID] = useState(null);
  const [entitlementData, setEntitlementData] = useState(null);
  const formRef = useRef(null);

  const changeHandler = () => setEntitlementData(null);

  useEffect(() => {
    if (entitlementData === null) {
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
    }
  }, [user, entitlementData]);

  const tableData = useMemo(() => {
    if (entitlementData === null) {
      return [];
    }
    return entitlementData.results.filter(
      entitlement => (entitlement.courseUuid.toLowerCase().includes(searchStr)
          || (entitlement.enrollmentCourseRun && entitlement.enrollmentCourseRun.toLowerCase().includes(searchStr))),
    ).map(entitlement => ({
      expander: entitlement.supportDetails.map(supportDetail => ({
        action: supportDetail.action,
        comments: supportDetail.comments,
        actionCreated: supportDetail.created,
        supportUser: supportDetail.supportUser,
        unenrolledRun: supportDetail.unenrolledRun,
      })),
      courseUuid: entitlement.courseUuid,
      courseSummary: (
        <Hyperlink
          destination=""
          target="_blank"
          showLaunchIcon={false}
          onClick={(event) => {
            event.preventDefault();
            setFormType(null);
            setUserEntitlement(undefined);
            setCourseSummaryUUID(entitlement.courseUuid);
          }}
        >
          See Details
        </Hyperlink>
      ),
      enrollmentCourseRun: (entitlement.enrollmentCourseRun ? (
        <a
          href={`${getConfig().LMS_BASE_URL}/courses/${entitlement.enrollmentCourseRun}`}
          rel="noopener noreferrer"
          target="_blank"
        >
          {entitlement.enrollmentCourseRun}
        </a>
      ) : 'Course Run Not Selected'),
      expiredAt: entitlement.expiredAt,
      created: entitlement.created,
      modified: entitlement.modified,
      orderNumber: (
        <a
          href={`${getConfig().ECOMMERCE_BASE_URL}/dashboard/orders/${entitlement.orderNumber}/`}
          rel="noopener noreferrer"
          target="_blank"
        >
          {entitlement.orderNumber}
        </a>
      ),
      mode: entitlement.mode,
      actions: (
        <Dropdown>
          <Dropdown.Toggle variant="sm">
            Actions
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item
              onClick={() => {
                setCourseSummaryUUID(null);
                setUserEntitlement(entitlement);
                setFormType(REISSUE);
              }}
              // disable if entitlement has no associated course run
              disabled={Boolean(!entitlement.enrollmentCourseRun)}
              className="small"
            >
              Reissue
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => {
                setCourseSummaryUUID(null);
                setUserEntitlement(entitlement);
                setFormType(EXPIRE);
              }}
              disabled={Boolean(entitlement.expiredAt)}
              className="small"
            >
              Expire
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>

      ),
    }));
  }, [entitlementData, searchStr]);

  useLayoutEffect(() => {
    if (formType != null) {
      formRef.current.focus();
    }
  });

  const expandAllRowsHandler = ({ getToggleAllRowsExpandedProps, isAllRowsExpanded }) => (
    <a {...getToggleAllRowsExpandedProps()} className="link-primary">
      { isAllRowsExpanded ? 'Collapse All' : 'Expand All' }
    </a>
  );
  expandAllRowsHandler.propTypes = {
    getToggleAllRowsExpandedProps: PropTypes.func.isRequired,
    isAllRowsExpanded: PropTypes.bool.isRequired,
  };

  const rowExpandHandler = ({ row }) => (
    // We can use the getToggleRowExpandedProps prop-getter
    // to build the expander.
    <div className="text-center">
      <span {...row.getToggleRowExpandedProps()}>
        {row.isExpanded ? (
          <FontAwesomeIcon icon={faMinus} />
        ) : <FontAwesomeIcon icon={faPlus} />}
      </span>
    </div>
  );

  rowExpandHandler.propTypes = {
    row: PropTypes.shape({
      isExpanded: PropTypes.bool,
      getToggleRowExpandedProps: PropTypes.func,
    }).isRequired,
  };

  const columns = React.useMemo(
    () => [
      {
        // Make an expander column
        Header: expandAllRowsHandler,
        id: 'expander',
        Cell: rowExpandHandler, // Use Cell to render an expander for each row.
      },
      {
        Header: 'Course UUID', accessor: 'courseUuid', sortable: true,
      },
      {
        Header: 'Course Run ID', accessor: 'enrollmentCourseRun', sortable: true,
      },
      {
        Header: 'Course Summary', accessor: 'courseSummary',
      },
      {
        Header: 'Expiration Date', accessor: 'expiredAt', Cell: ({ value }) => formatDate(value), sortable: true,
      },
      {
        Header: 'Date Created', accessor: 'created', Cell: ({ value }) => formatDate(value), sortable: true,
      },
      {
        Header: 'Date Modified', accessor: 'modified', Cell: ({ value }) => formatDate(value), sortable: true,
      },
      {
        Header: 'Order', accessor: 'orderNumber', sortable: true,
      },
      {
        Header: 'Mode', accessor: 'mode', sortable: true,
      },
      {
        Header: 'Actions', accessor: 'actions',
      },
    ],
    [],
  );

  const supportDetailsColumn = React.useMemo(
    () => [
      {
        Header: 'Action', accessor: 'action', sortable: true,
      },
      {
        Header: 'Comments', accessor: 'comments', sortable: true,
      },
      {
        Header: 'Action Creation Timestamp', accessor: 'actionCreated', Cell: ({ value }) => formatDate(value), sortable: true,
      },
      {
        Header: 'Support User', accessor: 'supportUser', sortable: true,
      },
      {
        Header: 'Unenrolled Run', accessor: 'unenrolledRun', sortable: true,
      },
    ],
    [],
  );

  const renderRowSubComponent = useCallback(
    ({ row }) => (
      <Table
        // eslint-disable-next-line react/prop-types
        data={row.original.expander}
        columns={supportDetailsColumn}
        styleName="custom-expander-table"
      />
    ),
    [],
  );

  return (
    <section className="mb-3">
      <div className="row">
        <h3 className="ml-4 mr-auto">Entitlements ({tableData.length})</h3>
        <Button
          id="create-enrollment-button"
          type="button"
          variant="outline-primary mr-4"
          size="sm"
          onClick={() => {
            setCourseSummaryUUID(null);
            setUserEntitlement(undefined);
            setFormType(CREATE);
          }}
        >
          Create New Entitlement
        </Button>
      </div>

      {!entitlementData
        ? <PageLoading srMessage="Loading" />
        : (
          <Table
            columns={columns}
            data={tableData}
            renderRowSubComponent={renderRowSubComponent}
            styleName={tableData.length === 1 ? 'custom-table mb-60' : 'custom-table'}
          />
        )}

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
            courseUUID={courseSummaryUUID}
            closeHandler={() => {
              setCourseSummaryUUID(null);
            }}
          />
        ) : (<React.Fragment key="nothing" />)}
      </TransitionReplace>
    </section>
  );
}

Entitlements.propTypes = {
  user: PropTypes.string.isRequired,
  searchStr: PropTypes.string,
};

Entitlements.defaultProps = {
  searchStr: '',
};
