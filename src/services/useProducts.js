import { useCallback, useEffect, useState } from 'react';
import { getProducts } from '../services/catalogueService';

export function useProducts() {
  const [state, setState] = useState({ products: [], loading: true, error: null });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;

    getProducts()
      .then((products) => {
        if (!cancelled) setState({ products, loading: false, error: null });
      })
      .catch((err) => {
        console.error(err);
        if (!cancelled) {
          setState({
            products: [],
            loading: false,
            error: 'We could not load the products. Please check your connection and try again.'
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [attempt]);

  // Call this from a "Try again" button
  const reload = useCallback(() => {
    setState((s) => ({ ...s, loading: true, error: null }));
    setAttempt((n) => n + 1);
  }, []);

  return { ...state, reload };
}