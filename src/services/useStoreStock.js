import { useEffect, useState } from 'react';
import { isStoreStockConfigured, subscribeToStoreStock } from './storeStockService';

export function useStoreStock() {
  const stockConfigured = isStoreStockConfigured();
  const [state, setState] = useState(() => ({
    stockByProductId: {},
    loading: stockConfigured,
    error: stockConfigured ? null : new Error('Store stock Firebase configuration is missing.')
  }));

  useEffect(() => {
    if (!stockConfigured) return;

    return subscribeToStoreStock(
      (stockByProductId) => setState({ stockByProductId, loading: false, error: null }),
      (error) => {
        console.error('Could not load store stock.', error);
        setState({ stockByProductId: {}, loading: false, error });
      }
    );
  }, [stockConfigured]);

  return state;
}
