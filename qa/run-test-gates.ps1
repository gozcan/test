$ErrorActionPreference = "Stop"

Write-Host "Running unit test gate..."
node --test tests/unit/*.test.js

Write-Host "Running integration test gate..."
node --test tests/integration/*.test.js

Write-Host "Running e2e test gate..."
node --test e2e/*.test.js

Write-Host "All test gates passed."
