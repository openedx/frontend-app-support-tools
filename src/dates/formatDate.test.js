import formatDate from './formatDate';

describe('Format Date', () => {
  it('correctly formats date', () => {
    const formatedDate = formatDate('2015-09-19T11:00:00');

    expect(formatedDate).toEqual('Sep 19, 2015 11:00 AM');
  });
  it('returns N/A if data is not provided', () => {
    expect(formatDate('')).toEqual('N/A');
    expect(formatDate()).toEqual('N/A');
  });
});
