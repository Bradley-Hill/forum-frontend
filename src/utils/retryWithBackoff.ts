export async function retryWithBackoff<T>(
    fn: () => Promise<T>,
    maxAttempts: number = 3,
    delayMs: number = 2000,
    onRetry?: (attempt: number) => void
): Promise<T> {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            return await fn();
        } catch (err) {
            lastError = err instanceof Error ? err : new Error(String(err));

            if(lastError.message.includes("timeout")){
                console.log(`Attempt ${attempt} failed with timeout. Retrying in ${delayMs}ms...`);
                onRetry?.(attempt +1);
                await new Promise((resolve) => setTimeout(resolve, delayMs));
                continue;
            } else {
                throw lastError;
            }
        }
    }

    throw lastError;
}