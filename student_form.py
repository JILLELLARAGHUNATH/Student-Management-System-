import tkinter as tk
from tkinter import ttk, messagebox
import re

class StudentForm:
    def __init__(self, parent, save_callback, clear_callback):
        self.parent = parent
        self.save_callback = save_callback
        self.clear_callback = clear_callback
        
        self.departments = [
            'Computer Science',
            'Electrical Engineering',
            'Mechanical Engineering',
            'Civil Engineering',
            'Business Administration',
            'Mathematics',
            'Physics',
            'Chemistry',
            'Biology',
            'Psychology'
        ]
        
        self.years = [1, 2, 3, 4]
        self.statuses = ['Active', 'Inactive', 'Graduated']
        
        self.setup_form()
    
    def setup_form(self):
        # Roll Number
        ttk.Label(self.parent, text="Roll Number *").grid(row=0, column=0, sticky=tk.W, pady=2)
        self.roll_number_var = tk.StringVar()
        ttk.Entry(self.parent, textvariable=self.roll_number_var, width=25).grid(row=0, column=1, pady=2, padx=(5, 0))
        
        # Name
        ttk.Label(self.parent, text="Full Name *").grid(row=1, column=0, sticky=tk.W, pady=2)
        self.name_var = tk.StringVar()
        ttk.Entry(self.parent, textvariable=self.name_var, width=25).grid(row=1, column=1, pady=2, padx=(5, 0))
        
        # Email
        ttk.Label(self.parent, text="Email *").grid(row=2, column=0, sticky=tk.W, pady=2)
        self.email_var = tk.StringVar()
        ttk.Entry(self.parent, textvariable=self.email_var, width=25).grid(row=2, column=1, pady=2, padx=(5, 0))
        
        # Phone
        ttk.Label(self.parent, text="Phone *").grid(row=3, column=0, sticky=tk.W, pady=2)
        self.phone_var = tk.StringVar()
        ttk.Entry(self.parent, textvariable=self.phone_var, width=25).grid(row=3, column=1, pady=2, padx=(5, 0))
        
        # Department
        ttk.Label(self.parent, text="Department *").grid(row=4, column=0, sticky=tk.W, pady=2)
        self.department_var = tk.StringVar()
        department_combo = ttk.Combobox(self.parent, textvariable=self.department_var, 
                                       values=self.departments, state="readonly", width=22)
        department_combo.grid(row=4, column=1, pady=2, padx=(5, 0))
        
        # Year
        ttk.Label(self.parent, text="Year").grid(row=5, column=0, sticky=tk.W, pady=2)
        self.year_var = tk.IntVar(value=1)
        year_combo = ttk.Combobox(self.parent, textvariable=self.year_var, 
                                 values=self.years, state="readonly", width=22)
        year_combo.grid(row=5, column=1, pady=2, padx=(5, 0))
        
        # CGPA
        ttk.Label(self.parent, text="CGPA").grid(row=6, column=0, sticky=tk.W, pady=2)
        self.cgpa_var = tk.DoubleVar(value=0.0)
        cgpa_spinbox = ttk.Spinbox(self.parent, from_=0.0, to=10.0, increment=0.01,
                                   textvariable=self.cgpa_var, width=23)
        cgpa_spinbox.grid(row=6, column=1, pady=2, padx=(5, 0))
        
        # Status
        ttk.Label(self.parent, text="Status").grid(row=7, column=0, sticky=tk.W, pady=2)
        self.status_var = tk.StringVar(value="Active")
        status_combo = ttk.Combobox(self.parent, textvariable=self.status_var, 
                                   values=self.statuses, state="readonly", width=22)
        status_combo.grid(row=7, column=1, pady=2, padx=(5, 0))
        
        # Address
        ttk.Label(self.parent, text="Address").grid(row=8, column=0, sticky=tk.W, pady=2)
        self.address_text = tk.Text(self.parent, height=3, width=25)
        self.address_text.grid(row=8, column=1, pady=2, padx=(5, 0))
        
        # Buttons
        button_frame = ttk.Frame(self.parent)
        button_frame.grid(row=9, column=0, columnspan=2, pady=10)
        
        ttk.Button(button_frame, text="Save Student", command=self.save_student).pack(side=tk.LEFT, padx=(0, 5))
        ttk.Button(button_frame, text="Clear Form", command=self.clear_form).pack(side=tk.LEFT)
    
    def validate_form(self):
        """Validate form data"""
        errors = []
        
        # Required fields
        if not self.roll_number_var.get().strip():
            errors.append("Roll number is required")
        
        if not self.name_var.get().strip():
            errors.append("Name is required")
        
        if not self.email_var.get().strip():
            errors.append("Email is required")
        elif not re.match(r'^[^\s@]+@[^\s@]+\.[^\s@]+$', self.email_var.get()):
            errors.append("Please enter a valid email address")
        
        if not self.phone_var.get().strip():
            errors.append("Phone number is required")
        
        if not self.department_var.get():
            errors.append("Department is required")
        
        # CGPA validation
        cgpa = float(self.cgpa_var.get())
        if cgpa < 0 or cgpa > 10:
            errors.append("CGPA must be between 0 and 10")
        
        return errors
    
    def save_student(self):
        """Save student data"""
        errors = self.validate_form()
        
        if errors:
            messagebox.showerror("Validation Error", "\n".join(errors))
            return
        
        student_data = {
            'roll_number': self.roll_number_var.get().strip(),
            'name': self.name_var.get().strip(),
            'email': self.email_var.get().strip(),
            'phone': self.phone_var.get().strip(),
            'department': self.department_var.get(),
            'year': int(self.year_var.get()),
            'cgpa': float(self.cgpa_var.get()),
            'address': self.address_text.get("1.0", tk.END).strip(),
            'status': self.status_var.get()
        }
        
        self.save_callback(student_data)
    
    def clear_form(self):
        """Clear all form fields"""
        self.roll_number_var.set("")
        self.name_var.set("")
        self.email_var.set("")
        self.phone_var.set("")
        self.department_var.set("")
        self.year_var.set(1)
        self.cgpa_var.set(0.0)
        self.status_var.set("Active")
        self.address_text.delete("1.0", tk.END)
        
        self.clear_callback()
    
    def load_student_data(self, student):
        """Load student data into form for editing"""
        self.roll_number_var.set(student[1])  # roll_number
        self.name_var.set(student[2])         # name
        self.email_var.set(student[3])        # email
        self.phone_var.set(student[4])        # phone
        self.department_var.set(student[5])   # department
        self.year_var.set(student[6])         # year
        self.cgpa_var.set(student[7])          # cgpa
        self.address_text.delete("1.0", tk.END)
        self.address_text.insert("1.0", student[8])  # address
        self.status_var.set(student[9])       # status