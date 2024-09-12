import { useParams } from 'react-router-dom';
import { DataTable, TextFilter } from '@openedx/paragon';
import { EnterpriseCustomerUserDetail, LearnerCell, AdministratorCell } from './EnterpriseCustomerUserDetail';
import useCustomerUsersTableData from '../data/hooks/useCustomerUsersTableData';

const EnterpriseCustomerUsersTable = () => {
  const { id } = useParams();
  const {
    isLoading,
    enterpriseUsersTableData,
    fetchEnterpriseUsersData,
    showTable,
  } = useCustomerUsersTableData(id);

  return (
    <div>
      {showTable ? (
        <div>
          <h2>Associated users {enterpriseUsersTableData.itemCount > 0
            && <span>({enterpriseUsersTableData.itemCount})</span>}
          </h2>
          <hr />
          <DataTable
            isLoading={isLoading}
            isExpandable
            isPaginated
            manualPagination
            isFilterable
            manualFilters
            initialState={{
              pageSize: 8,
              pageIndex: 0,
              sortBy: [],
              filters: [],
            }}
            defaultColumnValues={{ Filter: TextFilter }}
            fetchData={fetchEnterpriseUsersData}
            data={enterpriseUsersTableData.results}
            itemCount={enterpriseUsersTableData.itemCount}
            pageCount={enterpriseUsersTableData.pageCount}
            columns={[
              {
                id: 'details',
                Header: 'User details',
                accessor: 'details',
                Cell: EnterpriseCustomerUserDetail,
              },
              {
                id: 'administrator',
                Header: 'Administrator',
                accessor: 'administrator',
                disableFilters: true,
                Cell: AdministratorCell,
              },
              {
                id: 'learner',
                Header: 'Learner',
                accessor: 'learner',
                disableFilters: true,
                Cell: LearnerCell,
              },
            ]}
          />
        </div>
      ) : null}
    </div>
  );
};

export default EnterpriseCustomerUsersTable;
