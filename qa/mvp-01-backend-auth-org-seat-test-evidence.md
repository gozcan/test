# MVP-01 Test Evidence (Issue #2)

Date: 2026-02-15  
Branch: `agent/tester/2-mvp-01-backend-auth-organization-and-seat-limits`

## Scope

- Added test coverage in owned paths:
  - `tests/unit/subscription-seat-limits.unit.test.js`
  - `tests/integration/auth-org-seat-contract.int.test.js`
  - `e2e/mvp01-auth-org-seat-limits.e2e.test.js`

## Execution

1. `node --test tests/unit/subscription-seat-limits.unit.test.js`
2. `node --test tests/integration/auth-org-seat-contract.int.test.js`
3. `node --test e2e/mvp01-auth-org-seat-limits.e2e.test.js`

## Results

- Unit: `PASS` (2 passed, 0 failed)
  - Seat fields exist in subscription snapshot.
  - `seats_used <= included_seats` invariant holds for current starter snapshot.
- Integration: `FAIL` (1 passed, 3 failed)
  - Missing authentication middleware wiring.
  - Missing organization/tenant scoping in billing subscription endpoint.
  - Missing seat-limit enforcement logic in billing/subscription flow.
- E2E Contract: `FAIL` (0 passed, 3 failed)
  - Missing auth session endpoint(s).
  - Missing organization-scoped API surface.
  - Missing seat-check enforcement in protected flow.

## CI Gate Recommendation

- `BLOCK` merge for issue #2 until integration and e2e failures are resolved.
- Rerun the same three commands above after backend implementation is updated.
