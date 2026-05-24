# AI Tavern NPC 🍻

AI Tavern NPC is an experimental sandbox designed to explore, build, and optimize LLM-driven AI agents in a narrative context. 

This repository serves as a practical laboratory to study memory retrieval, token efficiency, and agent behaviors.

---

## 🚀 Quick Start

### Prerequisites
Make sure you have the following installed on your machine:
* **Python**: `>= 3.11`
* **Node.js & npm**: Modern LTS version
* **uv**: A fast Python package installer and resolver.
  * If not installed, you can install it using:
    ```bash
    curl -LsSf https://astral.sh/uv/install.sh | sh
    ```

### 1. Configure Environment Variables
Copy the environment template in the `backend` folder and add your LLM API keys (e.g., Anthropic, Gemini, or OpenAI):
```bash
cp backend/.env.template backend/.env
```
Open `backend/.env` and fill in the required keys (e.g., `ANTHROPIC_API_KEY`).

### 2. Setup the Workspace
Initialize virtual environments and install dependencies for both the backend (via `uv`) and frontend (via `npm`):
```bash
make setup
```

### 3. Run Development Servers
Start both the FastAPI backend (port `8000`) and the React + Vite frontend (port `5173`) concurrently:
```bash
make dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser to interact with the game.

---

## 🛠️ Makefile Commands

We use a root-level `Makefile` to orchestrate common development workflows.

| Command | Action | Description |
| :--- | :--- | :--- |
| `make setup` | Setup All | Configures the backend python virtual environment and runs npm install for the frontend. |
| `make setup-backend` | Setup Backend | Configures the backend python virtual environment and installs dependencies using `uv`. |
| `make setup-frontend` | Setup Frontend | Installs npm packages for the frontend React application. |
| `make dev` | Run Dev Servers | Runs both backend and frontend development servers concurrently. |
| `make dev-backend` | Run Backend | Starts the FastAPI backend server (`uvicorn` on port `8000` with hot-reload). |
| `make dev-frontend` | Run Frontend | Starts the React + Vite frontend development server. |
| `make lint` | Run All Lints | Runs the backend linter (`ruff`) and the frontend linter (`eslint`). |
| `make lint-backend` | Lint Backend | Checks python code quality using `ruff check`. |
| `make lint-frontend` | Lint Frontend | Checks frontend code quality using `eslint`. |
| `make format` | Format All | Auto-formats backend python files (`ruff format`) and frontend files (`prettier`). |
| `make format-backend` | Format Backend | Auto-formats backend python files using `ruff format`. |
| `make format-frontend` | Format Frontend | Auto-formats frontend source code using `prettier`. |
| `make test` | Run All Tests | Runs the backend unit tests (`pytest`) and the frontend component tests (`vitest`). |
| `make test-backend` | Test Backend | Runs the backend pytest suite. |
| `make test-frontend` | Test Frontend | Runs the frontend vitest suite. |

---

## 📂 Project Structure

```text
ai-tavern/
├── backend/
│   ├── app/
│   │   ├── config.py       # Configuration loader via pydantic-settings
│   │   └── main.py         # FastAPI endpoints and LiteLLM agent logic
│   ├── tests/
│   │   └── test_main.py    # Pytest test suite for API endpoints
│   ├── pyproject.toml      # Python dependencies and Tool configs (Ruff, Pytest)
│   └── .env.template       # Environment variable template
├── frontend/
│   ├── src/
│   │   ├── components/     # React UI and NPCSprite Canvas components
│   │   ├── test/           # Vitest testing setup
│   │   ├── App.tsx         # Main entry, state, and API integration
│   │   ├── App.test.tsx    # Frontend component tests
│   │   └── index.css       # Custom pixel art styling and CSS grid layout
│   ├── .prettierrc         # Prettier code formatting rules
│   ├── package.json        # Frontend npm configuration and Vitest scripts
│   └── vite.config.ts      # Vite and Vitest configuration
├── Makefile                # Root orchestration Makefile
└── README.md               # Project documentation
```
