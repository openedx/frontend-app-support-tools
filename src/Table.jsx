/* eslint-disable max-len */
import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { Button } from '@edx/paragon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSortDown, faSortUp } from '@fortawesome/free-solid-svg-icons';

export default class Table extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      sortedColumn: props.tableSortable ? this.props.defaultSortedColumn : '',
      sortDirection: props.tableSortable ? this.props.defaultSortDirection : '',
    };

    this.onSortClick = this.onSortClick.bind(this);
  }

  onSortClick(columnKey) {
    let newDirection = 'desc';

    if (this.state.sortedColumn === columnKey) {
      newDirection = (this.state.sortDirection === 'desc' ? 'asc' : 'desc');
    }

    this.setState({
      sortedColumn: columnKey,
      sortDirection: newDirection,
    });

    const currentlySortedColumn = this.props.columns.find(column => (columnKey === column.key));
    currentlySortedColumn.onSort(newDirection);
  }

  getCaption() {
    return this.props.caption && (
      <caption>{this.props.caption}</caption>
    );
  }

  getSortButtonScreenReaderText(columnKey) {
    let text;

    if (this.state.sortedColumn === columnKey) {
      text = this.props.sortButtonsScreenReaderText[this.state.sortDirection];
    } else {
      text = this.props.sortButtonsScreenReaderText.defaultText;
    }

    return text;
  }

  getSortIcon(sortDirection) {
    if (sortDirection === '') {
      return null;
    }

    return (
      <FontAwesomeIcon icon={sortDirection === 'asc' ? faSortUp : faSortDown} />
    );
  }

  getTableHeading(column) {
    let heading;
    if (this.props.tableSortable && column.columnSortable) {
      heading = (
        <Button
          className="btn-header"
          onClick={() => this.onSortClick(column.key)}
        >
          <span>
            {column.label}
            <span className={classNames('sr-only')}>
              {' '}
              {this.getSortButtonScreenReaderText(column.key)}
            </span>
            {' '}
            {this.getSortIcon(column.key === this.state.sortedColumn ? this.state.sortDirection : '')}
          </span>
        </Button>
      );
    } else if (column.hideHeader) {
      heading = (<span className={classNames('sr-only')}>{column.label}</span>);
    } else {
      heading = column.label;
    }

    return heading;
  }

  getHeadings() {
    return (
      <thead
        className={classNames(
          ...this.props.headingClassName,
          { 'd-inline': this.props.hasFixedColumnWidths },
        )}
      >
        <tr className={classNames({ 'd-flex': this.props.hasFixedColumnWidths })}>
          {this.props.columns.map(col => (
            <th
              className={classNames(
                { sortable: this.props.tableSortable && col.columnSortable },
                this.props.hasFixedColumnWidths ? col.width : null,
              )}
              key={col.key}
              scope="col"
            >
              {this.getTableHeading(col)}
            </th>
          ))}
        </tr>
      </thead>
    );
  }

  getBody() {
    return (
      <tbody className={classNames({ 'd-inline': this.props.hasFixedColumnWidths })}>
        {this.props.data.map((row, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <tr key={i} className={classNames({ 'd-flex': this.props.hasFixedColumnWidths })}>
            {this.props.columns.map(({ key, width }) => (
              React.createElement(
                (key === this.props.rowHeaderColumnKey) ? 'th' : 'td',
                {
                  key,
                  className: classNames(this.props.hasFixedColumnWidths ? width : null),
                  scope: (key === this.props.rowHeaderColumnKey) ? 'row' : null,
                },
                this.getDisplayValue(row[key]),
              )
            ))}
          </tr>
        ))}
      </tbody>
    );
  }

  /*
  *  If the element is a non null object, returns the display value for renderinng associated with
  *  it if it has one, falling back on the internal value.
  *  In all other cases, just renders the element as is.
  */
  getDisplayValue(element) {
    if (typeof element === 'object' && element !== null) {
      const { displayValue, value } = element;
      return displayValue || value;
    }
    return element;
  }


  render() {
    return (
      <table className={classNames(
        'table',
        this.props.className,
      )}
      >
        {this.getCaption()}
        {this.getHeadings()}
        {this.getBody()}
      </table>
    );
  }
}

