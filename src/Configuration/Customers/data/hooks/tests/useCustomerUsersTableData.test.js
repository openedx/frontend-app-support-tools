import { renderHook, waitFor } from '@testing-library/react';

import LmsApiService from '../../../../../data/services/EnterpriseApiService';
import useCustomerUsersTableData from '../useCustomerUsersTableData';

jest.mock('../../../../../data/services/EnterpriseApiService');
const TEST_ENTERPRISE_UUID = 'test-enterprise-uuid';

describe('useCustomerUsersTableData', () => {
  it('should only search if user input is more than 3 characters', async () => {
    const args = {
      enterpriseUuid: TEST_ENTERPRISE_UUID,
    };
    const { result } = renderHook(() => useCustomerUsersTableData(args));
    const { enterpriseUsersTableData } = result.current;
    expect(enterpriseUsersTableData).toEqual({ itemCount: 0, pageCount: 0, results: [] });

    // shouldn't fetch because its only 2 characters
    const searchArgs1 = {
      filters: [{ id: 'details', value: 'vi' }],
      sortBy: [{}],
    };
    result.current.fetchEnterpriseUsersData(searchArgs1);
    await waitFor(() => {
      expect(LmsApiService.fetchEnterpriseCustomerUsers).not.toHaveBeenCalled();
    });

    const searchArgs2 = {
      filters: [{ id: 'details', value: 'jinx' }],
      sortBy: [{}],
    };
    result.current.fetchEnterpriseUsersData(searchArgs2);
    await waitFor(() => {
      expect(LmsApiService.fetchEnterpriseCustomerUsers).toHaveBeenCalled();
    });
  });
});
