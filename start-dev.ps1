#
# =======================================================
#  🚀 OptimaCV - Professional Development Starter (V2)
# =======================================================
#

$Color_Green = [System.ConsoleColor]::Green
$Color_Yellow = [System.ConsoleColor]::Yellow
$Color_Red = [System.ConsoleColor]::Red
$Color_Cyan = [System.ConsoleColor]::Cyan
$Color_White = [System.ConsoleColor]::White

Clear-Host
Write-Host "=========================================" -ForegroundColor $Color_Cyan
Write-Host "    Starting OptimaCV Project..."
Write-Host "=========================================" -ForegroundColor $Color_Cyan
Write-Host ""


Write-Host "1. Checking Backend Environment (.env)..." -ForegroundColor $Color_Yellow

# $envFile = ".\.env" 

# if (-not (Test-Path $envFile)) {
#     Write-Host "   [ERROR] '.env' file not found in root directory!" -ForegroundColor $Color_Red
#     Read-Host "Press Enter to exit"
#     exit
# }

# $envContent = Get-Content $envFile
# if ($envContent -notmatch "GOOGLE_API_KEY=") {
#     Write-Host "   [ERROR] 'GOOGLE_API_KEY=' not found in your .env file!" -ForegroundColor $Color_Red
#     Read-Host "Press Enter to exit"
#     exit
# }

Write-Host "   [SUCCESS] GOOGLE_API_KEY found." -ForegroundColor $Color_Green
Write-Host ""


Write-Host "2. Checking Frontend Dependencies (node_modules)..." -ForegroundColor $Color_Yellow

$nodeModules = ".\frontend\node_modules"

if (-not (Test-Path $nodeModules)) {
    Write-Host "   [WARN] 'node_modules' folder not found." -ForegroundColor $Color_Yellow
    Write-Host "   Running 'npm install' for you. This might take a minute..." -ForegroundColor $Color_Cyan
    
    Start-Process powershell -ArgumentList "-Command 'cd frontend; npm install'" -Wait
    
    Write-Host "   [SUCCESS] Dependencies installed." -ForegroundColor $Color_Green
} else {
    Write-Host "   [SUCCESS] Dependencies already installed." -ForegroundColor $Color_Green
}
Write-Host ""


Write-Host "3. Starting Servers..." -ForegroundColor $Color_Yellow


Write-Host "   -> Starting FastAPI Backend (localhost:8000)..."

$backendArgs = @(
    "-NoExit",
    "-Command",

    "& { 
        `$host.UI.RawUI.WindowTitle = 'OptimaCV Backend (FastAPI)'; 
        python -m uvicorn backend.main:app --reload --port 8000 
    }"
)
Start-Process powershell -ArgumentList $backendArgs


Write-Host "   -> Starting Next.js Frontend (localhost:3000)..."

$frontendArgs = @(
    "-NoExit",
    "-Command",
    "& { 
        `$host.UI.RawUI.WindowTitle = 'OptimaCV Frontend (Next.js)'; 
        cd frontend; 
        npm run dev 
    }"
)
Start-Process powershell -ArgumentList $frontendArgs




Write-Host ""
Write-Host "==============================================" -ForegroundColor $Color_Green
Write-Host "    SUCCESS! Both servers are starting up."
Write-Host "    Backend: http://localhost:8000"
Write-Host "    Frontend: http://localhost:3000"
Write-Host "==============================================" -ForegroundColor $Color_Green