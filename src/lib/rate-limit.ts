const windows = new Map<string, { count: number; start: number }>();

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const entry = windows.get(key);

  if (!entry || now - entry.start > windowMs) {
    windows.set(key, { count: 1, start: now });
    return { allowed: true, remaining: limit - 1 };
  }

  if (entry.count >= limit) {
    return { allowed: false, remaining: 0 };
  }

  entry.count++;
  return { allowed: true, remaining: limit - entry.count };
}

export function getClientIp(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

export function checkRateLimit(
  request: Request,
  endpoint: string,
  limit: number = 20,
  windowMs: number = 60_000
): Response | null {
  const ip = getClientIp(request);
  const key = `${ip}:${endpoint}`;
  const { allowed, remaining } = rateLimit(key, limit, windowMs);

  if (!allowed) {
    return new Response(JSON.stringify({ error: "Too many requests" }), {
      status: 429,
      headers: {
        "Content-Type": "application/json",
        "X-RateLimit-Remaining": "0",
        "Retry-After": String(Math.ceil(windowMs / 1000)),
      },
    });
  }

  return null; // allowed
}
