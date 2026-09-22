<#
.SYNOPSIS
  Stops the Penpot Enterprise Development Stack.
#>

param (
    [switch]$Volumes
)

$ErrorActionPreference = "Stop"
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectRoot = Split-Path -Parent $ScriptDir
$ComposeFile = Join-Path $ProjectRoot "docker\enterprise\docker-compose.enterprise.yaml"
$EnvFile = Join-Path $ProjectRoot "docker\enterprise\.env.enterprise"

Write-Host "Stopping Penpot Enterprise Platform Stack..." -ForegroundColor Yellow

$composeArgs = @("compose", "--env-file", $EnvFile, "-f", $ComposeFile, "down")
if ($Volumes) { $composeArgs += "-v" }

& docker @composeArgs
Write-Host "Stack stopped." -ForegroundColor Green
