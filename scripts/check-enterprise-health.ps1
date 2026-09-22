<#
.SYNOPSIS
  Performs health checks on the Penpot Enterprise stack.
#>

$ErrorActionPreference = "Continue"

Write-Host "Checking Penpot Enterprise stack status..." -ForegroundColor Cyan

# 1. Check containers
Write-Host "`n--- Container Status ---" -ForegroundColor Yellow
docker ps --filter "name=penpot-enterprise" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

# 2. Check HTTP endpoints
Write-Host "`n--- Endpoint Health Checks ---" -ForegroundColor Yellow

$endpoints = @(
    @{ Name = "Frontend Studio"; Uri = "http://localhost:9001/" },
    @{ Name = "Mailcatcher";     Uri = "http://localhost:1080/" }
)

foreach ($ep in $endpoints) {
    try {
        $resp = Invoke-WebRequest -Uri $ep.Uri -TimeoutSec 3 -UseBasicParsing
        Write-Host " [OK] $($ep.Name) ($($ep.Uri)) -> Status $($resp.StatusCode)" -ForegroundColor Green
    } catch {
        Write-Host " [FAIL] $($ep.Name) ($($ep.Uri)) -> $($_.Exception.Message)" -ForegroundColor Red
    }
}
