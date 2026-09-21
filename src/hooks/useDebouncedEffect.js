import { useEffect } from 'react';

export default function useDebouncedEffect(callback, deps, delay) {
  useEffect(() => {
    const timeoutId = setTimeout(callback, delay);

    return () => clearTimeout(timeoutId);
  }, [...deps, delay]);
}
