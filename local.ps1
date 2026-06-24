# ==============================================================================
# Resumaker Dev Mode Orchestrator
# ==============================================================================

# Ensure environment files exist
if (-not (Test-Path "server/.env")) {
    Write-Host "Creating server/.env from example template..." -ForegroundColor Yellow
    Copy-Item "server/.env.example" "server/.env"
    Write-Host "Please edit server/.env and add your GEMINI_API_KEY to enable AI features!" -ForegroundColor Cyan
}

if (-not (Test-Path "client/.env")) {
    Write-Host "Creating client/.env from example template..." -ForegroundColor Yellow
    Copy-Item "client/.env.example" "client/.env"
}

# Start the dockerized dev environment
Write-Host "Launching Resumaker Dev Environment..." -ForegroundColor Green
docker compose -f docker-compose.dev.yml up --build
