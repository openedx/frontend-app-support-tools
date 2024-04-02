/* eslint-disable react/no-unstable-nested-components */

import React, {
  useMemo,
  useState,
  useCallback,
  useRef,
  useLayoutEffect,
  useEffect,
  useContext,
} from 'react';

import {
  Button, TransitionReplace, Dropdown,
} from '@edx/paragon';
import { camelCaseObject, getConfig } from '@edx/frontend-platform';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import Certificates from './Certificates';
import EnrollmentForm from './EnrollmentForm';
import { CREATE, CHANGE } from './constants';
import PageLoading from '../../components/common/PageLoading';
import UserMessagesContext from '../../userMessages/UserMessagesContext';
import Table from '../../components/Table';
import { formatBoolean, formatDate } from '../../utils';
import { getEnrollments } from '../data/api';
import AlertList from '../../userMessages/AlertList';

export default function Enrollments({
  user,
  searchStr,
}) {
  const { add, clear } = useContext(UserMessagesContext);
  const [formType, setFormType] = useState(null);
  const [enrollmentData, setEnrollmentData] = useState(null);
  const [enrollmentToChange, setEnrollmentToChange] = useState(undefined);
  const [selectedCourseId, setSelectedCourseId] = useState(undefined);
  const formRef = useRef(null);

  const changeHandler = () => setEnrollmentData(null);

  useEffect(() => {
    if (enrollmentData === null) {
      clear('enrollments');
      getEnrollments(user).then((result) => {
        const camelCaseResult = camelCaseObject(result);
        if (camelCaseResult.errors) {
          camelCaseResult.errors.forEach(error => add(error));
          setEnrollmentData([]);
        } else {
          setEnrollmentData(camelCaseResult);
        }
      });
    }
  }, [user, enrollmentData]);

  const tableData = useMemo(() => {
    if (enrollmentData === null || enrollmentData.length === 0) {
      return [];
    }
    return enrollmentData.filter(
      enrollment => (enrollment.courseId.toLowerCase().includes(searchStr)
              || enrollment.courseName.toLowerCase().includes(searchStr)),
    ).map(enrollment => ({
      expander: {
        lastModified: enrollment.manualEnrollment ? enrollment.manualEnrollment.timeStamp : 'N/A',
        lastModifiedBy: enrollment.manualEnrollment && enrollment.manualEnrollment.enrolledBy ? enrollment.manualEnrollment.enrolledBy : 'N/A',
        reason: enrollment.manualEnrollment && enrollment.manualEnrollment.reason ? enrollment.manualEnrollment.reason : 'N/A',
        orderNumber: enrollment.orderNumber,
      },
      enterpriseCourseEnrollments: enrollment.enterpriseCourseEnrollments?.map((ece => ({
        enterpriseCustomerName: ece.enterpriseCustomerName,
        consentProvided: formatBoolean(ece.dataSharingConsent?.consentProvided),
        consentRequired: formatBoolean(ece.dataSharingConsent?.consentRequired),
        license: ece.license?.uuid ?? 'N/A',
        isLicenseRevoked: formatBoolean(ece.license?.isRevoked),
      }))),
      courseId: enrollment.courseId,
      courseName: enrollment.courseName,
      courseStart: enrollment.courseStart,
      courseEnd: enrollment.courseEnd,
      upgradeDeadline: enrollment.verifiedUpgradeDeadline,
      created: enrollment.created,
      pacingType: enrollment.pacingType,
      active: formatBoolean(enrollment.isActive),
      mode: enrollment.mode,
      actions: (
        <Dropdown>
          <Dropdown.Toggle variant="sm">
            Actions
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item
              onClick={() => {
                setEnrollmentToChange(enrollment);
                setFormType(CHANGE);
              }}
              className="small"
            >
              Change Enrollment
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => {
                setSelectedCourseId(enrollment.courseId);
              }}
              className="small"
            >
              View Certificate
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      ),
    }));
  }, [enrollmentData, searchStr]);

  const defaultSortColumn = [{
    id: 'enrollmentDate',
    desc: true,
  }];

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
      { // eslint-disable-next-line react/prop-types
        Header: 'Course Run ID', accessor: 'courseId', Cell: ({ value }) => <a href={`${getConfig().LMS_BASE_URL}/courses/${value}`} rel="noopener noreferrer" target="_blank" className="word_break">{value}</a>, sortable: true,
      },
      {
        Header: 'Course Title', accessor: 'courseName', sortable: true,
      },
      {
        Header: 'Course Start', accessor: 'courseStart', Cell: ({ value }) => formatDate(value), sortable: true,
      },
      {
        Header: 'Course End', accessor: 'courseEnd', Cell: ({ value }) => formatDate(value), sortable: true,
      },
      {
        Header: 'Upgrade Deadline', accessor: 'upgradeDeadline', Cell: ({ value }) => formatDate(value), sortable: true,
      },
      {
        Header: 'Enrollment Date', accessor: 'created', Cell: ({ value }) => formatDate(value), sortable: true, id: 'enrollmentDate',
      },
      {
        Header: 'Pacing Type', accessor: 'pacingType', sortable: true,
      },
      {
        Header: 'Mode', accessor: 'mode', sortable: true,
      },
      {
        Header: 'Active', accessor: 'active', sortable: true,
      },
      {
        Header: 'Actions', accessor: 'actions',
      },
    ],
    [],
  );

  const extraColumns = React.useMemo(
    () => [
      {
        Header: 'Last Modified', accessor: 'lastModified', Cell: ({ value }) => formatDate(value),
      },
      {
        Header: 'Last Modified By', accessor: 'lastModifiedBy',
      },
      {
        Header: 'Reason', accessor: 'reason',
      },
      {
        Header: 'Order Number',
        accessor: 'orderNumber',
        // eslint-disable-next-line react/prop-types
        Cell: ({ value }) => (
          <a
            href={
              getConfig().COMMERCE_COORDINATOR_ORDER_DETAILS_URL
                ? `${getConfig().COMMERCE_COORDINATOR_ORDER_DETAILS_URL}/?order_number=${value}`
                : `${getConfig().ECOMMERCE_BASE_URL}/dashboard/orders/${value}`
            }
            rel="noopener noreferrer"
            target="_blank"
            className="word_break"
          >
            {value}
          </a>
        ),
      },
    ],
    [],
  );

  const enterpriseCourseEnrollmentColumns = [
    {
      Header: 'Enterprise Name',
      accessor: 'enterpriseCustomerName',
    },
    {
      Header: 'Data Sharing Consent Provided',
      accessor: 'consentProvided',
    },
    {
      Header: 'Data Sharing Consent Required',
      accessor: 'consentRequired',
    },
    {
      Header: 'License',
      accessor: 'license',
    },
    {
      Header: 'License Revoked',
      accessor: 'isLicenseRevoked',
    },
  ];

  /* eslint-disable react/prop-types */
  const renderRowSubComponent = useCallback(
    ({ row }) => (
      <>
        <Table
          data={[row.original.expander]}
          columns={extraColumns}
          styleName="custom-expander-table"
        />
        {row.original.enterpriseCourseEnrollments?.length > 0 && (
          <>
            <hr />
            <div className="custom-expander-table">
              <h4 className="my-3">Enterprise Course Enrollments {`(${row.original.enterpriseCourseEnrollments.length})`}</h4>
              <Table
                data={row.original.enterpriseCourseEnrollments}
                columns={enterpriseCourseEnrollmentColumns}
              />
            </div>
          </>
        )}
      </>
    ),
    [],
  );
  /* eslint-enable react/prop-types */

  return (
    <section className="mb-3">
      <div className="row">
        <h3 className="ml-4 mr-auto">Enrollments ({tableData.length})</h3>
        <Button
          id="create-enrollment-button"
          type="button"
          variant="outline-primary mr-4"
          size="sm"
          onClick={() => {
            setEnrollmentToChange(undefined);
            setFormType(CREATE);
          }}
        >
          Create New Enrollment
        </Button>
      </div>
      {enrollmentData
        ? (
          <Table
            columns={columns}
            data={tableData}
            renderRowSubComponent={renderRowSubComponent}
            styleName={tableData.length === 1 ? 'custom-table mb-60' : 'custom-table'}
            defaultSortColumn={defaultSortColumn}
          />
        )
        : <PageLoading srMessage="Loading" />}

      <AlertList topic="enrollments" className="mb-3" />
      <TransitionReplace>
        {formType != null ? (
          <EnrollmentForm
            key="enrollment-form"
            enrollment={enrollmentToChange}
            formType={formType}
            user={user}
            submitHandler={() => {}}
            changeHandler={changeHandler}
            closeHandler={() => setFormType(null)}
            forwardedRef={formRef}
          />
        ) : (<React.Fragment key="nothing" />) }
      </TransitionReplace>
      <TransitionReplace>
        {selectedCourseId !== undefined ? (
          <Certificates
            key="certificates-data"
            closeHandler={() => setSelectedCourseId(undefined)}
            courseId={selectedCourseId}
            username={user}
          />
        ) : (<React.Fragment key="nothing" />) }
      </TransitionReplace>
    </section>
  );
}

Enrollments.propTypes = {
  user: PropTypes.string.isRequired,
  searchStr: PropTypes.string,
};

Enrollments.defaultProps = {
  searchStr: '',
};
