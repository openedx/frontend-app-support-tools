import React, {
  useMemo, useState, useCallback, useEffect, useContext,
} from 'react';
import PropTypes from 'prop-types';

import {
  Hyperlink,
} from '@openedx/paragon';
import { camelCaseObject } from '@edx/frontend-platform';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import PageLoading from '../../components/common/PageLoading';
import Table from '../../components/Table';
import { getOrderHistory } from '../data/api';
import UserMessagesContext from '../../userMessages/UserMessagesContext';
import { formatDate } from '../../utils';
import AlertList from '../../userMessages/AlertList';

export default function OrderHistory({
  username,
}) {
  const { add, clear } = useContext(UserMessagesContext);
  const [orderHistoryData, setOrderHistoryData] = useState(null);

  useEffect(() => {
    if (orderHistoryData === null) {
      clear('orderHistory');
      getOrderHistory(username).then((result) => {
        const camelCaseResult = camelCaseObject(result);
        if (camelCaseResult.errors) {
          camelCaseResult.errors.forEach(error => add(error));
          setOrderHistoryData([]);
        } else {
          setOrderHistoryData(camelCaseResult);
        }
      });
    }
  }, [username, orderHistoryData]);

  const tableData = useMemo(() => {
    if (orderHistoryData === null) {
      return [];
    }
    return orderHistoryData.map(result => ({
      expander: result.lines.map(line => ({
        product: (
          <Hyperlink
            target="_blank"
            destination={line.product.url}
          >
            {line.product.title}
          </Hyperlink>
        ),
        quantity: line.quantity,
        lineStatus: line.status,
        expires: line.product.expires,
        certificateType: line.product.attributeValues[0].value,
      })),
      orderStatus: result.status,
      orderNumber: result.number,
      datePlaced: result.datePlaced,
      productTracking: result.productTracking,
    }));
  }, [orderHistoryData]);

  const expandAllRowsHandler = ({ getToggleAllRowsExpandedProps, isAllRowsExpanded }) => (
    <a {...getToggleAllRowsExpandedProps()} className="link-primary">
      {isAllRowsExpanded ? 'Collapse All' : 'Expand All'}
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
        Header: 'Order Status', accessor: 'orderStatus', sortable: true,
      },
      {
        Header: 'Order Number', accessor: 'orderNumber', sortable: true,
      },
      {
        Header: 'Date Placed', accessor: 'datePlaced', Cell: ({ value }) => formatDate(value), sortable: true,
      },
      {
        Header: 'Product Tracking', accessor: 'productTracking', sortable: true,
      },
    ],
    [],
  );

  const supportDetailsColumn = React.useMemo(
    () => [
      {
        Header: 'Product', accessor: 'product', sortable: true,
      },
      {
        Header: 'Quantity', accessor: 'quantity', sortable: true,
      },
      {
        Header: 'Line Status', accessor: 'lineStatus', sortable: true,
      },
      {
        Header: 'Expire Date', accessor: 'expires', Cell: ({ value }) => formatDate(value), sortable: true,
      },
      {
        Header: 'Certificate Type', accessor: 'certificateType', sortable: true,
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
      <h3 className="ml-4 mr-auto">Order History ({tableData.length})</h3>

      <AlertList topic="orderHistory" className="mb-3" />

      {!orderHistoryData
        ? <PageLoading srMessage="Loading" />
        : (
          <Table
            columns={columns}
            data={tableData}
            renderRowSubComponent={renderRowSubComponent}
            styleName={tableData.length === 1 ? 'custom-table mb-60' : 'custom-table'}
          />
        )}
    </section>
  );
}

OrderHistory.propTypes = {
  username: PropTypes.string.isRequired,
};
