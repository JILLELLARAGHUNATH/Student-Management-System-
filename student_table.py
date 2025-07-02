import tkinter as tk
from tkinter import ttk

class StudentTable:
    def __init__(self, parent, edit_callback, delete_callback):
        self.parent = parent
        self.edit_callback = edit_callback
        self.delete_callback = delete_callback
        
        self.setup_table()
    
    def setup_table(self):
        # Create frame for table
        self.frame = ttk.Frame(self.parent)
        
        # Create treeview
        columns = ('ID', 'Roll No', 'Name', 'Email', 'Phone', 'Department', 'Year', 'CGPA', 'Status')
        self.tree = ttk.Treeview(self.frame, columns=columns, show='headings', height=15)
        
        # Define headings
        self.tree.heading('ID', text='ID')
        self.tree.heading('Roll No', text='Roll No')
        self.tree.heading('Name', text='Name')
        self.tree.heading('Email', text='Email')
        self.tree.heading('Phone', text='Phone')
        self.tree.heading('Department', text='Department')
        self.tree.heading('Year', text='Year')
        self.tree.heading('CGPA', text='CGPA')
        self.tree.heading('Status', text='Status')
        
        # Configure column widths
        self.tree.column('ID', width=50, minwidth=50)
        self.tree.column('Roll No', width=80, minwidth=80)
        self.tree.column('Name', width=150, minwidth=100)
        self.tree.column('Email', width=180, minwidth=120)
        self.tree.column('Phone', width=100, minwidth=80)
        self.tree.column('Department', width=120, minwidth=100)
        self.tree.column('Year', width=60, minwidth=50)
        self.tree.column('CGPA', width=60, minwidth=50)
        self.tree.column('Status', width=80, minwidth=70)
        
        # Create scrollbars
        v_scrollbar = ttk.Scrollbar(self.frame, orient=tk.VERTICAL, command=self.tree.yview)
        h_scrollbar = ttk.Scrollbar(self.frame, orient=tk.HORIZONTAL, command=self.tree.xview)
        self.tree.configure(yscrollcommand=v_scrollbar.set, xscrollcommand=h_scrollbar.set)
        
        # Grid layout
        self.tree.grid(row=0, column=0, sticky=(tk.W, tk.E, tk.N, tk.S))
        v_scrollbar.grid(row=0, column=1, sticky=(tk.N, tk.S))
        h_scrollbar.grid(row=1, column=0, sticky=(tk.W, tk.E))
        
        # Configure grid weights
        self.frame.columnconfigure(0, weight=1)
        self.frame.rowconfigure(0, weight=1)
        
        # Context menu
        self.context_menu = tk.Menu(self.frame, tearoff=0)
        self.context_menu.add_command(label="Edit", command=self.edit_selected)
        self.context_menu.add_command(label="Delete", command=self.delete_selected)
        self.context_menu.add_separator()
        self.context_menu.add_command(label="View Details", command=self.view_details)
        
        # Bind events
        self.tree.bind("<Button-3>", self.show_context_menu)  # Right click
        self.tree.bind("<Double-1>", self.on_double_click)    # Double click
        
        # Add tags for row coloring
        self.tree.tag_configure('active', background='#e8f5e8')
        self.tree.tag_configure('inactive', background='#fff2e8')
        self.tree.tag_configure('graduated', background='#e8f0ff')
    
    def update_data(self, students):
        """Update table with new student data"""
        # Clear existing data
        for item in self.tree.get_children():
            self.tree.delete(item)
        
        # Insert new data
        for student in students:
            # Determine tag based on status
            tag = student[9].lower() if student[9] else 'active'
            
            self.tree.insert('', tk.END, values=student, tags=(tag,))
    
    def show_context_menu(self, event):
        """Show context menu on right click"""
        item = self.tree.selection()
        if item:
            self.context_menu.post(event.x_root, event.y_root)
    
    def on_double_click(self, event):
        """Handle double click to edit"""
        self.edit_selected()
    
    def edit_selected(self):
        """Edit selected student"""
        selection = self.tree.selection()
        if selection:
            item = self.tree.item(selection[0])
            student_id = item['values'][0]
            self.edit_callback(student_id)
    
    def delete_selected(self):
        """Delete selected student"""
        selection = self.tree.selection()
        if selection:
            item = self.tree.item(selection[0])
            student_id = item['values'][0]
            self.delete_callback(student_id)
    
    def view_details(self):
        """View detailed information of selected student"""
        selection = self.tree.selection()
        if selection:
            item = self.tree.item(selection[0])
            values = item['values']
            
            details = f"""
Student Details:
================
ID: {values[0]}
Roll Number: {values[1]}
Name: {values[2]}
Email: {values[3]}
Phone: {values[4]}
Department: {values[5]}
Year: {values[6]}
CGPA: {values[7]}
Address: {values[8] if len(values) > 8 else 'N/A'}
Status: {values[9] if len(values) > 9 else 'N/A'}
Enrollment Date: {values[10] if len(values) > 10 else 'N/A'}
            """
            
            # Create details window
            details_window = tk.Toplevel(self.parent)
            details_window.title("Student Details")
            details_window.geometry("400x300")
            details_window.resizable(False, False)
            
            text_widget = tk.Text(details_window, wrap=tk.WORD, padx=10, pady=10)
            text_widget.pack(fill=tk.BOTH, expand=True)
            text_widget.insert(tk.END, details)
            text_widget.config(state=tk.DISABLED)