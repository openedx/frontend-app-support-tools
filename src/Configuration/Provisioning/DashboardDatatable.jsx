import { DataTable, Icon, IconButton } from '@edx/paragon';
import { EditOutline } from '@edx/paragon/icons';
import { useCallback, useState } from 'react';
import { useHistory } from 'react-router';
import { v4 as uuidv4 } from 'uuid';
import { sampleDataTableData } from '../testData/constants';

const DashboardDatatable = () => {
  console.log('hi');
  const history = useHistory();

  // const fetchLearnerCreditPlans = useCallback((args) => {

  // });

  const editLearnerCreditPlan = () => {
    // TODO: Navigate to the edit page for the selected learner credit plan based on UUID
    history.push(`/enterprise-configuration/learner-credit/${uuidv4()}/edit`);
  };
  const data = sampleDataTableData(
    25,
    (<IconButton
      src={EditOutline}
      iconAs={Icon}
      onClick={editLearnerCreditPlan}
    />),
  );
  const [learnerCreditCustomers] = useState(data.length > 0 ? data : []);
  return (
    <DataTable
      isPaginated
      isSortable
      initialState={{
        pageSize: 12,
        pageIndex: 0,
      }}
      itemCount={learnerCreditCustomers.length}
      pageCount={12}
      data={learnerCreditCustomers}
      columns={[
        {
          Header: 'Customer name',
          accessor: 'customerName',
        },
        {
          Header: 'Start date',
          accessor: 'startDate',
        },
        {
          Header: 'End date',
          accessor: 'endDate',
        },
        {
          Header: '',
          accessor: 'actions',
        },
      ]}
    />
  );
};

export default DashboardDatatable;
