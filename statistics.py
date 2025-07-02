import tkinter as tk
from tkinter import ttk

class Statistics:
    def __init__(self, parent, database):
        self.parent = parent
        self.database = database
        
        self.setup_statistics()
    
    def setup_statistics(self):
        self.frame = ttk.LabelFrame(self.parent, text="Statistics", padding="10")
        
        # Create statistics labels
        self.total_label = ttk.Label(self.frame, text="Total Students: 0", font=('Arial', 10, 'bold'))
        self.total_label.grid(row=0, column=0, padx=10, pady=5)
        
        self.active_label = ttk.Label(self.frame, text="Active: 0", font=('Arial', 10))
        self.active_label.grid(row=0, column=1, padx=10, pady=5)
        
        self.graduated_label = ttk.Label(self.frame, text="Graduated: 0", font=('Arial', 10))
        self.graduated_label.grid(row=0, column=2, padx=10, pady=5)
        
        self.cgpa_label = ttk.Label(self.frame, text="Average CGPA: 0.00", font=('Arial', 10))
        self.cgpa_label.grid(row=0, column=3, padx=10, pady=5)
        
        # Update statistics on initialization
        self.update_statistics()
    
    def update_statistics(self):
        """Update statistics display"""
        try:
            stats = self.database.get_statistics()
            
            self.total_label.config(text=f"Total Students: {stats['total']}")
            self.active_label.config(text=f"Active: {stats['active']}")
            self.graduated_label.config(text=f"Graduated: {stats['graduated']}")
            self.cgpa_label.config(text=f"Average CGPA: {stats['average_cgpa']}")
            
        except Exception as e:
            print(f"Error updating statistics: {e}")