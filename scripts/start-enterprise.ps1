<#
.SYNOPSIS
  Starts the Penpot Enterprise Development Stack.
.DESCRIPTION
  Orchestrates frontend, backend, database, Valkey, exporter, and MCP services.
#>

param (
    [switch]$Build,
    [bool]$Detach = $true
)

$ErrorActionPreference = "Stop"
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectRoot = Split-Path -Parent $ScriptDir
$ComposeFile = Join-Path $ProjectRoot "docker\enterprise\docker-compose.enterprise.yaml"
$EnvFile = Join-Path $ProjectRoot "docker\enterprise\.env.enterprise"
$EnvExampleFile = Join-Path $ProjectRoot "docker\enterprise\.env.enterprise.example"

if (-not (Test-Path $EnvFile) -and (Test-Path $EnvExampleFile)) {
    Write-Host "Notice: .env.enterprise not found. Creating from .env.enterprise.example..." -ForegroundColor Yellow
    Copy-Item $EnvExampleFile $EnvFile
}

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "  Starting Penpot Enterprise Platform Stack (Port 9001)...  " -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan

# Check if Docker daemon is responsive
try {
    docker info > $null 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Warning "Docker daemon does not appear to be running."
        Write-Warning "Please start Docker Desktop on your system and rerun this script."
        exit 1
    }
} catch {
    Write-Warning "Docker command not accessible. Please ensure Docker is installed and in PATH."
    exit 1
}

$composeArgs = @("compose", "--env-file", $EnvFile, "-f", $ComposeFile, "up")
if ($Detach) { $composeArgs += "-d" }
if ($Build)  { $composeArgs += "--build" }

Write-Host "Executing: docker $($composeArgs -join ' ')" -ForegroundColor Gray
& docker @composeArgs

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "============================================================" -ForegroundColor Green
    Write-Host "  Enterprise Stack is launching successfully!              " -ForegroundColor Green
    Write-Host "  - Studio Web Interface:  http://localhost:9001           " -ForegroundColor Green
    Write-Host "  - Mailcatcher Inbox:     http://localhost:1080           " -ForegroundColor Green
    Write-Host "  - PostgreSQL Port:       5432                            " -ForegroundColor Green
    Write-Host "  - Valkey / Redis Port:   6379                            " -ForegroundColor Green
    Write-Host "============================================================" -ForegroundColor Green
} else {
    Write-Error "Failed to start enterprise container stack."
}
