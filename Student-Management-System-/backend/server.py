import http.server
import socketserver
import urllib.parse
import json
import webbrowser
import time
from db import create_table
from crud import create_student, read_students, update_student, delete_student, search_students

PORT = 8082

class StudentHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/frontend/styles.css':
            try:
                with open('frontend/styles.css', 'rb') as f:
                    self.send_response(200)
                    self.send_header('Content-type', 'text/css')
                    self.end_headers()
                    self.wfile.write(f.read())
            except FileNotFoundError:
                self.send_error(404)
        elif self.path.startswith('/'):
            self.send_response(200)
            self.send_header('Content-type', 'text/html')
            self.end_headers()
            parsed_path = urllib.parse.urlparse(self.path)
            query_params = urllib.parse.parse_qs(parsed_path.query)
            search_query = query_params.get('search', [None])[0]
            if search_query:
                students = search_students(search_query)
            else:
                students = read_students()
            html = self.generate_html(students)
            self.wfile.write(html.encode())
        else:
            super().do_GET()

    def do_POST(self):
        if self.path == '/add':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = urllib.parse.parse_qs(post_data.decode())
            try:
                student_id = int(data['id'][0])
                name = data['name'][0]
                department = data['department'][0]
                year = int(data['year'][0])
                create_student(student_id, name, department, year)
                self.send_response(302)
                self.send_header('Location', '/')
                self.end_headers()
            except Exception as e:
                self.send_error(400, f"Error adding student: {str(e)}")
        elif self.path.startswith('/update/'):
            parts = self.path.split('/')
            if len(parts) == 3:
                try:
                    student_id = int(parts[2])
                    content_length = int(self.headers['Content-Length'])
                    post_data = self.rfile.read(content_length)
                    data = urllib.parse.parse_qs(post_data.decode())
                    name = data.get('name', [None])[0]
                    department = data.get('department', [None])[0]
                    year = data.get('year', [None])[0] if data.get('year', [None])[0] else None
                    if year:
                        year = int(year)
                    update_student(student_id, name=name, department=department, year=year)
                    self.send_response(302)
                    self.send_header('Location', '/')
                    self.end_headers()
                except Exception as e:
                    self.send_error(400, f"Error updating student: {str(e)}")
        elif self.path.startswith('/delete/'):
            parts = self.path.split('/')
            if len(parts) == 3:
                try:
                    student_id = int(parts[2])
                    delete_student(student_id)
                    self.send_response(302)
                    self.send_header('Location', '/')
                    self.end_headers()
                except Exception as e:
                    self.send_error(400, f"Error deleting student: {str(e)}")
        else:
            self.send_error(404)

    def generate_html(self, students):
        search_value = ""
        student_rows = ""
        for student in students:
            student_rows += f"""
            <tr>
                <td>{student['id']}</td>
                <td>{student['name']}</td>
                <td>{student['department']}</td>
                <td>{student['year']}</td>
                <td class="actions">
                    <form action="/update/{student['id']}" method="post" class="update-form">
                        <input type="text" name="name" placeholder="Name" value="{student['name']}">
                        <input type="text" name="department" placeholder="Dept" value="{student['department']}">
                        <input type="number" name="year" placeholder="Year" value="{student['year']}">
                        <button type="submit" class="btn">Update</button>
                    </form>
                    <form action="/delete/{student['id']}" method="post" class="delete-form">
                        <button type="submit" class="btn btn-danger">Delete</button>
                    </form>
                </td>
            </tr>
            """

        html = f"""
        <!DOCTYPE html>
        <html lang="en">
        <head>
        <meta charset="UTF-8">
        <title>Student Management System</title>
        <link rel="stylesheet" href="/frontend/styles.css">
        </head>
        <body>
        <div class="container">
            <div class="header">
                <h1>Student Management System</h1>
            </div>
            <div class="content">
                <form action="/add" method="post" class="add-form">
                    <h2>Add New Student</h2>
                    <div class="form-group">
                        <div class="form-field">
                            <label for="id">Student ID</label>
                            <input type="number" id="id" name="id" required>
                        </div>
                        <div class="form-field">
                            <label for="name">Name</label>
                            <input type="text" id="name" name="name" required>
                        </div>
                        <div class="form-field">
                            <label for="department">Department</label>
                            <input type="text" id="department" name="department" required>
                        </div>
                        <div class="form-field">
                            <label for="year">Year</label>
                            <input type="number" id="year" name="year" required>
                        </div>
                        <button type="submit" class="btn">Add Student</button>
                    </div>
                </form>
                <form action="/" method="get" class="search-form">
                    <h2>Search Students</h2>
                    <div class="form-group">
                        <div class="form-field">
                            <label for="search">Search by ID, Name, Department, or Year</label>
                            <input type="text" id="search" name="search" placeholder="Enter search term..." value="{search_value}">
                        </div>
                        <button type="submit" class="btn">Search</button>
                    </div>
                </form>
                <div class="students-section">
                    <h2>Students List</h2>
                    <table>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Department</th>
                        <th>Year</th>
                        <th>Actions</th>
                    </tr>
                    {student_rows}
                    </table>
                </div>
            </div>
        </div>
        </body>
        </html>
        """
        return html

if __name__ == "__main__":
    create_table()
    url = f"http://localhost:{PORT}"
    print(f"Server started. Click here to open: {url}")
    webbrowser.open(url)
    with socketserver.TCPServer(("", PORT), StudentHandler) as httpd:
        print(f"Serving at port {PORT}")
        httpd.serve_forever()
