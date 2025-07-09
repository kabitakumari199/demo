# Homework Manager

This is a simple application to manage homework assignments, built with a React frontend and a Python (Flask) backend.

## Project Structure

- `/frontend`: Contains the React application.
- `/backend`: Contains the Flask API.

## Setup and Running

You will need Node.js and npm installed for the frontend, and Python and pip for the backend.

### Backend (Python/Flask)

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

2.  **Create a virtual environment (recommended):**
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows use `venv\Scripts\activate`
    ```

3.  **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

4.  **Run the Flask development server:**
    ```bash
    python app.py
    ```
    The backend API will be running on `http://localhost:5000` by default.

### Frontend (React)

1.  **Navigate to the frontend directory (from the project root):**
    ```bash
    cd frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Start the React development server:**
    ```bash
    npm start
    ```
    The frontend application will open in your browser, usually at `http://localhost:3000`. It is proxied to the backend on port 5000 for API requests.

## API Endpoints (Backend)

The backend provides the following API endpoints:

-   `GET /api/homework`: Retrieves a list of all homework assignments.
-   `POST /api/homework`: Adds a new homework assignment.
    -   Request body (JSON): `{"title": "...", "subject": "...", "dueDate": "YYYY-MM-DD"}`
-   `PUT /api/homework/<id>`: Updates an existing homework assignment (e.g., mark as completed).
    -   Request body (JSON): `{"completed": true/false, "title": "...", ...}`
-   `DELETE /api/homework/<id>`: Deletes a homework assignment.

## Available Scripts (Frontend - from `frontend` directory)

-   `npm start`: Runs the app in development mode.
-   `npm test`: Launches the test runner (if tests are configured).
-   `npm run build`: Builds the app for production.

## Data Storage

Currently, the backend uses an in-memory list to store homework assignments. This means data will be lost when the backend server restarts. For persistent storage, a database would need to be integrated.
