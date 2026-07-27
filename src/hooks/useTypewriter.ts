import { useEffect, useState } from 'react';

/**
 * Reveals `text` character-by-character.
 * @param text     Full string to reveal.
 * @param interval Ms between each character (default 35ms).
 * @param enabled  Only start when true (e.g. after modal entrance).
 */
export function useTypewriter(
  text: string,
  interval = 35,
  enabled = true,
): string {
  const [displayed, setDisplayed] = useState('');

  useEffect(() => {
    if (!enabled) {
      setDisplayed('');
      return;
    }

    setDisplayed('');
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, interval);

    return () => clearInterval(id);
  }, [text, interval, enabled]);

  return displayed;
}
