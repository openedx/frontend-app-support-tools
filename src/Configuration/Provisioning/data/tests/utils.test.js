import selectProvisioningContext from '../utils';

describe('selectProvisioningContext', () => {
  it('throws an error when no arguments are passed', () => {
    expect(() => selectProvisioningContext()).toThrow();
  });
});
