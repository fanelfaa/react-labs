import { Flex } from '@react-labs/example/ui';
import { createStore } from '@react-labs/observer-context';
import { ToastSpot, useToast } from '@react-labs/ui';
import { useEffect, useRef } from 'react';

const countStore = createStore(0);

export function App() {
  return (
    <countStore.Provider>
      <Count />
      <Increment />
      <ToastSpot />
      <ToastImplement />
    </countStore.Provider>
  );
}

const Count = () => {
  const count = countStore.useSelector((s) => s);
  return <h3>{count}</h3>;
};
const Increment = () => {
  const setCount = countStore.useDispatch();
  return (
    <button onClick={() => setCount((prev) => prev + 1)}>increment</button>
  );
};

const ToastImplement = () => {
  const toast = useToast();

  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (divRef.current) {
      divRef.current.classList.add('class-from-ref');
    }
  }, []);

  return (
    <Flex className="inline-class" ref={divRef} gap="20px">
      <button onClick={() => toast.info({ title: 'Testing Toast Info' })}>
        Publish Toast Info
      </button>
      <button onClick={() => toast.success({ title: 'Testing Toast Success' })}>
        Publish Toast Success
      </button>
      <button
        onClick={() =>
          toast.success({
            title: 'Testing Toast Success Long',
            duration: 10000,
          })
        }
      >
        Publish Toast Success Long
      </button>
      <button
        onClick={() =>
          toast.promise({
            title: 'Testing Toast Promise',
            promise: () => new Promise((resolve) => setTimeout(resolve, 3000)),
          })
        }
      >
        Publish Toast Promise
      </button>
    </Flex>
  );
};

export default App;
