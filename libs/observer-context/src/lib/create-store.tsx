import React, {
  useRef,
  createContext,
  useContext,
  useCallback,
  useSyncExternalStore,
} from 'react';

type FunctionSet<T> = (previous: T) => T;
type Set<T> = T | FunctionSet<T>;

export function createStore<State>(initialState: State) {
  function useStoreData(): {
    get: () => State;
    set: (value: Set<State>) => void;
    subscribe: (callback: () => void) => () => void;
  } {
    const store = useRef(initialState);

    const subscribers = useRef(new Set<() => void>());

    const get = useCallback(() => store.current, []);

    const set = useCallback((value: Set<State>) => {
      if (typeof value === 'function') {
        const fun = value as FunctionSet<State>;
        store.current = fun(store.current);
      } else {
        store.current = value as State;
      }
      subscribers.current.forEach((callback) => callback());
    }, []);

    const subscribe = useCallback((callback: () => void) => {
      subscribers.current.add(callback);
      return () => subscribers.current.delete(callback);
    }, []);

    return {
      get,
      set,
      subscribe,
    };
  }

  type UseStoreDataReturnType = ReturnType<typeof useStoreData>;

  const StoreContext = createContext<UseStoreDataReturnType | null>(null);

  function Provider({ children }: { children: React.ReactNode }) {
    const store = useStoreData();
    return (
      <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
    );
  }

  function useStore(): [State | undefined, (value: Set<State>) => void] {
    const store = useContext(StoreContext);
    if (!store) {
      throw new Error('Store not found');
    }

    const state = useSyncExternalStore(
      store.subscribe,
      () => store.get(),
      () => initialState
    );

    return [state, store.set];
  }

  function useSelector<SelectorOutput>(
    selector: (store?: State) => SelectorOutput
  ) {
    const store = useContext(StoreContext);
    if (!store) {
      throw new Error('Store not found');
    }

    const state = useSyncExternalStore(
      store.subscribe,
      () => selector(store.get()),
      () => selector(initialState)
    );

    return state;
  }

  function useDispatch() {
    const store = useContext(StoreContext);
    if (!store) {
      throw new Error('Store not found');
    }

    return store.set;
  }

  return {
    Provider,
    useStore,
    useSelector,
    useDispatch,
  };
}
