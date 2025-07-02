import tkinter as tk
from tkinter import ttk, messagebox
from database import DatabaseManager
from student_form import StudentForm
from student_table import StudentTable
from search_bar import SearchBar
from statistics import Statistics

class StudentManagementSystem:
    def __init__(self):
        self.root = tk.Tk()
        self.root.title("Student Management System")
        self.root.geometry("1200x800")
        self.root.configure(bg='#f0f0f0')
        
        # Initialize database
        self.db = DatabaseManager()
        
        # Initialize components
        self.setup_ui()
        self.refresh_data()
        
    def setup_ui(self):
        # Main container
        main_frame = ttk.Frame(self.root, padding="10")
        main_frame.grid(row=0, column=0, sticky=(tk.W, tk.E, tk.N, tk.S))
        
        # Configure grid weights
        self.root.columnconfigure(0, weight=1)
        self.root.rowconfigure(0, weight=1)
        main_frame.columnconfigure(1, weight=1)
        main_frame.rowconfigure(2, weight=1)
        
        # Title
        title_label = ttk.Label(main_frame, text="Student Management System", 
                               font=('Arial', 20, 'bold'))
        title_label.grid(row=0, column=0, columnspan=3, pady=(0, 20))
        
        # Statistics panel
        self.statistics = Statistics(main_frame, self.db)
        self.statistics.frame.grid(row=1, column=0, columnspan=3, sticky=(tk.W, tk.E), pady=(0, 10))
        
        # Left panel - Form
        form_frame = ttk.LabelFrame(main_frame, text="Student Information", padding="10")
        form_frame.grid(row=2, column=0, sticky=(tk.W, tk.E, tk.N, tk.S), padx=(0, 10))
        
        self.student_form = StudentForm(form_frame, self.on_save_student, self.on_clear_form)
        
        # Right panel - Table and search
        table_frame = ttk.Frame(main_frame)
        table_frame.grid(row=2, column=1, columnspan=2, sticky=(tk.W, tk.E, tk.N, tk.S))
        table_frame.columnconfigure(0, weight=1)
        table_frame.rowconfigure(1, weight=1)
        
        # Search bar
        self.search_bar = SearchBar(table_frame, self.on_search)
        self.search_bar.frame.grid(row=0, column=0, sticky=(tk.W, tk.E), pady=(0, 10))
        
        # Student table
        self.student_table = StudentTable(table_frame, self.on_edit_student, self.on_delete_student)
        self.student_table.frame.grid(row=1, column=0, sticky=(tk.W, tk.E, tk.N, tk.S))
        
        # Buttons frame
        buttons_frame = ttk.Frame(main_frame)
        buttons_frame.grid(row=3, column=0, columnspan=3, pady=(10, 0))
        
        ttk.Button(buttons_frame, text="Refresh", command=self.refresh_data).pack(side=tk.LEFT, padx=(0, 5))
        ttk.Button(buttons_frame, text="Export CSV", command=self.export_csv).pack(side=tk.LEFT, padx=5)
        ttk.Button(buttons_frame, text="Clear All", command=self.clear_all_data).pack(side=tk.LEFT, padx=5)
        
    def on_save_student(self, student_data):
        try:
            if hasattr(self, 'editing_student_id') and self.editing_student_id:
                # Update existing student
                self.db.update_student(self.editing_student_id, student_data)
                messagebox.showinfo("Success", "Student updated successfully!")
                self.editing_student_id = None
            else:
                # Add new student
                self.db.add_student(student_data)
                messagebox.showinfo("Success", "Student added successfully!")
            
            self.refresh_data()
            self.student_form.clear_form()
            
        except Exception as e:
            messagebox.showerror("Error", f"Failed to save student: {str(e)}")
    
    def on_clear_form(self):
        self.student_form.clear_form()
        if hasattr(self, 'editing_student_id'):
            self.editing_student_id = None
    
    def on_edit_student(self, student_id):
        try:
            student = self.db.get_student(student_id)
            if student:
                self.student_form.load_student_data(student)
                self.editing_student_id = student_id
        except Exception as e:
            messagebox.showerror("Error", f"Failed to load student: {str(e)}")
    
    def on_delete_student(self, student_id):
        try:
            student = self.db.get_student(student_id)
            if student and messagebox.askyesno("Confirm Delete", 
                                             f"Are you sure you want to delete {student[2]}?"):
                self.db.delete_student(student_id)
                messagebox.showinfo("Success", "Student deleted successfully!")
                self.refresh_data()
        except Exception as e:
            messagebox.showerror("Error", f"Failed to delete student: {str(e)}")
    
    def on_search(self, query):
        try:
            if query.strip():
                students = self.db.search_students(query)
            else:
                students = self.db.get_all_students()
            self.student_table.update_data(students)
        except Exception as e:
            messagebox.showerror("Error", f"Search failed: {str(e)}")
    
    def refresh_data(self):
        try:
            students = self.db.get_all_students()
            self.student_table.update_data(students)
            self.statistics.update_statistics()
        except Exception as e:
            messagebox.showerror("Error", f"Failed to refresh data: {str(e)}")
    
    def export_csv(self):
        try:
            from tkinter import filedialog
            import csv
            
            filename = filedialog.asksaveasfilename(
                defaultextension=".csv",
                filetypes=[("CSV files", "*.csv"), ("All files", "*.*")]
            )
            
            if filename:
                students = self.db.get_all_students()
                with open(filename, 'w', newline='', encoding='utf-8') as file:
                    writer = csv.writer(file)
                    writer.writerow(['ID', 'Roll Number', 'Name', 'Email', 'Phone', 
                                   'Department', 'Year', 'CGPA', 'Address', 'Status', 'Enrollment Date'])
                    writer.writerows(students)
                
                messagebox.showinfo("Success", f"Data exported to {filename}")
        except Exception as e:
            messagebox.showerror("Error", f"Export failed: {str(e)}")
    
    def clear_all_data(self):
        if messagebox.askyesno("Confirm Clear All", 
                              "Are you sure you want to delete all student records? This cannot be undone."):
            try:
                self.db.clear_all_students()
                messagebox.showinfo("Success", "All student records cleared!")
                self.refresh_data()
            except Exception as e:
                messagebox.showerror("Error", f"Failed to clear data: {str(e)}")
    
    def run(self):
        self.root.mainloop()

if __name__ == "__main__":
    app = StudentManagementSystem()
    app.run()