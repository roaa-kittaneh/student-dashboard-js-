import { useEffect, useState } from 'react';

/**
 * Debounce any rapidly-changing value (search input, filters).
 * @param {*} value
 * @param {number} delay  ms
 */
export function useDebounce(value, delay = 350) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);

  return debounced;
}
