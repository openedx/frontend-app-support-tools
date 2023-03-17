import selectProvisioningContext from '../utils';

describe('selectProvisioningContext', () => {
  it('throws and error when no arguments are passed', () => {
    expect(() => selectProvisioningContext()).toThrow();
  });
});
