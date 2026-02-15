const MAX_SAMPLES_PER_ENDPOINT = 500;

const ENDPOINT_BUDGETS_MS = Object.freeze({
  "/api/billing/subscription": 75,
});

const endpointSamples = new Map();

function clampPositiveFinite(value) {
  if (!Number.isFinite(value) || value <= 0) {
    return null;
  }
  return value;
}

function percentile(sortedValues, target) {
  if (sortedValues.length === 0) {
    return 0;
  }

  const index = Math.ceil(target * sortedValues.length) - 1;
  const safeIndex = Math.max(0, Math.min(sortedValues.length - 1, index));
  return sortedValues[safeIndex];
}

function summarizeEndpoint(endpoint, rawSamples, budgetMs) {
  const latencyValues = rawSamples
    .map((sample) => sample.duration_ms)
    .filter((value) => Number.isFinite(value) && value > 0)
    .sort((left, right) => left - right);

  const sampleCount = latencyValues.length;

  if (sampleCount === 0) {
    return {
      endpoint,
      sample_count: 0,
      budget_ms: budgetMs,
      p50_ms: 0,
      p95_ms: 0,
      max_ms: 0,
      over_budget: false,
    };
  }

  return {
    endpoint,
    sample_count: sampleCount,
    budget_ms: budgetMs,
    p50_ms: percentile(latencyValues, 0.5),
    p95_ms: percentile(latencyValues, 0.95),
    max_ms: latencyValues[sampleCount - 1],
    over_budget: budgetMs > 0 ? percentile(latencyValues, 0.95) > budgetMs : false,
  };
}

export function recordBillingLatencySample(endpoint, durationMs, statusCode) {
  const safeDurationMs = clampPositiveFinite(durationMs);
  if (!endpoint || safeDurationMs === null) {
    return;
  }

  const currentSamples = endpointSamples.get(endpoint) ?? [];
  currentSamples.push({
    duration_ms: safeDurationMs,
    status_code: Number.isFinite(statusCode) ? statusCode : 0,
    recorded_at: new Date().toISOString(),
  });

  if (currentSamples.length > MAX_SAMPLES_PER_ENDPOINT) {
    currentSamples.splice(0, currentSamples.length - MAX_SAMPLES_PER_ENDPOINT);
  }

  endpointSamples.set(endpoint, currentSamples);
}

export function getBillingPerformanceGuardrails(windowSize) {
  const requestedWindow = windowSize ?? MAX_SAMPLES_PER_ENDPOINT;
  const normalizedWindow = Number.isInteger(requestedWindow) && requestedWindow > 0
    ? Math.min(requestedWindow, MAX_SAMPLES_PER_ENDPOINT)
    : MAX_SAMPLES_PER_ENDPOINT;

  const reports = Object.keys(ENDPOINT_BUDGETS_MS).map((endpoint) => {
    const endpointBudget = ENDPOINT_BUDGETS_MS[endpoint];
    const samples = endpointSamples.get(endpoint) ?? [];
    const relevantSamples = samples.slice(Math.max(0, samples.length - normalizedWindow));
    return summarizeEndpoint(endpoint, relevantSamples, endpointBudget);
  });

  return {
    generated_at: new Date().toISOString(),
    window_size: normalizedWindow,
    endpoints: reports,
  };
}

export function resetBillingPerformanceSamples() {
  endpointSamples.clear();
}