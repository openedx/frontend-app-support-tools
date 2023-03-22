import { selectProvisioningContext, sortedCatalogQueries } from '../utils';
import { sampleCatalogQueries } from '../../../testData/constants';

describe('selectProvisioningContext', () => {
  it('throws an error when no arguments are passed', () => {
    expect(() => selectProvisioningContext()).toThrow();
  });
});

describe('sortedCatalogQueries', () => {
  it('sorts catalog queries by last modified date (newest first)', () => {
    const sortedQueries = sortedCatalogQueries(sampleCatalogQueries.data);
    for (let i = 0; i < sortedQueries.length - 1; i++) {
      expect(sortedQueries[i].title).toEqual(`TestQ${sortedQueries.length - i}`);
      expect(sortedQueries[i].modified < sortedQueries[i + 1]).toBeTruthy();
    }
  });
  it('returns the object array in the same order if no modified date fields', () => {
    const testObject = [{
      id: 1,
    },
    {
      id: 2,
    }];

    const testObjectSort = sortedCatalogQueries(testObject);
    expect(testObjectSort).toEqual(testObject);
  });
});
