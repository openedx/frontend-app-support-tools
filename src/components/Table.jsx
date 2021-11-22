import React from 'react';
import { useTable, useExpanded, useSortBy } from 'react-table';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSortDown, faSortUp } from '@fortawesome/free-solid-svg-icons';

export default function Table({
  columns, data, renderRowSubComponent, styleName, isResponsive, defaultSortColumn,
}) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    visibleColumns,
  } = useTable(
    {
      columns,
      data,
      initialState: {
        sortBy: defaultSortColumn,
      },
    },
    useSortBy,
    useExpanded, // Using useExpanded to track the expanded state
  );

  return (
    <div className={isResponsive ? 'table-responsive' : ''}>
      <table {...getTableProps()} className={styleName}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps(column.sortable && column.getSortByToggleProps())}>
                  {column.render('Header')}
                  <span>
                    {/* eslint-disable-next-line no-nested-ternary */}
                    {column.isSorted
                      ? column.isSortedDesc
                        ? <FontAwesomeIcon icon={faSortDown} />
                        : <FontAwesomeIcon icon={faSortUp} />
                      : ''}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <React.Fragment {...row.key}>
                <tr>
                  {row.cells.map(cell => (
                    <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                  ))}
                </tr>
                {/*
                    If the row is in an expanded state, render a row with a
                    column that fills the entire length of the table.
                  */}
                {row.isExpanded ? (
                  <tr>
                    <td colSpan={visibleColumns.length}>
                      {/*
                          Inside it, call our renderRowSubComponent function. In reality,
                          you could pass whatever you want as props to
                          a component like this, including the entire
                          table instance.
                          it's merely a rendering option we created for ourselves
                        */}
                      {renderRowSubComponent({ row })}
                    </td>
                  </tr>
                ) : null}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
      <br />
    </div>
  );
}

Table.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.shape({
    Header: PropTypes.string.isRequired,
    accessor: PropTypes.string.isRequired,
    sortable: PropTypes.bool,
  })).isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  renderRowSubComponent: PropTypes.func,
  styleName: PropTypes.string,
  isResponsive: PropTypes.bool,
  defaultSortColumn: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    desc: PropTypes.bool,
  })),
};

Table.defaultProps = {
  renderRowSubComponent: null,
  styleName: null,
  isResponsive: true,
  defaultSortColumn: [],
};
