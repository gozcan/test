# QA Plan

## Test pyramid strategy

- Unit (`tests/unit`): plan limits, AI token guardrails, and receipt-to-draft normalization.
- Integration (`tests/integration`): FE/BE extract contract shape and backend status transition rules.
- E2E (`e2e`): user journey from upload to review correction to CSV export.

## FE/BE contract verification

- Assert extract response includes stable fields consumed by frontend:
  - `id`, `status`, `createdAt`, and `fields.{vendorName,amount,currency,incurredOn,category}`.
- Assert invalid lifecycle transitions are rejected to prevent UI drift from API rules.

## Flaky test triage controls

- No random inputs, timers, or network calls in tests.
- Fixed timestamps and fixture-driven data only.
- Keep assertions exact on contract-critical fields.

## CI gate enforcement

- Required checks:
  - `node --test tests/unit`
  - `node --test tests/integration`
  - `node --test e2e`
- Merge gate: all checks green plus tester sign-off evidence in `qa/test-evidence.md`.
