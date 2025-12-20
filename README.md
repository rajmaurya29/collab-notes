# Collab Notes

This is a collaborative note-taking application with a React frontend and a Django backend.

## How to Run the Application

### Backend

1.  Navigate to the `backend` directory:
    ```bash
    cd backend
    ```
2.  Install the Python dependencies:
    ```bash
    pip install -r requirements.txt
    ```
3.  Run the database migrations:
    ```bash
    python manage.py migrate
    ```
4.  Start the backend server:
    ```bash
    python manage.py runserver
    ```

The backend server will be running on `http://127.0.0.1:8000`.

### Frontend

1.  Navigate to the `frontend` directory:
    ```bash
    cd frontend
    ```
2.  Install the Node.js dependencies:
    ```bash
    npm install
    ```
3.  Start the frontend development server:
    ```bash
    npm run dev
    ```

The frontend development server will be running on `http://localhost:5173`.
