# Issue 29 Test Evidence

## Scope
- Issue: `#29`
- Title: `RFC: MVP-06 Backend: Subscription Billing (Tokens + Seat Add-ons) - Quality Insights Dashboard`
- Role: `tester`
- Coverage focus:
  - `test_pyramid_strategy`
  - `fe_be_contract_verification`
  - `flaky_test_triage`
  - `ci_gate_enforcement`

## Added Test Assets
- `tests/unit/subscription.service.test.ts`
- `tests/integration/billing-quality-insights.contract.test.ts`
- `e2e/subscription-quality-insights-flow.e2e.test.ts`
- `fixtures/documents/extract-input.json`

## Execution Evidence

### Unit
- Command: `npx -y vitest run tests/unit`
- Result: `PASS`
- Files: `1 passed`
- Tests: `2 passed, 0 failed`

### Integration (FE/BE Contract Verification)
- Command: `npx -y vitest run tests/integration`
- Result: `PASS`
- Files: `1 passed`
- Tests: `2 passed, 0 failed`
- Verified contracts:
  - `GET /api/billing/subscription` response shape for token/seat add-ons.
  - `POST /api/documents/extract` response schema for draft payload.

### E2E
- Command: `npx -y vitest run e2e`
- Result: `PASS`
- Files: `1 passed`
- Tests: `1 passed, 0 failed`
- Journey validated:
  - Billing snapshot retrieval.
  - Extraction draft creation.
  - CSV export response.

### Flaky Test Triage
- Command: `npx -y vitest run tests/unit/subscription.service.test.ts`
- Result: `PASS`
- Files: `1 passed`
- Tests: `2 passed, 0 failed`
- Command: `npx -y vitest run tests/integration/billing-quality-insights.contract.test.ts`
- Result: `PASS`
- Files: `1 passed`
- Tests: `2 passed, 0 failed`
- Command: `npx -y vitest run e2e/subscription-quality-insights-flow.e2e.test.ts`
- Result: `PASS`
- Files: `1 passed`
- Tests: `1 passed, 0 failed`
- Observation: no intermittent failures observed across reruns of issue-29-specific suites.

## CI Gate Recommendation
- Enforce pre-merge gate:
  - `npx -y vitest run tests/unit`
  - `npx -y vitest run tests/integration`
  - `npx -y vitest run e2e`
- Gate status for this task: `GREEN`

## Additional Suite Health Note
- Command: `npx -y vitest run`
- Result: `FAIL`
- Reason: unrelated legacy suites in this worktree fail outside issue #29 scope (for example `tests/integration/auth-org-seat-contract.int.test.js`, `e2e/mvp01-auth-org-seat-limits.e2e.test.js`, `e2e/review-and-export.spec.ts`).
- Impact: issue #29 targeted gate remains green; repository-wide gate is currently red until those suites are remediated.

## Final Status
- Acceptance criteria: `PASS`
- Notes: Changes are scoped to tester-owned paths (`tests/**`, `e2e/**`, `fixtures/**`, `qa/**`).
