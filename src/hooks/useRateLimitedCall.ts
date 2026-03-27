import { useCallback } from "react";
import { isRateLimitAllowed } from "../utils/rateLimit";

interface RateLimitedCallOptions {
  key: string; 
  delayMs?: number; 
  onRateLimited?: (remainingMs: number) => void; 
}

export function useRateLimitedCall<T extends unknown[], R>(
  asyncFn: (...args: T) => Promise<R>,
  options: RateLimitedCallOptions
): (...args: T) => Promise<R | void> {
  return useCallback(
    async (...args: T): Promise<R | void> => {
      const delayMs = options.delayMs ?? 1000;
      
      if (!isRateLimitAllowed(options.key, delayMs)) {
        if (options.onRateLimited) {
          options.onRateLimited(delayMs);
        }
        throw new Error(`Rate limited. Please wait ${Math.ceil(delayMs / 1000)}s before trying again.`);
      }

      return asyncFn(...args);
    },
    [asyncFn, options],
  );
}
