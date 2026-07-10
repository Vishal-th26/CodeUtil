import { useEffect, useMemo, useRef, useState } from "react";
import "./IndexVisualizer.css";

const COLS = 16;
const ROWS = 6;
const TOTAL = COLS * ROWS;

/**
 * Visual metaphor for the actual pipeline: file -> AST -> chunk -> embed -> FAISS/BM25.
 * `active` sweeps cells on in sequence (indexing in progress).
 * `filledRatio` (0-1) shows a settled proportion of the grid lit, for a static/idle read
 *  (e.g. current index size on the status view).
 */
export default function IndexVisualizer({ active = false, filledRatio = 0, dense = false, label }) {
  const [litCount, setLitCount] = useState(0);
  const rafRef = useRef(null);
  const orderRef = useRef(null);

  const order = useMemo(() => {
    if (!orderRef.current) {
      const arr = Array.from({ length: TOTAL }, (_, i) => i);
      // deterministic shuffle so the sweep doesn't read as a boring left-to-right scan
      for (let i = arr.length - 1; i > 0; i--) {
        const seed = (i * 2654435761) % (i + 1);
        const j = seed % (i + 1);
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      orderRef.current = arr;
    }
    return orderRef.current;
  }, []);

  useEffect(() => {
    if (!active) return;
    let n = 0;
    const tick = () => {
      n = (n + 1) % (TOTAL + 20);
      setLitCount(n);
      rafRef.current = setTimeout(tick, 45);
    };
    rafRef.current = setTimeout(tick, 45);
    return () => clearTimeout(rafRef.current);
  }, [active]);

  const settledLit = Math.round(TOTAL * Math.min(1, Math.max(0, filledRatio)));
  const litSet = useMemo(() => {
    const count = active ? Math.min(litCount, TOTAL) : settledLit;
    return new Set(order.slice(0, count));
  }, [active, litCount, settledLit, order]);

  return (
    <div className={"index-viz" + (dense ? " dense" : "")}>
      <div
        className="index-viz-grid"
        style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)` }}
        role="img"
        aria-label={label || "Index visualization"}
      >
        {Array.from({ length: TOTAL }).map((_, i) => (
          <span key={i} className={"index-cell" + (litSet.has(i) ? " lit" : "")} />
        ))}
      </div>
      {label && <div className="index-viz-label mono">{label}</div>}
    </div>
  );
}
