// @ts-ignore
import { useEffect, useState } from "haunted";
import { parseJSON } from "../helper";

type NewState<T> = T | ((previousState?: T) => T);
type StateUpdater<T> = (value: NewState<T>) => void;

function useSessionStorage<T>(
  key: string,
  initialValue: T
): [
  T extends (...args: any[]) => infer R ? R : T,
  StateUpdater<T extends (...args: any[]) => infer S ? S : T>
] {
  // Get from local storage then
  // parse stored json or return initialValue
  const readValue = (): T => {
    // Prevent build error "window is undefined" but keep keep working
    if (typeof window === "undefined") {
      return initialValue;
    }

    try {
      const item = window.sessionStorage.getItem(key);
      return item ? (parseJSON(item) as T) : initialValue;
    } catch (error) {
      console.warn(`Error reading sessionStorage key “${key}”:`, error);
      return initialValue;
    }
  };

  // @ts-ignore
  const [storedValue, setStoredValue] = useState<T>(readValue());

  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to sessionStorage.
  const setValue: StateUpdater<T> = (value) => {
    // Prevent build error "window is undefined" but keeps working
    if (typeof window == "undefined") {
      console.warn(
        `Tried setting sessionStorage key “${key}” even though environment is not a client`
      );
    }

    try {
      // Allow value to be a function so we have the same API as useState
      const newValue =
        value instanceof Function ? value(storedValue as T) : value;

      // Save to local storage
      window.sessionStorage.setItem(key, JSON.stringify(newValue));

      // Save state
      setStoredValue(
        newValue as NewState<T extends (...args: any[]) => infer S ? S : T>
      );
    } catch (error) {
      console.warn(`Error setting sessionStorage key “${key}”:`, error);
    }
  };

  useEffect(() => {
    setStoredValue(
      readValue() as NewState<T extends (...args: any[]) => infer S ? S : T>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [
    storedValue,
    setValue as unknown as StateUpdater<
      T extends (...args: any[]) => infer S ? S : T
    >,
  ];
}

export default useSessionStorage;
