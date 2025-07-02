import React from 'react';
import { Home, UserPlus, Users, DollarSign, FileText, Settings, LogOut, CheckSquare } from 'lucide-react';

const Sidebar: React.FC<{ onNavigate: (section: string) => void }> = ({ onNavigate }) => (
  <aside className="h-screen w-64 bg-blue-800 text-white flex flex-col shadow-lg fixed left-0 top-0 z-40 animate-fadeIn">
    <div className="flex items-center justify-center h-20 border-b border-blue-700">
      <span className="text-2xl font-bold tracking-wide">SMS Pro</span>
    </div>
    <nav className="flex-1 py-6 space-y-2">
      <button className="w-full flex items-center px-6 py-3 hover:bg-blue-700 transition" onClick={() => onNavigate('dashboard')}><Home className="mr-3" />Dashboard</button>
      <button className="w-full flex items-center px-6 py-3 hover:bg-blue-700 transition" onClick={() => onNavigate('add')}><UserPlus className="mr-3" />Add Student</button>
      <button className="w-full flex items-center px-6 py-3 hover:bg-blue-700 transition" onClick={() => onNavigate('view')}><Users className="mr-3" />View Students</button>
      <button className="w-full flex items-center px-6 py-3 hover:bg-blue-700 transition" onClick={() => onNavigate('fee')}><DollarSign className="mr-3" />Fee Management</button>
      <button className="w-full flex items-center px-6 py-3 hover:bg-blue-700 transition" onClick={() => onNavigate('reports')}><FileText className="mr-3" />Reports</button>
      <button className="w-full flex items-center px-6 py-3 hover:bg-blue-700 transition" onClick={() => onNavigate('settings')}><Settings className="mr-3" />Settings</button>
      <button className="w-full flex items-center px-6 py-3 hover:bg-blue-700 transition" onClick={() => onNavigate('attendance')}><CheckSquare className="mr-3" />Attendance</button>
    </nav>
    <div className="border-t border-blue-700 p-4">
      <button className="w-full flex items-center px-4 py-2 hover:bg-blue-700 transition" onClick={() => onNavigate('logout')}><LogOut className="mr-3" />Logout</button>
    </div>
  </aside>
);

export default Sidebar; 