import { useEffect, useRef, useState } from 'react';

/**
 * Counts up from `start` to `end` over `duration` ms.
 * Returns the current displayed integer value.
 * Respects `enabled` flag so the count only starts when ready.
 */
export function useCountUp(
  end: number,
  duration = 900,
  enabled = true,
): number {
  const [value, setValue] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!enabled) {
      setValue(0);
      return;
    }

    const start = performance.now();
    const from = 0;

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(from + (end - from) * eased));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [end, duration, enabled]);

  return value;
}
