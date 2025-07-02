import React, { useState } from 'react';
import { Plus, Download, GraduationCap } from 'lucide-react';
import { useStudents } from './hooks/useStudents';
import { StudentForm } from './components/StudentForm';
import { StudentTable } from './components/StudentTable';
import { SearchBar } from './components/SearchBar';
import { Statistics } from './components/Statistics';
import { ConfirmDialog } from './components/ConfirmDialog';
import { Student, StudentFormData } from './types/student';
import Login from './components/Login';
import SplashScreen from './components/SplashScreen';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import { FeeManagement } from './components/FeeManagement';
import Attendance from './components/Attendance';

function App() {
  const { students, loading, addStudent, updateStudent, deleteStudent, searchStudents } = useStudents();
  
  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; studentId: string; studentName: string }>({
    isOpen: false,
    studentId: '',
    studentName: ''
  });
  const [isSplash, setIsSplash] = useState(true);
  const [section, setSection] = useState('dashboard');
  const [viewingStudent, setViewingStudent] = useState<Student | undefined>(undefined);

  const filteredStudents = searchStudents(searchQuery);

  const handleAddStudent = () => {
    setEditingStudent(undefined);
    setShowForm(true);
  };

  const handleEditStudent = (student: Student) => {
    setEditingStudent(student);
    setShowForm(true);
  };

  const handleSaveStudent = (formData: StudentFormData) => {
    console.log('handleSaveStudent called', formData);
    if (editingStudent) {
      updateStudent(editingStudent.id, formData);
    } else {
      addStudent(formData);
    }
    setShowForm(false);
    setEditingStudent(undefined);
  };

  const handleDeleteStudent = (id: string) => {
    const student = students.find(s => s.id === id);
    if (student) {
      setDeleteDialog({
        isOpen: true,
        studentId: id,
        studentName: student.name
      });
    }
  };

  const confirmDelete = () => {
    deleteStudent(deleteDialog.studentId);
    setDeleteDialog({ isOpen: false, studentId: '', studentName: '' });
  };

  const cancelDelete = () => {
    setDeleteDialog({ isOpen: false, studentId: '', studentName: '' });
  };

  const handleExport = () => {
    const csvContent = [
      ['Roll Number', 'Name', 'Email', 'Phone', 'Department', 'Year', 'CGPA', 'Status', 'Address', 'Enrollment Date'],
      ...filteredStudents.map(student => [
        student.rollNumber,
        student.name,
        student.email,
        student.phone,
        student.department,
        student.year.toString(),
        student.cgpa.toString(),
        student.status,
        student.address,
        student.enrollmentDate
      ])
    ].map(row => row.map(field => `"${field}"`).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'students.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
  };

  const handleViewStudent = (student: Student) => {
    setViewingStudent(student);
  };

  React.useEffect(() => {
    const timer = setTimeout(() => setIsSplash(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (isSplash) return <SplashScreen />;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <GraduationCap className="h-16 w-16 text-blue-600 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Loading students...</p>
        </div>
      </div>
    );
  }

  if (section === 'view') {
    console.log('Filtered students:', filteredStudents);
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar onNavigate={(s) => {
        setSection(s);
      }} />
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        <div className="flex-1">
          {section === 'dashboard' && (
            <>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Statistics students={students} />
              </div>
            </>
          )}
          {section === 'attendance' && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <Attendance />
            </div>
          )}
          {section === 'add' && (
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <StudentForm onSave={handleSaveStudent} onCancel={() => setSection('dashboard')} />
            </div>
          )}
          {section === 'view' && (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <h2 className="text-lg font-semibold text-gray-900">
                All Students ({filteredStudents.length})
              </h2>
              <div className="w-full sm:w-96">
                <SearchBar
                  query={searchQuery}
                  onQueryChange={setSearchQuery}
                  placeholder="Search by name, roll number, email, or department..."
                />
              </div>
            </div>
          </div>
          <div className="p-6">
            <StudentTable
              students={filteredStudents}
              onEdit={handleEditStudent}
              onDelete={handleDeleteStudent}
                    onView={handleViewStudent}
            />
          </div>
              </div>
              {viewingStudent && (
                <StudentForm
                  student={viewingStudent}
                  onSave={() => setViewingStudent(undefined)}
                  onCancel={() => setViewingStudent(undefined)}
                  viewMode={true}
                />
              )}
            </div>
          )}
          {section === 'fee' && (
            <FeeManagement students={students} />
          )}
          {section === 'reports' && (
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
              <h2 className="text-2xl font-bold text-blue-800 mb-4">Reports</h2>
              <p className="text-gray-600">Reports functionality coming soon. Please check back later.</p>
            </div>
          )}
          {section === 'settings' && (
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
              <h2 className="text-2xl font-bold text-blue-800 mb-4">Settings</h2>
              <p className="text-gray-600">Settings functionality coming soon. Please check back later.</p>
            </div>
          )}
        </div>
        <Footer />
      </div>
      {showForm && (
        <StudentForm
          student={editingStudent}
          onSave={handleSaveStudent}
          onCancel={() => setShowForm(false)}
          viewMode={false}
        />
      )}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        title="Delete Student"
        message={`Are you sure you want to delete ${deleteDialog.studentName}? This action cannot be undone.`}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
}

export default App;