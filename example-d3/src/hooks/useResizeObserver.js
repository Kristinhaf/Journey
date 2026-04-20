import { useState, useEffect, useRef } from 'react';

// Returns the current dimensions of a container element.
// Usage: const { ref, width, height } = useResizeObserver();
export function useResizeObserver() {
  const ref = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!ref.current) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setDimensions({ width, height });
    });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return { ref, ...dimensions };
}
