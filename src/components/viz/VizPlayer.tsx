import { useState } from 'preact/hooks';
import type { Step } from '../../lib/algorithms/types';
import { ArrayView, TreeView, GraphView } from './renderers';

/**
 * Shared playback shell for every visualization. Takes a precomputed step
 * sequence and renders the current frame plus prev/next/play/reset controls.
 * Dispatches to the renderer for the current step's `kind`.
 *
 * The steps come from a pure generator (src/lib/algorithms/*), so the island
 * is genuinely driven by the algorithm code, not a hand-faked animation.
 */
export default function VizPlayer({ steps, label }: { steps: Step[]; label?: string }) {
  const [idx, setIdx] = useState(0);
  const safeIdx = Math.min(idx, steps.length - 1);
  const step = steps[safeIdx];
  const atEnd = safeIdx >= steps.length - 1;
  const atStart = safeIdx <= 0;

  if (!step) return <p class="viz-empty">No steps to show.</p>;

  return (
    <figure class="viz">
      <div class="viz-stage">
        {step.kind === 'array' && <ArrayView step={step} />}
        {step.kind === 'tree' && <TreeView step={step} />}
        {step.kind === 'graph' && <GraphView step={step} />}
      </div>
      <figcaption class="viz-note">
        <span class="viz-step">
          Step {safeIdx + 1} / {steps.length}
        </span>{' '}
        {step.note}
      </figcaption>
      <div class="viz-controls" role="group" aria-label={label ?? 'visualization controls'}>
        <button type="button" onClick={() => setIdx(0)} disabled={atStart}>
          ⏮ Reset
        </button>
        <button type="button" onClick={() => setIdx((i) => Math.max(0, Math.min(i, steps.length - 1) - 1))} disabled={atStart}>
          ◀ Prev
        </button>
        <button type="button" onClick={() => setIdx((i) => Math.min(steps.length - 1, i + 1))} disabled={atEnd}>
          Next ▶
        </button>
      </div>
    </figure>
  );
}
