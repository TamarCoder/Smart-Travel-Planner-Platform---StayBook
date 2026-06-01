import type { RequestOptions } from "./types";

export class ApiError extends Error {
  readonly status: number;
  readonly code: string;

  constructor(message: string, status = 500, code = "internal_error") {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

function parseLatencyRange(raw: string | undefined): [number, number] {
  const fallback: [number, number] = [200, 600];
  if (!raw) return fallback;
  const parts = raw.split("-").map((value) => Number(value.trim()));
  const [min, max] = parts.length === 2 ? parts : [parts[0], parts[0]];
  if (!Number.isFinite(min) || !Number.isFinite(max) || min < 0 || max < min) {
    return fallback;
  }
  return [min, max];
}

function parseErrorRate(raw: string | undefined): number {
  const value = Number(raw);
  if (!Number.isFinite(value) || value < 0 || value > 1) return 0.03;
  return value;
}

const [DEFAULT_MIN_DELAY, DEFAULT_MAX_DELAY] = parseLatencyRange(
  process.env.NEXT_PUBLIC_MOCK_LATENCY_MS,
);
const DEFAULT_ERROR_RATE = parseErrorRate(process.env.NEXT_PUBLIC_MOCK_ERROR_RATE);

function randomDelay(min = DEFAULT_MIN_DELAY, max = DEFAULT_MAX_DELAY) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function wait(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new ApiError("Request aborted", 0, "aborted"));
      return;
    }
    const id = setTimeout(() => {
      signal?.removeEventListener("abort", onAbort);
      resolve();
    }, ms);
    const onAbort = () => {
      clearTimeout(id);
      reject(new ApiError("Request aborted", 0, "aborted"));
    };
    signal?.addEventListener("abort", onAbort, { once: true });
  });
}

export async function fakeRequest<T>(
  handler: () => T | Promise<T>,
  options: RequestOptions = {},
): Promise<T> {
  const {
    delayMs = randomDelay(),
    errorRate = DEFAULT_ERROR_RATE,
    signal,
  } = options;

  await wait(delayMs, signal);

  if (Math.random() < errorRate) {
    throw new ApiError("Network unstable. Please try again.", 503, "network_unstable");
  }

  return handler();
}

export function notFound(resource: string): never {
  throw new ApiError(`${resource} not found`, 404, "not_found");
}

export function unauthorized(message = "Authentication required"): never {
  throw new ApiError(message, 401, "unauthorized");
}

export function conflict(message: string): never {
  throw new ApiError(message, 409, "conflict");
}

export function validationError(message: string): never {
  throw new ApiError(message, 422, "validation_error");
}
