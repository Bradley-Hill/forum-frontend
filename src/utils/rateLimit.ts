export interface RateLimitConfig {
  delayMs: number;
}

interface RateLimitEntry {
  lastCallTime: number;
}

const DEFAULT_DELAY_MS = 1000; // 1 second default cooldown
const rateLimitMap = new Map<string, RateLimitEntry>();

export function isRateLimitAllowed(
  key: string,
  delayMs: number = DEFAULT_DELAY_MS,
): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(key);

  if (!entry) {
    rateLimitMap.set(key, { lastCallTime: now });
    return true;
  }

  const timeSinceLastCall = now - entry.lastCallTime;
  if (timeSinceLastCall >= delayMs) {
    entry.lastCallTime = now;
    return true;
  }

  return false;
}

export function getRateLimitRemainingMs(
  key: string,
  delayMs: number = DEFAULT_DELAY_MS,
): number {
  const entry = rateLimitMap.get(key);
  if (!entry) return 0;

  const now = Date.now();
  const timeSinceLastCall = now - entry.lastCallTime;
  const remaining = delayMs - timeSinceLastCall;

  return Math.max(0, remaining);
}

export function resetRateLimit(key: string): void {
  rateLimitMap.delete(key);
}

export function resetAllRateLimits(): void {
  rateLimitMap.clear();
}
