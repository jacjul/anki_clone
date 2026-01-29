# Runs the Flask API using the external venv and proper module path
$ErrorActionPreference = "Stop"

# Adjust if you move your venv
$venvActivate = "C:\Users\ASUS\venvs\anki_api\Scripts\Activate.ps1"

if (Test-Path $venvActivate) {
  . $venvActivate
} else {
  Write-Host "Venv not found at $venvActivate. Activate your venv manually." -ForegroundColor Yellow
}

# Run from the project root so 'api' package is importable
Set-Location $PSScriptRoot

# Explicit env to avoid relying on .env loading from the cwd
$env:FLASK_APP = "api.api:app"
$env:FLASK_ENV = "development"

# Start the dev server
flask run
