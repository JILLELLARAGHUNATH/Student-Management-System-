# Student Management System

A simple web-based Student Management System built using Python, SQLite, HTML, and CSS.

## Features

- Add new students with ID, name, department, and year
- View all students in a table
- Update student department
- Delete students
- Professional UI with responsive design

## How to Run

1. Ensure you have Python installed (version 3.x)
2. Navigate to the project directory
3. Run the server: `python backend/server.py`
4. Open your web browser and go to `http://localhost:8080`
5. The application will load and you can start managing students

## Project Structure

- `backend/server.py`: HTTP server handling requests
- `backend/db.py`: Database connection and table creation
- `backend/crud.py`: CRUD operations for students
- `backend/main.py`: Test script for CRUD operations
- `frontend/index.html`: HTML template (served dynamically)
- `frontend/styles.css`: CSS styling
- `database/students.db`: SQLite database file

## Technologies Used

- Python (built-in libraries: http.server, sqlite3)
- SQLite for database
- HTML5 and CSS3 for frontend
