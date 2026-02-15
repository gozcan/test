# Issue 7 Test Evidence - MVP-06 Backend Subscription Billing

## Scope
- Issue: `#7` MVP-06 Backend: Subscription Billing (Tokens + Seat Add-ons)
- Focused areas:
  - Subscription snapshot contract (`/api/billing/subscription`)
  - Extraction contract continuity (`/api/documents/extract`)
  - End-to-end API journey with CSV export (`/api/expenses/export.csv`)

## Added/Updated Tests
- Unit: `tests/unit/subscription.service.test.ts`
- Integration: `tests/integration/billing-and-extract.contract.test.ts`
- E2E: `e2e/subscription-billing-flow.e2e.test.ts`
- Fixture: `fixtures/documents/extract-input.json`

## Execution Results
### Unit
- Command: `npm exec --yes --package vitest -- vitest run tests/unit --reporter=verbose`
- Result: PASS
- Evidence: 1 file passed, 2 tests passed

### Integration
- Command: `npm exec --yes --package vitest -- vitest run tests/integration --reporter=verbose`
- Result: PASS
- Evidence: 1 file passed, 2 tests passed

### E2E
- Command: `npm exec --yes --package vitest -- vitest run e2e --reporter=verbose`
- Result: PASS
- Evidence: 1 file passed, 1 test passed

## Reliability / Flake Controls
- Deterministic IDs enforced with `Date.now` mocking in integration and e2e tests.
- No wall-clock waits or network calls used.

## CI Gate Recommendation
- Enforce all three checks as required gates:
  1. `npm exec --yes --package vitest -- vitest run tests/unit`
  2. `npm exec --yes --package vitest -- vitest run tests/integration`
  3. `npm exec --yes --package vitest -- vitest run e2e`

## Final State
- Overall status: PASS
- Acceptance criteria satisfied: test implementation + executable evidence included.
