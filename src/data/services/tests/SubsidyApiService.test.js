import SubsidyApiService from '../SubsidyApiService';

describe('getAllSubsidies', () => {
  it('returns a promise', () => {
    const result = SubsidyApiService.getAllSubsidies(
      {
        paginatedURL: 1,
        pageSize: 10,
        sortBy: '',
        filteredData: {
          foo: 'bar',
          bar: 'foo',
        },
      },
    );
    expect(result).toBeInstanceOf(Promise);
  });
});
