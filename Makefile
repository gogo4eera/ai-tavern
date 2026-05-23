UV := $(shell which uv 2>/dev/null || echo "$(HOME)/.local/bin/uv")

.PHONY: setup setup-backend setup-frontend lint format test dev-backend dev-frontend dev

setup: setup-backend setup-frontend

setup-backend:
	@echo "Setting up backend..."
	cd backend && (test -d .venv || $(UV) venv) && $(UV) pip install -r pyproject.toml --extra dev

setup-frontend:
	@echo "Setting up frontend..."
	cd frontend && npm install

lint:
	@echo "Linting backend..."
	cd backend && .venv/bin/ruff check app tests
	cd backend && .venv/bin/ruff format --check app tests

format:
	@echo "Formatting backend..."
	cd backend && .venv/bin/ruff check --fix app tests
	cd backend && .venv/bin/ruff format app tests

test:
	@echo "Running backend tests..."
	cd backend && .venv/bin/pytest tests

dev-backend:
	@echo "Starting backend..."
	cd backend && .venv/bin/uvicorn app.main:app --reload --port 8000

dev-frontend:
	@echo "Starting frontend..."
	cd frontend && npm run dev

dev:
	@echo "Starting backend and frontend concurrently..."
	$(MAKE) -j 2 dev-backend dev-frontend
