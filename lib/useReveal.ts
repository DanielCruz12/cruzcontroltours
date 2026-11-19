import { useEffect, useRef, useState } from "react";

/**
 * Reveal al hacer scroll: `visible` se activa cuando el elemento entra al
 * viewport; `settled` se activa `settleMs` después, para retirar los
 * transition-delay escalonados y que los hovers respondan al instante.
 */
export function useReveal<T extends HTMLElement>(settleMs: number) {
  const [visible, setVisible] = useState(false);
  const [settled, setSettled] = useState(false);
  const ref = useRef<T>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    const timer = window.setTimeout(() => setSettled(true), settleMs);
    return () => window.clearTimeout(timer);
  }, [visible, settleMs]);

  return { ref, visible, settled };
}
