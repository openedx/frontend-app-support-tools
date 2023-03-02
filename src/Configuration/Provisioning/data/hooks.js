import { useCallback } from 'react';
import { useContextSelector } from 'use-context-selector';
import { ProvisioningContext } from '../ProvisioningContext';

export default function useProvisioningContext() {
  const setState = useContextSelector(ProvisioningContext, (v) => v[1]);
  const setMultipleFunds = useCallback((fundingBoolean) => {
    setState((s) => ({
      ...s,
      multipleFunds: fundingBoolean,
    }));
  }, [setState]);

  return {
    setMultipleFunds,
  };
}
