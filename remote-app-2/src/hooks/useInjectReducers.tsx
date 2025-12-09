import { useEffect } from "react";
import { useStore, useSelector } from "react-redux";
import type { Store, UnknownAction, Reducer } from "@reduxjs/toolkit";

interface StoreWithAsyncReducers extends Store<any, UnknownAction> {
  injectReducer?: (key: string, reducer: Reducer) => void;
  ejectReducer?: (key: string) => void;
}

interface UseInjectReducersProps {
  name: string;
  reducers: Reducer;
}

export function useInjectReducers({ name, reducers }: UseInjectReducersProps) {
  const store = useStore() as StoreWithAsyncReducers;

  // Check if reducer already injected (to avoid re-injection)
  const isInjected = useSelector((state: Record<string, unknown>) => !!state[name]);
  console.log("isInjected", isInjected);

  useEffect(() => {
    if (!isInjected && store.injectReducer) {
      // Inject the reducer when component mounts
      store.injectReducer(name, reducers);
      console.log(`${name} reducer injected on mount`);
    }

    // Optional: Clean up reducer on unmount
    return () => {
      if (store.ejectReducer) {
        store.ejectReducer(name);
        console.log(`${name} reducer ejected on unmount`);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return { isReady: isInjected };
};
