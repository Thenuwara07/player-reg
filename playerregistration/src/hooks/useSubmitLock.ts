import { useCallback, useRef, useState } from "react";

/**
 * Prevents double submission. Wrap a click/submit handler with `guard`:
 * while it runs, `pending` is true (use it to disable the button) and any
 * further clicks are ignored, even ones fired before React re-renders.
 *
 * Pass a `key` to know which of several actions is running, e.g.
 * `guard(approve, "approve")` and `pendingKey === "approve"`.
 */
export const useSubmitLock = () => {
  const locked = useRef(false);
  const [pendingKey, setPendingKey] = useState<string | null>(null);

  const guard = useCallback(
    <A extends unknown[]>(
      fn: (...args: A) => unknown,
      key: string = "default"
    ) =>
      async (...args: A) => {
        if (locked.current) {
          // Still stop a blocked form submit from reloading the page
          (args[0] as { preventDefault?: () => void } | undefined)
            ?.preventDefault?.();
          return;
        }
        locked.current = true;
        setPendingKey(key);
        try {
          await fn(...args);
        } finally {
          locked.current = false;
          setPendingKey(null);
        }
      },
    []
  );

  return { pending: pendingKey !== null, pendingKey, guard };
};
