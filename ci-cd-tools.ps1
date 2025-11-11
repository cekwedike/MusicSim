# Deployment and CI/CD Scripts

# Test CI pipeline locally
function Test-CI {
    Write-Host "🔬 Testing CI pipeline locally..." -ForegroundColor Cyan
    
    # Install dependencies
    Write-Host "Installing frontend dependencies..." -ForegroundColor Yellow
    npm ci
    
    Write-Host "Installing backend dependencies..." -ForegroundColor Yellow
    Set-Location backend
    npm ci
    Set-Location ..
    
    # Run tests
    Write-Host "Running frontend tests..." -ForegroundColor Yellow
    npm test -- --run
    
    Write-Host "Running backend tests..." -ForegroundColor Yellow
    Set-Location backend
    npm test
    Set-Location ..
    
    # Build
    Write-Host "Building frontend..." -ForegroundColor Yellow
    npm run build
    
    Write-Host "✅ CI simulation completed!" -ForegroundColor Green
}

# Deploy to production
function Deploy-Production {
    Write-Host "🚀 Deploying to production..." -ForegroundColor Cyan
    
    $currentBranch = git branch --show-current
    if ($currentBranch -ne "main") {
        Write-Host "❌ Error: Can only deploy from main branch. Current: $currentBranch" -ForegroundColor Red
        return
    }
    
    $status = git status --porcelain
    if ($status) {
        Write-Host "❌ Error: Working directory not clean. Commit changes first." -ForegroundColor Red
        return
    }
    
    Write-Host "Pushing to main branch..." -ForegroundColor Yellow
    git push origin main
    
    Write-Host "✅ Deployment triggered! Check GitHub Actions for progress." -ForegroundColor Green
    Write-Host "Frontend: https://github.com/cekwedike/MusicSim/actions" -ForegroundColor Blue
}

# Run security audit
function Test-Security {
    Write-Host "🔒 Running security audit..." -ForegroundColor Cyan
    
    Write-Host "Frontend security audit..." -ForegroundColor Yellow
    npm audit --audit-level=moderate
    
    Write-Host "Backend security audit..." -ForegroundColor Yellow
    Set-Location backend
    npm audit --audit-level=moderate
    Set-Location ..
    
    Write-Host "✅ Security audit completed!" -ForegroundColor Green
}

# Check deployment status
function Get-DeploymentStatus {
    Write-Host "📊 MusicSim Deployment Status" -ForegroundColor Cyan
    Write-Host "============================" -ForegroundColor Cyan
    
    $branch = git branch --show-current
    $lastCommit = git log -1 --oneline
    
    Write-Host "Current Branch: $branch" -ForegroundColor Yellow
    Write-Host "Last Commit: $lastCommit" -ForegroundColor Yellow
    
    Write-Host "`nDeployment Links:" -ForegroundColor Green
    Write-Host "Frontend (Vercel): https://musicsim.vercel.app" -ForegroundColor Blue
    Write-Host "Backend (Render): https://musicsim-backend.onrender.com" -ForegroundColor Blue
    Write-Host "GitHub Actions: https://github.com/cekwedike/MusicSim/actions" -ForegroundColor Blue
}

# Setup development environment
function Setup-Development {
    Write-Host "👨‍💻 Setting up development environment..." -ForegroundColor Cyan
    
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    npm ci
    Set-Location backend
    npm ci
    Set-Location ..
    
    # Create environment files if they don't exist
    if (!(Test-Path ".env.local")) {
        Write-Host "Creating .env.local template..." -ForegroundColor Yellow
        @"
# Frontend Environment Variables
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_BACKEND_URL=http://localhost:3001
"@ | Out-File -FilePath ".env.local" -Encoding UTF8
    }
    
    if (!(Test-Path "backend\.env")) {
        Write-Host "Creating backend .env template..." -ForegroundColor Yellow
        @"
# Backend Environment Variables
NODE_ENV=development
PORT=3001
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_KEY=your_supabase_service_key
SUPABASE_JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:3000
"@ | Out-File -FilePath "backend\.env" -Encoding UTF8
    }
    
    Write-Host "✅ Development environment setup completed!" -ForegroundColor Green
    Write-Host "`nNext steps:" -ForegroundColor Cyan
    Write-Host "1. Update .env.local with your Supabase credentials" -ForegroundColor White
    Write-Host "2. Update backend\.env with your configuration" -ForegroundColor White
    Write-Host "3. Run 'npm run dev' to start development servers" -ForegroundColor White
}

# Clean build artifacts
function Clear-BuildArtifacts {
    Write-Host "🧹 Cleaning build artifacts..." -ForegroundColor Cyan
    
    if (Test-Path "dist") {
        Remove-Item -Recurse -Force "dist"
        Write-Host "Removed dist directory" -ForegroundColor Yellow
    }
    
    if (Test-Path "backend\node_modules\.cache") {
        Remove-Item -Recurse -Force "backend\node_modules\.cache"
        Write-Host "Removed backend cache" -ForegroundColor Yellow
    }
    
    Write-Host "✅ Clean completed!" -ForegroundColor Green
}

# Check for outdated dependencies
function Test-Dependencies {
    Write-Host "📊 Checking dependencies..." -ForegroundColor Cyan
    
    Write-Host "Frontend outdated packages:" -ForegroundColor Yellow
    npm outdated
    
    Write-Host "`nBackend outdated packages:" -ForegroundColor Yellow
    Set-Location backend
    npm outdated
    Set-Location ..
    
    Write-Host "`n✅ Dependency check completed!" -ForegroundColor Green
}

# Emergency stop all processes
function Stop-AllProcesses {
    Write-Host "🚨 Emergency: Stopping all Node.js processes..." -ForegroundColor Red
    
    Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force
    Get-Process -Name "npm" -ErrorAction SilentlyContinue | Stop-Process -Force
    
    Write-Host "✅ All processes stopped!" -ForegroundColor Green
}

# Display help
function Show-Help {
    Write-Host "🎵 MusicSim CI/CD PowerShell Commands" -ForegroundColor Cyan
    Write-Host "====================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Development:" -ForegroundColor Green
    Write-Host "  Setup-Development     Install dependencies and create env files" -ForegroundColor White
    Write-Host "  Test-CI              Simulate CI environment locally" -ForegroundColor White
    Write-Host "  Test-Security        Run security audit" -ForegroundColor White
    Write-Host "  Test-Dependencies    Check for outdated packages" -ForegroundColor White
    Write-Host ""
    Write-Host "Deployment:" -ForegroundColor Green
    Write-Host "  Deploy-Production    Deploy to production (main branch only)" -ForegroundColor White
    Write-Host "  Get-DeploymentStatus Check current deployment status" -ForegroundColor White
    Write-Host ""
    Write-Host "Maintenance:" -ForegroundColor Green
    Write-Host "  Clear-BuildArtifacts Clean build files" -ForegroundColor White
    Write-Host "  Stop-AllProcesses    Emergency stop all Node processes" -ForegroundColor White
    Write-Host ""
    Write-Host "Examples:" -ForegroundColor Yellow
    Write-Host "  PS> Setup-Development" -ForegroundColor Gray
    Write-Host "  PS> Test-CI" -ForegroundColor Gray
    Write-Host "  PS> Deploy-Production" -ForegroundColor Gray
}

# Export functions
Export-ModuleMember -Function Test-CI, Deploy-Production, Test-Security, Get-DeploymentStatus, Setup-Development, Clear-BuildArtifacts, Test-Dependencies, Stop-AllProcesses, Show-Help

# Show help by default
Show-Help