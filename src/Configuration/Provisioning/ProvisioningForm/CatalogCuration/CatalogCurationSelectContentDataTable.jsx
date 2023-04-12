import {
  DataTable,
  CardView,
} from '@edx/paragon';
import { connectStateResults } from 'react-instantsearch-dom';
import PropTypes from 'prop-types';
import { useState, useMemo, useEffect } from 'react';
import { camelCaseObject } from '@edx/frontend-platform';
import { useContextSelector } from 'use-context-selector';
import { FOOTER_TEXT_BY_CONTENT_TYPE } from './data/utils';
import SelectContentSelectionCheckbox from './SelectContentSelectionCheckbox';
import { MAX_PAGE_SIZE } from './data/constants';
import SelectContentSelectionStatus from './SelectContentSelectionStatus';
import SkeletonContentCard from './SkeletonContentCard';
import ContentSearchResultCard from './ContentSearchResultCard';
import SelectContentSearchPagination from './SelectContentSearchPagination';
import { CatalogCurationContext } from './CatalogCurationContext';

const defaultActiveStateValue = 'card';

const selectColumn = {
  id: 'selection',
  Header: () => null,
  Cell: SelectContentSelectionCheckbox,
  disableSortBy: true,
};

const PriceTableCell = ({ row }) => {
  const contentPrice = row.original.firstEnrollablePaidSeatPrice;
  if (!contentPrice) {
    return null;
  }
  return `$${contentPrice}`;
};

PriceTableCell.propTypes = {
  row: PropTypes.shape({
    original: PropTypes.shape({
      firstEnrollablePaidSeatPrice: PropTypes.number,
    }).isRequired,
  }).isRequired,
};

const ContentTypeTableCell = ({ row }) => FOOTER_TEXT_BY_CONTENT_TYPE[row.original.contentType.toLowerCase()];

const BaseHighlightStepperSelectContentDataTable = ({
  selectedRowIds,
  onSelectedRowsChanged,
  isSearchStalled,
  searchResults,
}) => {
  const [currentView, setCurrentView] = useState(defaultActiveStateValue);
  // TODO: searchResults contain all information before its populated into the datatable (do manual filtering here)
  const { startDate, endDate } = useContextSelector(CatalogCurationContext, v => v[0]);
  const [filteredHits, setFilteredHits] = useState([]);
  const page_size = 12;
  const page_index = searchResults?.page || 0;
  let current_index = 1;
  const window_start_index = (page_index * page_size) + 1;

  useEffect(() => {
    setFilteredHits(searchResults?.hits.filter((hit) => {
      if (current_index < window_start_index + page_size) {
        const courseStartDate = hit.advertised_course_run?.start ? new Date(hit.advertised_course_run.start) : null;
        const courseEndDate = hit.advertised_course_run?.end ? new Date(hit.advertised_course_run.end) : null;
        if (startDate && courseStartDate < new Date(startDate)) {
          return false;
        }

        if (endDate && courseEndDate > new Date(endDate)) {
          return false;
        }

        if (current_index >= window_start_index && current_index < window_start_index + page_size || (!startDate && !endDate)) {
          current_index += 1;
          return true;
        }
        current_index += 1;
        return false;
      } else {
        return false;
      }
    }));
  }, [searchResults, startDate, endDate]);

  const tableData = useMemo(() => camelCaseObject(filteredHits || []), [filteredHits, searchResults?.hits]);
  const searchResultsItemCount = searchResults?.nbHits || 0;
  const searchResultsPageCount = searchResults?.nbPages || 0;
  return (
    <DataTable
      isLoading={isSearchStalled}
      onSelectedRowsChanged={onSelectedRowsChanged}
      dataViewToggleOptions={{
        isDataViewToggleEnabled: true,
        onDataViewToggle: val => setCurrentView(val),
        defaultActiveStateValue,
        togglePlacement: 'left',
      }}
      isSelectable
      isPaginated
      manualPagination
      initialState={{
        pageIndex: 0,
        pageSize: 12,
        selectedRowIds,
      }}
      pageCount={searchResultsPageCount}
      itemCount={searchResultsItemCount}
      initialTableOptions={{
        getRowId: row => row?.aggregationKey,
        autoResetSelectedRows: false,
      }}
      data={tableData}
      manualSelectColumn={selectColumn}
      SelectionStatusComponent={SelectContentSelectionStatus}
      columns={[
        {
          Header: 'Content name',
          accessor: 'title',
        },
        {
          Header: 'Partner',
          accessor: 'partners[0].name',
        },
        {
          Header: 'Content type',
          Cell: ContentTypeTableCell,
        },
        {
          Header: 'Price',
          Cell: PriceTableCell,
        },
      ]}
    >
      <DataTable.TableControlBar />
      {currentView === 'card' && (
        <CardView
          columnSizes={{
            xs: 12,
            md: 6,
            lg: 4,
          }}
          SkeletonCardComponent={SkeletonContentCard}
          CardComponent={ContentSearchResultCard}
        />
      )}
      {currentView === 'list' && <DataTable.Table />}
      <DataTable.EmptyTable content="No results found" />
      <DataTable.TableFooter>
        <SelectContentSearchPagination />
      </DataTable.TableFooter>
    </DataTable>
  );
};

BaseHighlightStepperSelectContentDataTable.propTypes = {
  selectedRowIds: PropTypes.shape().isRequired,
  onSelectedRowsChanged: PropTypes.func.isRequired,
  isSearchStalled: PropTypes.bool.isRequired,
  searchResults: PropTypes.shape({
    hits: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    nbHits: PropTypes.number.isRequired,
    nbPages: PropTypes.number.isRequired,
  }),
};

BaseHighlightStepperSelectContentDataTable.defaultProps = {
  searchResults: null,
};

const CatalogCurationSelectContentDataTable = connectStateResults(BaseHighlightStepperSelectContentDataTable);

export default CatalogCurationSelectContentDataTable;
