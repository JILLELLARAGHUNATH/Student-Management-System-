import { useState, useEffect } from 'react';
import { Student, StudentFormData } from '../types/student';

const STORAGE_KEY = 'student-management-data';

export const useStudents = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setStudents(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading students:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveStudents = (updatedStudents: Student[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedStudents));
      setStudents(updatedStudents);
      console.log('Saved to localStorage:', updatedStudents);
    } catch (error) {
      console.error('Error saving students:', error);
    }
  };

  function mapFormToStudent(form: StudentFormData, id?: string, enrollmentDate?: string): Student {
    return {
      id: id || Date.now().toString(),
      rollNumber: form.roll_number,
      name: form.name,
      email: form.parent_email || '',
      phone: form.parent_contact || '',
      department: form.department,
      year: parseInt(form.year) || 1,
      cgpa: parseFloat(form.cgpa) || 0,
      address: '',
      enrollmentDate: enrollmentDate || new Date().toISOString().split('T')[0],
      status: 'Active',
      parent_name: form.parent_name,
      parent_contact: form.parent_contact,
      parent_email: form.parent_email,
      dob: form.dob,
      gender: form.gender,
      emergency_contact: form.alt_parent_contact || '',
      admission_date: '',
      notes: form.remarks || '',
      total_fee: parseFloat(form.total_fee) || 0,
      fee_paid: parseFloat(form.fee_paid) || 0,
      last_payment_date: form.last_payment_date,
      fee_status: form.fee_status,
      pending_fee: (parseFloat(form.total_fee) || 0) - (parseFloat(form.fee_paid) || 0),
      photo: form.photo,
      nationality: form.nationality,
      blood_group: form.blood_group,
      id_number: form.id_number,
      category: form.category,
      religion: form.religion,
      previous_school: form.previous_school,
      admission_type: form.admission_type,
      scholarship: form.scholarship,
      hostel: form.hostel,
      transport: form.transport,
      alt_parent_contact: form.alt_parent_contact,
      parent_occupation: form.parent_occupation,
      parent_income: form.parent_income,
      payment_mode: form.payment_mode,
      fee_receipt: form.fee_receipt,
      fee_concession: form.fee_concession,
      medical_history: form.medical_history,
      emergency_person: form.emergency_person,
      remarks: form.remarks,
    };
  }

  const addStudent = (formData: StudentFormData): Student => {
    console.log('addStudent called', formData);
    const newStudent = mapFormToStudent(formData);
    const updatedStudents = [...students, newStudent];
    saveStudents(updatedStudents);
    return newStudent;
  };

  const updateStudent = (id: string, formData: StudentFormData): Student | null => {
    const studentIndex = students.findIndex(s => s.id === id);
    if (studentIndex === -1) return null;
    const updatedStudent = mapFormToStudent(formData, id, students[studentIndex].enrollmentDate);
    const updatedStudents = [...students];
    updatedStudents[studentIndex] = updatedStudent;
    saveStudents(updatedStudents);
    return updatedStudent;
  };

  const deleteStudent = (id: string): boolean => {
    const updatedStudents = students.filter(s => s.id !== id);
    saveStudents(updatedStudents);
    return true;
  };

  const getStudent = (id: string): Student | undefined => {
    return students.find(s => s.id === id);
  };

  const searchStudents = (query: string): Student[] => {
    if (!query.trim()) return students;
    
    const lowerQuery = query.toLowerCase();
    return students.filter(student => 
      student.name.toLowerCase().includes(lowerQuery) ||
      student.rollNumber.toLowerCase().includes(lowerQuery) ||
      student.email.toLowerCase().includes(lowerQuery) ||
      student.department.toLowerCase().includes(lowerQuery)
    );
  };

  return {
    students,
    loading,
    addStudent,
    updateStudent,
    deleteStudent,
    getStudent,
    searchStudents,
  };
};