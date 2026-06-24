# Developer Guide: Resumaker Local Dev Environment

This guide covers running the Resumaker application suite locally in Docker.

## Prerequisites

1. **Docker Desktop** installed and running on your host system.
2. (Optional) **PowerShell** if you want to use the helper script.

---

## Quick Start

1. Open a PowerShell prompt in the root of the project.
2. Run the helper script:
   ```powershell
   .\local.ps1
   ```
   *This script automatically copies `.env.example` templates to `.env` files if they are missing, and runs Docker Compose.*

3. If not using PowerShell, copy the templates manually:
   - Copy `server/.env.example` to `server/.env`
   - Copy `client/.env.example` to `client/.env`
   - Then run:
     ```bash
     docker compose -f docker-compose.dev.yml up --build
     ```

4. **Add Google Gemini API Key**:
   Open `server/.env` and update the `GEMINI_API_KEY` with your actual key to enable resume evaluation and recommendations:
   ```env
   GEMINI_API_KEY=AIzaSy...
   ```

---

## Exposed Services & Ports

When the containers are running, you can access the following services on your host:

| Service | Host URL / Port | Container Port | Description |
| :--- | :--- | :--- | :--- |
| **Vite Frontend** | [http://localhost:5173](http://localhost:5173) | `5173` | React frontend application. Supports Hot Module Replacement (HMR). |
| **Django Backend** | [http://localhost:8000](http://localhost:8000) | `8000` | REST API, supporting auto-reload on code change. |
| **Django Admin** | [http://localhost:8000/admin/](http://localhost:8000/admin/) | `8000` | Django administration panel. |
| **PostgreSQL DB** | `localhost:5436` | `5432` | Dev database. Mapped to `5436` to prevent conflicts with local databases. |
| **Redis** | `localhost:6379` | `6379` | Message broker used by Celery. |

---

## Development Notes

### Live Code Reloading
- The `server` and `client` containers mount local directories (`./server` and `./client`) into the containers. Saving changes in your IDE on the host system triggers automatic reloading:
  - Frontend (Vite) uses HMR to update the page instantly without full reload.
  - Backend (Django) runs with `runserver` which auto-reloads.
- To prevent conflicts, host dependency folders (`server/venv` and `client/node_modules`) are excluded from mounting using anonymous volumes.

### Database Migrations
Django migrations run automatically when starting the stack via the Compose file entrypoint command:
`python manage.py migrate --noinput`

### background Tasks (Celery)
Celery worker runs as a background service inside the container `celery`. It is configured to run automatically and will pick up tasks dispatched by the Django server. If you make changes to Celery tasks (`server/generator/tasks.py`), you can restart the worker container to load your changes:
```bash
docker compose -f docker-compose.dev.yml restart celery
```
