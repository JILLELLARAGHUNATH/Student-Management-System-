# Student Management System - Python/Tkinter

A desktop-based Student Management System built with Python and Tkinter GUI library, featuring SQLite database integration.

## Features

- **Student Management**: Add, edit, delete, and view student records
- **Search Functionality**: Search students by name, roll number, email, or department
- **Data Validation**: Form validation with error handling
- **Statistics Dashboard**: View total students, active/graduated counts, and average GPA
- **Export Functionality**: Export student data to CSV format
- **Database Integration**: SQLite database for persistent data storage
- **User-friendly GUI**: Clean and intuitive Tkinter interface

## Requirements

- Python 3.6 or higher
- No external packages required (uses only Python standard library)

## Installation & Setup

1. **Clone or download the project files**
2. **Ensure Python is installed** on your system
3. **Run the application**:
   ```bash
   python main.py
   ```

## Project Structure

```
student_management_system/
├── main.py              # Main application entry point
├── database.py          # Database operations and SQLite management
├── student_form.py      # Student form component for add/edit
├── student_table.py     # Table component for displaying students
├── search_bar.py        # Search functionality component
├── statistics.py        # Statistics display component
├── requirements.txt     # Dependencies (none required)
└── README.md           # This file
```

## Database Schema

The SQLite database (`student_management.db`) contains a single table:

```sql
CREATE TABLE students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    roll_number TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT NOT NULL,
    department TEXT NOT NULL,
    year INTEGER NOT NULL,
    gpa REAL NOT NULL,
    address TEXT,
    status TEXT DEFAULT 'Active',
    enrollment_date TEXT NOT NULL
);
```

## Usage

### Adding Students
1. Fill in the student information form on the left panel
2. All fields marked with * are required
3. Click "Save Student" to add the record

### Editing Students
1. Double-click on a student row in the table, or
2. Right-click and select "Edit" from the context menu
3. Modify the information in the form
4. Click "Save Student" to update

### Deleting Students
1. Right-click on a student row
2. Select "Delete" from the context menu
3. Confirm the deletion

### Searching
1. Enter search terms in the search bar
2. Press Enter or click "Search"
3. Use "Clear" to show all students

### Exporting Data
1. Click "Export CSV" button
2. Choose save location
3. Data will be exported in CSV format

## Features in Detail

### Form Validation
- Email format validation
- GPA range validation (0-4)
- Required field validation
- Duplicate roll number/email prevention

### Database Operations
- Automatic database creation
- CRUD operations with error handling
- Search functionality
- Statistics calculation

### User Interface
- Responsive layout
- Context menus
- Keyboard shortcuts
- Status-based row coloring
- Sortable columns

## Customization

### Adding New Departments
Edit the `departments` list in `student_form.py`:
```python
self.departments = [
    'Computer Science',
    'Your New Department',
    # ... other departments
]
```

### Modifying Year Options
Edit the `years` list in `student_form.py`:
```python
self.years = [1, 2, 3, 4, 5]  # Add more years if needed
```

### Changing Database Location
Modify the database name in `main.py`:
```python
self.db = DatabaseManager("your_database_name.db")
```

## Troubleshooting

### Common Issues

1. **Database Permission Error**
   - Ensure write permissions in the application directory
   - Run as administrator if necessary

2. **Tkinter Not Found**
   - Install tkinter: `sudo apt-get install python3-tk` (Linux)
   - Tkinter comes pre-installed with Python on Windows/Mac

3. **Application Won't Start**
   - Check Python version (3.6+ required)
   - Verify all files are in the same directory

## Development

### Adding New Features
1. Create new component files following the existing pattern
2. Import and integrate in `main.py`
3. Update database schema if needed in `database.py`

### Testing
- Test all CRUD operations
- Verify form validation
- Test search functionality
- Check export feature
- Validate database integrity

## License

This project is open source and available under the MIT License.

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review the code comments
3. Test with a fresh database file