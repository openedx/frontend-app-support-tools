import { useParams } from 'react-router-dom';
import { Container, DataTable, TextFilter } from '@openedx/paragon';
import { EnterpriseCustomerUserDetail, LearnerCell, AdministratorCell } from './EnterpriseCustomerUserDetail';
import useEnterpriseUsersTableData from '../data/hooks/useCustomerUsersTableData';

const EnterpriseCustomerUsersTable = () => {
  const { id } = useParams();
  const {
    isLoading,
    enterpriseUsersTableData,
    fetchEnterpriseUsersData,
  } = useEnterpriseUsersTableData(id);
  return (
    <Container>
      <h2>Associated users ({ enterpriseUsersTableData.itemCount })</h2>
      <hr />
        <DataTable
          isLoading={isLoading}
          isExpandable
          isSortable
          manualSortBy
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
              id: 'userDetails',
              Header: 'User details',
              accessor: 'userDetails',
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
    </Container>
  );
};

export default EnterpriseCustomerUsersTable;