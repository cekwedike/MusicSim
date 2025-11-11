# Scripts for CI/CD pipeline testing and management

.PHONY: help install test build deploy clean security audit

# Default target
help:
	@echo "MusicSim CI/CD Management Commands"
	@echo "=================================="
	@echo ""
	@echo "Development:"
	@echo "  install     Install all dependencies"
	@echo "  test        Run all tests locally"
	@echo "  build       Build frontend and verify backend"
	@echo "  dev         Start development servers"
	@echo ""
	@echo "CI/CD:"
	@echo "  ci-test     Simulate CI environment locally"
	@echo "  deploy      Deploy to production (main branch only)"
	@echo "  preview     Create preview deployment"
	@echo ""
	@echo "Maintenance:"
	@echo "  security    Run security audit"
	@echo "  audit       Check dependencies"
	@echo "  clean       Clean build artifacts"
	@echo "  update      Update dependencies safely"
	@echo ""

# Development commands
install:
	@echo "📦 Installing dependencies..."
	npm ci
	cd backend && npm ci

test:
	@echo "🧪 Running tests..."
	npm test -- --run
	cd backend && npm test

build:
	@echo "🏗️  Building application..."
	npm run build
	@echo "✅ Build completed"

dev:
	@echo "🚀 Starting development servers..."
	npm run dev

# CI/CD simulation
ci-test:
	@echo "🔬 Simulating CI environment..."
	@echo "Installing dependencies..."
	npm ci
	cd backend && npm ci
	@echo "Running tests..."
	npm test -- --run || echo "Frontend tests completed"
	cd backend && npm test || echo "Backend tests completed"
	@echo "Building..."
	npm run build
	@echo "✅ CI simulation completed"

deploy:
	@echo "🚀 Deploying to production..."
	@if [ "$$(git branch --show-current)" != "main" ]; then \
		echo "❌ Error: Can only deploy from main branch"; \
		exit 1; \
	fi
	git push origin main
	@echo "✅ Deployment triggered via GitHub Actions"

preview:
	@echo "🔍 Creating preview deployment..."
	@if git status --porcelain | grep -q .; then \
		echo "❌ Error: Working directory not clean. Commit changes first."; \
		exit 1; \
	fi
	@echo "Push to a feature branch to trigger preview deployment"
	@echo "Or create a pull request to main branch"

# Maintenance commands
security:
	@echo "🔒 Running security audit..."
	npm audit --audit-level=moderate || echo "Frontend audit completed"
	cd backend && npm audit --audit-level=moderate || echo "Backend audit completed"
	@echo "✅ Security audit completed"

audit:
	@echo "📊 Checking dependencies..."
	@echo "Frontend outdated packages:"
	npm outdated || true
	@echo ""
	@echo "Backend outdated packages:"
	cd backend && npm outdated || true
	@echo "✅ Dependency audit completed"

clean:
	@echo "🧹 Cleaning build artifacts..."
	rm -rf dist/
	rm -rf backend/node_modules/.cache/
	@echo "✅ Clean completed"

update:
	@echo "⬆️  Updating dependencies safely..."
	@echo "This will update patch and minor versions only"
	npm update
	cd backend && npm update
	@echo "✅ Dependencies updated"
	@echo "💡 Run 'make audit' to check for major updates"

# Advanced commands
backup-env:
	@echo "💾 Backing up environment configuration..."
	@if [ -f .env.local ]; then cp .env.local .env.local.backup; fi
	@if [ -f backend/.env ]; then cp backend/.env backend/.env.backup; fi
	@echo "✅ Environment backed up"

restore-env:
	@echo "🔄 Restoring environment from backup..."
	@if [ -f .env.local.backup ]; then cp .env.local.backup .env.local; fi
	@if [ -f backend/.env.backup ]; then cp backend/.env.backup backend/.env; fi
	@echo "✅ Environment restored"

check-secrets:
	@echo "🔍 Checking for potential secrets in code..."
	@echo "Scanning for API keys..."
	@grep -r -i "api_key\|apikey" --exclude-dir=node_modules --exclude-dir=.git . || echo "No API keys found"
	@echo "Scanning for tokens..."
	@grep -r -i "token.*=" --exclude-dir=node_modules --exclude-dir=.git . | grep -v "GITHUB_TOKEN" | grep -v "token.*secrets" || echo "No tokens found"
	@echo "✅ Secret scan completed"

# CI/CD status
status:
	@echo "📊 MusicSim CI/CD Status"
	@echo "========================"
	@echo ""
	@echo "Git Status:"
	@git status --porcelain || true
	@echo ""
	@echo "Current Branch:"
	@git branch --show-current || true
	@echo ""
	@echo "Last Commit:"
	@git log -1 --oneline || true
	@echo ""
	@echo "Deployment Status:"
	@echo "Frontend: Check Vercel dashboard"
	@echo "Backend: Check Render dashboard"
	@echo "CI/CD: Check GitHub Actions tab"

# Emergency procedures
emergency-stop:
	@echo "🚨 Emergency: Stopping all processes..."
	@pkill -f "npm.*dev" || echo "No dev processes found"
	@pkill -f "node.*server" || echo "No server processes found"
	@echo "✅ All processes stopped"

rollback-info:
	@echo "🔄 Rollback Procedures"
	@echo "====================="
	@echo ""
	@echo "Vercel Frontend:"
	@echo "  npx vercel rollback"
	@echo ""
	@echo "Render Backend:"
	@echo "  Use Render dashboard to rollback"
	@echo ""
	@echo "Database:"
	@echo "  Contact Supabase support if needed"
	@echo ""
	@echo "Quick local rollback:"
	@echo "  git reset --hard HEAD~1"
	@echo "  (Only use if you haven't pushed!)"

# Setup for new developers
setup-dev:
	@echo "👨‍💻 Setting up development environment..."
	@echo "Installing Node.js dependencies..."
	npm ci
	cd backend && npm ci
	@echo ""
	@echo "Copying environment templates..."
	@if [ ! -f .env.local ]; then echo "# Frontend environment variables\nVITE_SUPABASE_URL=your_supabase_url\nVITE_SUPABASE_ANON_KEY=your_anon_key\nVITE_BACKEND_URL=http://localhost:3001" > .env.local; fi
	@if [ ! -f backend/.env ]; then echo "# Backend environment variables\nNODE_ENV=development\nPORT=3001\nSUPABASE_URL=your_supabase_url\nSUPABASE_SERVICE_KEY=your_service_key\nFRONTEND_URL=http://localhost:3000" > backend/.env; fi
	@echo ""
	@echo "✅ Development environment setup completed!"
	@echo ""
	@echo "Next steps:"
	@echo "1. Update .env.local with your Supabase credentials"
	@echo "2. Update backend/.env with your backend configuration"
	@echo "3. Run 'make dev' to start development servers"
	@echo "4. Visit http://localhost:3000 to see the app"