Table.propTypes = {
  caption: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
  ]),
  className: PropTypes.string,
  /** specifies the order and contents of the table's columns and provides display strings for each column's heading. It is composed of an ordered array of objects. Each object contains the following keys:

1. `label` (string or element; required) contains the display string for each column's heading.
2. `key` (string; required) maps that label to its corresponding datum for each row in `data`, to ensure table data are displayed in their appropriate columns.
3. `columnSortable` (boolean; optional) specifies at the column-level whether the column is sortable. If `columnSortable` is `true`, a sort button will be rendered in the column table heading. It is only required if `tableSortable` is set to `true`.
4. `onSort` (function; conditionally required) specifies what function is called when a sortable column is clicked. It is only required if the column's `columnSortable` is set to `true`.
5. `hideHeader` (boolean; optional) specifies at the column-level whether the column label is visible. A column that is sortable cannot have its label be hidden.
6. `width` (string; conditionally required) only if `hasFixedColumnWidths` is set to `true`, the `<td>` elements' `class` attributes will be set to this value. This allows restricting columns to specific widths. See [Bootstrap's grid documentation](https://getbootstrap.com/docs/4.0/layout/grid/) for `col` class names that can be used.

The order of objects in `columns` specifies the order of the columns in the table. */
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  /** specifies the order and contents of the table's columns and provides display strings for each column's heading. It is composed of an ordered array of objects. Each object contains the following keys:

1. `label` (string or element; required) contains the display string for each column's heading.
2. `key` (string; required) maps that label to its corresponding datum for each row in `data`, to ensure table data are displayed in their appropriate columns.
3. `columnSortable` (boolean; optional) specifies at the column-level whether the column is sortable. If `columnSortable` is `true`, a sort button will be rendered in the column table heading. It is only required if `tableSortable` is set to `true`.
4. `onSort` (function; conditionally required) specifies what function is called when a sortable column is clicked. It is only required if the column's `columnSortable` is set to `true`.
5. `hideHeader` (boolean; optional) specifies at the column-level whether the column label is visible. A column that is sortable cannot have its label be hidden.
6. `width` (string; conditionally required) only if `hasFixedColumnWidths` is set to `true`, the `<td>` elements' `class` attributes will be set to this value. This allows restricting columns to specific widths. See [Bootstrap's grid documentation](https://getbootstrap.com/docs/4.0/layout/grid/) for `col` class names that can be used.

The order of objects in `columns` specifies the order of the columns in the table. */
  columns: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string.isRequired,
    label: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.element,
    ]).isRequired,
    columnSortable: PropTypes.bool,
    onSort: PropTypes.func,
    hideHeader: PropTypes.bool,
    width: PropTypes.string,
  })).isRequired,
  /** Specifies Bootstrap class names to apply to the table heading. Options are detailed in [Bootstrap's docs](https://getbootstrap.com/docs/4.0/content/tables/#table-head-options).
 */
  headingClassName: PropTypes.arrayOf(PropTypes.string),
  /** Specifies whether the table is sortable. This setting supercedes column-level sortability, so if it is `false`, no sortable components will be rendered. */
  tableSortable: PropTypes.bool,
  /** Specifies whether the table's columns have fixed widths. Every element in `columns` must define a `width` if this is `true`.
 */
  hasFixedColumnWidths: PropTypes.bool,
  /* eslint-disable react/require-default-props */
  /** Specifies the key of the column that is sorted by default. It is only required if `tableSortable` is set to `true`. */
  defaultSortedColumn: PropTypes.string,
  /* eslint-disable react/require-default-props */
  /** Specifies the direction the `defaultSortedColumn` is sorted in by default; it will typically be either 'asc' or 'desc'. It is only required if `tableSortable` is set to `true`. */
  defaultSortDirection: PropTypes.string,
  /** Specifies the screen reader only text that accompanies the sort buttons for sortable columns. It takes the form of an object containing the following keys:

1. `asc`: (string) specifies the screen reader only text for sort buttons in the ascending state.
2. `desc`: (string) specifies the screen reader only text for sort buttons in the descending state.
3. `defaultText`: (string) specifies the screen reader only text for sort buttons that are not engaged.

It is only required if `tableSortable` is set to `true`.

Default:

```javascript
{
  asc: 'sort ascending',
  desc: 'sort descending',
  defaultText: 'click to sort',
}
``` */
  sortButtonsScreenReaderText: PropTypes.shape({
    asc: PropTypes.string,
    desc: PropTypes.string,
    defaultText: PropTypes.string,
  }),
  /** Specifies the key for the column that should act as a row header. Rather than rendering as `<td>` elements,
cells in this column will render as `<th scope="row">`  */
  rowHeaderColumnKey: PropTypes.string,
};

Table.defaultProps = {
  caption: null,
  className: undefined,
  headingClassName: [],
  tableSortable: false,
  hasFixedColumnWidths: false,
  sortButtonsScreenReaderText: {
    asc: 'sort ascending',
    desc: 'sort descending',
    defaultText: 'click to sort',
  },
};
