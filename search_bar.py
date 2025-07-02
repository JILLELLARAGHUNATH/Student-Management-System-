import tkinter as tk
from tkinter import ttk

class SearchBar:
    def __init__(self, parent, search_callback):
        self.parent = parent
        self.search_callback = search_callback
        
        self.setup_search_bar()
    
    def setup_search_bar(self):
        self.frame = ttk.Frame(self.parent)
        
        # Search label
        ttk.Label(self.frame, text="Search:").pack(side=tk.LEFT, padx=(0, 5))
        
        # Search entry
        self.search_var = tk.StringVar()
        self.search_entry = ttk.Entry(self.frame, textvariable=self.search_var, width=40)
        self.search_entry.pack(side=tk.LEFT, padx=(0, 5))
        
        # Search button
        ttk.Button(self.frame, text="Search", command=self.perform_search).pack(side=tk.LEFT, padx=(0, 5))
        
        # Clear button
        ttk.Button(self.frame, text="Clear", command=self.clear_search).pack(side=tk.LEFT)
        
        # Bind Enter key to search
        self.search_entry.bind('<Return>', lambda event: self.perform_search())
        
        # Bind key release for real-time search (optional)
        self.search_entry.bind('<KeyRelease>', self.on_key_release)
    
    def perform_search(self):
        """Perform search with current query"""
        query = self.search_var.get().strip()
        self.search_callback(query)
    
    def clear_search(self):
        """Clear search and show all results"""
        self.search_var.set("")
        self.search_callback("")
    
    def on_key_release(self, event):
        """Handle key release for real-time search"""
        # Optional: Implement real-time search with a small delay
        # For now, we'll keep it simple and only search on Enter or button click
        pass