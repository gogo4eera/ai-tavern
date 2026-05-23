# AI Tavern NPC 🍻

AI Tavern NPC is an experimental sandbox designed to explore, build, and optimize LLM-driven AI agents in a narrative context. 

This repository serves as a practical laboratory to study memory retrieval, token efficiency, and agent behaviors.

---

## 🚀 Quick Start

### Prerequisites
Make sure you have the following installed on your machine:
* **Python**: `>= 3.11`
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

### 2. Setup the Backend Environment
Initialize virtual environment and install backend dependencies (via `uv`):
```bash
make setup-backend
```

### 3. Run the Backend Server
Start the FastAPI backend (port `8000` with hot-reload enabled):
```bash
make dev-backend
```

---

## 🛠️ Makefile Commands

We use a root-level `Makefile` to orchestrate common development workflows.

| Command | Action | Description |
| :--- | :--- | :--- |
| `make setup-backend` | Setup Backend | Configures the backend python virtual environment and installs dependencies using `uv`. |
| `make dev-backend` | Run Backend | Starts the FastAPI backend server (`uvicorn` on port `8000` with hot-reload). |
| `make lint` | Lint Code | Checks python code quality and import formatting using `ruff check`. |
| `make format` | Format Code | Automatically reformats python files using `ruff format`. |
| `make test` | Run Tests | Runs the backend unit and integration test suite using `pytest`. |

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
├── Makefile                # Root orchestration Makefile
└── README.md               # Project documentation
```
