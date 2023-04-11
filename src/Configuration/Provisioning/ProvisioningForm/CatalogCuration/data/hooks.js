/* eslint-disable no-unused-vars */
import { useCallback } from 'react';
import { useContextSelector } from 'use-context-selector';
import { CatalogCurationContext } from '../CatalogCurationContext';

export default function useCatalogCurationContext() {
  const setState = useContextSelector(CatalogCurationContext, v => v[1]);
  const updateRootDataState = useCallback(
    (newDataAttribute) => {
      setState((s) => ({
        ...s,
        ...newDataAttribute,
      }));
    },
    [setState],
  );
  const setStartDate = (startDate) => updateRootDataState({ startDate });
  const setEndDate = (endDate) => updateRootDataState({ endDate });

  // see src/Configuration/Provisioning/data/hooks.js for more examples to add state management variables
  const setCurrentSelectedRowIds = useCallback((selectedRowIds) => {
    setState(s => ({
      ...s,
      currentSelectedRowIds: selectedRowIds,
    }));
  }, [setState]);

  return {
    setCurrentSelectedRowIds,
    setStartDate,
    setEndDate,
  };
}
