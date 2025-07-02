import sqlite3
import os
from datetime import datetime
from werkzeug.security import generate_password_hash

class DatabaseManager:
    def __init__(self, db_name="student_management.db"):
        self.db_name = db_name
        self.init_database()
    
    def init_database(self):
        """Initialize the database and create tables if they don't exist"""
        try:
            conn = sqlite3.connect(self.db_name)
            cursor = conn.cursor()
            
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS students (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    roll_number TEXT UNIQUE NOT NULL,
                    name TEXT NOT NULL,
                    email TEXT UNIQUE NOT NULL,
                    phone TEXT NOT NULL,
                    department TEXT NOT NULL,
                    year INTEGER NOT NULL,
                    cgpa REAL NOT NULL,
                    address TEXT,
                    status TEXT DEFAULT 'Active',
                    enrollment_date TEXT NOT NULL,
                    parent_name TEXT,
                    parent_contact TEXT,
                    parent_email TEXT,
                    dob TEXT,
                    gender TEXT,
                    emergency_contact TEXT,
                    admission_date TEXT,
                    notes TEXT,
                    total_fee REAL DEFAULT 0,
                    fee_paid REAL DEFAULT 0,
                    last_payment_date TEXT,
                    fee_status TEXT DEFAULT 'Unpaid'
                )
            ''')
            
            # Add new columns if upgrading existing DB
            columns = [
                ('parent_name', 'TEXT'),
                ('parent_contact', 'TEXT'),
                ('parent_email', 'TEXT'),
                ('dob', 'TEXT'),
                ('gender', 'TEXT'),
                ('emergency_contact', 'TEXT'),
                ('admission_date', 'TEXT'),
                ('notes', 'TEXT'),
                ('total_fee', 'REAL DEFAULT 0'),
                ('fee_paid', 'REAL DEFAULT 0'),
                ('last_payment_date', 'TEXT'),
                ('fee_status', 'TEXT DEFAULT "Unpaid"')
            ]
            for col, typ in columns:
                try:
                    cursor.execute(f'ALTER TABLE students ADD COLUMN {col} {typ}')
                except sqlite3.OperationalError:
                    pass  # Column already exists
            
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS users (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    username TEXT UNIQUE NOT NULL,
                    password_hash TEXT NOT NULL,
                    role TEXT NOT NULL DEFAULT 'staff'
                )
            ''')
            # Add default admin if not exists
            cursor.execute('SELECT * FROM users WHERE username = ?', ('admin',))
            if not cursor.fetchone():
                cursor.execute('INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)',
                               ('admin', generate_password_hash('admin123'), 'admin'))
            
            conn.commit()
            conn.close()
            
        except sqlite3.Error as e:
            raise Exception(f"Database initialization failed: {e}")
    
    def add_student(self, student_data):
        """Add a new student to the database"""
        try:
            conn = sqlite3.connect(self.db_name)
            cursor = conn.cursor()
            
            enrollment_date = datetime.now().strftime("%Y-%m-%d")
            
            cursor.execute('''
                INSERT INTO students (roll_number, name, email, phone, department, 
                                    year, cgpa, address, status, enrollment_date,
                                    parent_name, parent_contact, parent_email, dob, gender, emergency_contact, admission_date, notes,
                                    total_fee, fee_paid, last_payment_date, fee_status)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                student_data['roll_number'],
                student_data['name'],
                student_data['email'],
                student_data['phone'],
                student_data['department'],
                student_data['year'],
                student_data['cgpa'],
                student_data['address'],
                student_data['status'],
                student_data.get('admission_date') or enrollment_date,
                student_data.get('parent_name'),
                student_data.get('parent_contact'),
                student_data.get('parent_email'),
                student_data.get('dob'),
                student_data.get('gender'),
                student_data.get('emergency_contact'),
                student_data.get('admission_date') or enrollment_date,
                student_data.get('notes'),
                student_data.get('total_fee', 0),
                student_data.get('fee_paid', 0),
                student_data.get('last_payment_date'),
                student_data.get('fee_status', 'Unpaid')
            ))
            
            conn.commit()
            conn.close()
            
        except sqlite3.IntegrityError as e:
            if "roll_number" in str(e):
                raise Exception("Roll number already exists!")
            elif "email" in str(e):
                raise Exception("Email already exists!")
            else:
                raise Exception(f"Data integrity error: {e}")
        except sqlite3.Error as e:
            raise Exception(f"Failed to add student: {e}")
    
    def get_all_students(self):
        """Retrieve all students from the database"""
        try:
            conn = sqlite3.connect(self.db_name)
            cursor = conn.cursor()
            
            cursor.execute('SELECT * FROM students ORDER BY name')
            students = cursor.fetchall()
            
            conn.close()
            return students
            
        except sqlite3.Error as e:
            raise Exception(f"Failed to retrieve students: {e}")
    
    def get_student(self, student_id):
        """Retrieve a specific student by ID"""
        try:
            conn = sqlite3.connect(self.db_name)
            cursor = conn.cursor()
            
            cursor.execute('SELECT * FROM students WHERE id = ?', (student_id,))
            student = cursor.fetchone()
            
            conn.close()
            return student
            
        except sqlite3.Error as e:
            raise Exception(f"Failed to retrieve student: {e}")
    
    def update_student(self, student_id, student_data):
        """Update an existing student's information"""
        try:
            conn = sqlite3.connect(self.db_name)
            cursor = conn.cursor()
            
            cursor.execute('''
                UPDATE students 
                SET roll_number=?, name=?, email=?, phone=?, department=?, 
                    year=?, cgpa=?, address=?, status=?,
                    parent_name=?, parent_contact=?, parent_email=?, dob=?, gender=?, emergency_contact=?, admission_date=?, notes=?,
                    total_fee=?, fee_paid=?, last_payment_date=?, fee_status=?
                WHERE id=?
            ''', (
                student_data['roll_number'],
                student_data['name'],
                student_data['email'],
                student_data['phone'],
                student_data['department'],
                student_data['year'],
                student_data['cgpa'],
                student_data['address'],
                student_data['status'],
                student_data.get('parent_name'),
                student_data.get('parent_contact'),
                student_data.get('parent_email'),
                student_data.get('dob'),
                student_data.get('gender'),
                student_data.get('emergency_contact'),
                student_data.get('admission_date'),
                student_data.get('notes'),
                student_data.get('total_fee', 0),
                student_data.get('fee_paid', 0),
                student_data.get('last_payment_date'),
                student_data.get('fee_status', 'Unpaid'),
                student_id
            ))
            
            conn.commit()
            conn.close()
            
        except sqlite3.IntegrityError as e:
            if "roll_number" in str(e):
                raise Exception("Roll number already exists!")
            elif "email" in str(e):
                raise Exception("Email already exists!")
            else:
                raise Exception(f"Data integrity error: {e}")
        except sqlite3.Error as e:
            raise Exception(f"Failed to update student: {e}")
    
    def delete_student(self, student_id):
        """Delete a student from the database"""
        try:
            conn = sqlite3.connect(self.db_name)
            cursor = conn.cursor()
            
            cursor.execute('DELETE FROM students WHERE id = ?', (student_id,))
            
            conn.commit()
            conn.close()
            
        except sqlite3.Error as e:
            raise Exception(f"Failed to delete student: {e}")
    
    def search_students(self, query):
        """Search students by name, roll number, email, or department"""
        try:
            conn = sqlite3.connect(self.db_name)
            cursor = conn.cursor()
            
            search_query = f"%{query}%"
            cursor.execute('''
                SELECT * FROM students 
                WHERE name LIKE ? OR roll_number LIKE ? OR email LIKE ? OR department LIKE ?
                ORDER BY name
            ''', (search_query, search_query, search_query, search_query))
            
            students = cursor.fetchall()
            conn.close()
            return students
            
        except sqlite3.Error as e:
            raise Exception(f"Search failed: {e}")
    
    def get_statistics(self):
        """Get statistics about students"""
        try:
            conn = sqlite3.connect(self.db_name)
            cursor = conn.cursor()
            
            # Total students
            cursor.execute('SELECT COUNT(*) FROM students')
            total = cursor.fetchone()[0]
            
            # Active students
            cursor.execute('SELECT COUNT(*) FROM students WHERE status = "Active"')
            active = cursor.fetchone()[0]
            
            # Graduated students
            cursor.execute('SELECT COUNT(*) FROM students WHERE status = "Graduated"')
            graduated = cursor.fetchone()[0]
            
            # Average CGPA
            cursor.execute('SELECT AVG(cgpa) FROM students')
            avg_cgpa = cursor.fetchone()[0] or 0
            
            conn.close()
            
            return {
                'total': total,
                'active': active,
                'graduated': graduated,
                'average_cgpa': round(avg_cgpa, 2)
            }
            
        except sqlite3.Error as e:
            raise Exception(f"Failed to get statistics: {e}")
    
    def clear_all_students(self):
        """Clear all student records"""
        try:
            conn = sqlite3.connect(self.db_name)
            cursor = conn.cursor()
            
            cursor.execute('DELETE FROM students')
            
            conn.commit()
            conn.close()
            
        except sqlite3.Error as e:
            raise Exception(f"Failed to clear all students: {e}")

    def add_user(self, username, password, role='staff'):
        try:
            conn = sqlite3.connect(self.db_name)
            cursor = conn.cursor()
            cursor.execute('INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)',
                           (username, generate_password_hash(password), role))
            conn.commit()
            conn.close()
        except sqlite3.IntegrityError:
            raise Exception('Username already exists!')

    def get_users(self):
        conn = sqlite3.connect(self.db_name)
        cursor = conn.cursor()
        cursor.execute('SELECT id, username, role FROM users')
        users = cursor.fetchall()
        conn.close()
        return users

    def delete_user(self, user_id):
        conn = sqlite3.connect(self.db_name)
        cursor = conn.cursor()
        cursor.execute('DELETE FROM users WHERE id = ?', (user_id,))
        conn.commit()
        conn.close()

    def reset_password(self, user_id, new_password):
        conn = sqlite3.connect(self.db_name)
        cursor = conn.cursor()
        cursor.execute('UPDATE users SET password_hash = ? WHERE id = ?',
                       (generate_password_hash(new_password), user_id))
        conn.commit()
        conn.close()