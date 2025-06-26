# CloudCast Frame

CloudCast Frame is a web application for predicting cloud movements from satellite images, featuring a FastAPI backend and a React/Vite frontend.

---

## Table of Contents

- [Project Structure](#project-structure)
- [Backend Setup (FastAPI)](#backend-setup-fastapi)
- [Frontend Setup (React/Vite)](#frontend-setup-reactvite)
- [Development Workflow](#development-workflow)
- [Technologies Used](#technologies-used)
- [Notes](#notes)

---

## Project Structure

```
cloudcast_frame/
├── backend/
│   ├── app/
│   │   └── main.py
│   └── requirements.txt
├── frontend/
│   ├── src/
│   ├── index.html
│   ├── package.json
│   └── ... (config files)
└── README.md
```

---

## Backend Setup (FastAPI)

This folder contains the backend for the CloudCast Frame project, a FastAPI-based service for handling satellite image uploads and cloud movement prediction.

### Prerequisites

- **Python 3.8+**  
  [Download Python](https://www.python.org/downloads/)

- (Recommended) Create and activate a virtual environment:
  ```sh
  python -m venv venv
  # On Linux/macOS:
  source venv/bin/activate
  # On Windows:
  venv\Scripts\activate
  ```

### Installation

1. **Open a terminal and navigate to the backend folder:**
   ```sh
   cd backend
   ```

2. **Install dependencies:**
   ```sh
   pip install -r requirements.txt
   ```

### Running the Backend Server

Start the FastAPI app using Uvicorn:

```sh
uvicorn app.main:app --reload
```

- By default, the server runs at: [http://localhost:8000](http://localhost:8000)
- The backend allows CORS requests from the frontend at `http://localhost:8080`.

### API Endpoint

- `POST /predict`  
  Accepts **three satellite images** as form-data file uploads and returns a predicted frame (dummy gray image for now).

---

## Frontend Setup (React/Vite)

This folder contains the frontend for the CloudCast Frame project, built with React, Vite, TypeScript, shadcn-ui, and Tailwind CSS.

### Prerequisites

- **Node.js (v18+) and npm**
  - [Install Node.js & npm](https://nodejs.org/)
  - (Recommended) Use [nvm](https://github.com/nvm-sh/nvm#installing-and-updating) for managing Node versions.

### Installation

1. **Open a terminal and navigate to the frontend folder:**
   ```sh
   cd frontend
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

### Development Server

To start the frontend in development mode:

```sh
npm run dev
```

- By default, the app runs at: [http://localhost:8080](http://localhost:8080)
- The frontend expects the backend to be running at [http://localhost:8000](http://localhost:8000).

### Building for Production

To build the frontend for production deployment:

```sh
npm run build
```

### Linting and Formatting

- To check for lint errors:
  ```sh
  npm run lint
  ```
- To fix lint errors:
  ```sh
  npm run lint:fix
  ```

---

## Development Workflow

1. **Start the backend server first** (see Backend Setup).
2. **Start the frontend development server** (see Frontend Setup).
3. Open [http://localhost:8080](http://localhost:8080) in your browser to use the app.

---

## Technologies Used

**Backend:**
- FastAPI
- Uvicorn
- Pillow
- python-multipart

**Frontend:**
- Vite
- React
- TypeScript
- shadcn-ui
- Tailwind CSS

---

## Notes

- Make sure the backend is running **before** using the frontend.
- You can edit code using your preferred IDE (VSCode, WebStorm, etc).
- You can also use [GitHub Codespaces](https://github.com/features/codespaces) for online development.
- Modify CORS settings in `backend/app/main.py` if your frontend runs on a different port or domain.

---
