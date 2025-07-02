import React, { useState, useEffect } from 'react';
import { X, Save, User, Book, Users, DollarSign, CheckCircle } from 'lucide-react';
import { Student, StudentFormData } from '../types/student';
import { FeeReceipt } from './FeeReceipt';

interface StudentFormProps {
  student?: Student;
  onSave: (formData: StudentFormData) => void;
  onCancel: () => void;
  viewMode?: boolean;
}

const departments = [
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
];

const years = [1, 2, 3, 4];

const initialForm: StudentFormData = {
  // Personal
  name: '', dob: '', gender: '', nationality: '', blood_group: '', id_number: '', category: '', religion: '', photo: null,
  // Academic
  roll_number: '', department: '', year: '', cgpa: '', previous_school: '', admission_type: '', scholarship: '', hostel: false, transport: false,
  // Parent
  parent_name: '', parent_contact: '', parent_email: '', parent_occupation: '', parent_income: '', alt_parent_contact: '',
  // Fee
  total_fee: '', fee_paid: '', payment_mode: '', fee_receipt: null, fee_concession: '', last_payment_date: '', fee_status: 'Unpaid',
  // Other
  medical_history: '', emergency_person: '', remarks: '',
};

export const StudentForm: React.FC<StudentFormProps> = ({ student, onSave, onCancel, viewMode = false }) => {
  console.log('StudentForm rendered', { onSave });
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState<Partial<StudentFormData>>({});
  const [step, setStep] = useState(1);
  const totalSteps = 5;
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptData, setReceiptData] = useState<any>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(0); // 0: Personal, 1: Academic, 2: Parent, 3: Fee, 4: Other

  const tabSections = [
    {
      label: 'Personal',
      icon: <User size={28} />,
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label>Full Name *</label>
            {viewMode ? <div className="text-xl font-bold text-gray-800">{form.name}</div> : <input className={`input${errors.name ? ' border-red-500' : ''}`} value={form.name || ''} onChange={e => handleChange('name', e.target.value)} />}
            {errors.name && <div className="text-red-600 text-xs mt-1">{errors.name}</div>}
          </div>
          <div>
            <label>Date of Birth</label>
            {viewMode ? <div className="text-xl font-bold text-gray-800">{form.dob}</div> : <input type="date" className="input" value={form.dob || ''} onChange={e => handleChange('dob', e.target.value)} />}
          </div>
          <div>
            <label>Gender</label>
            {viewMode ? <div className="text-xl font-bold text-gray-800">{form.gender}</div> : (
              <select className="input" value={form.gender || ''} onChange={e => handleChange('gender', e.target.value)}>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            )}
          </div>
          <div>
            <label>Nationality</label>
            {viewMode ? <div className="text-xl font-bold text-gray-800">{form.nationality}</div> : <input className="input" value={form.nationality || ''} onChange={e => handleChange('nationality', e.target.value)} />}
          </div>
          <div>
            <label>Blood Group</label>
            {viewMode ? <div className="text-xl font-bold text-gray-800">{form.blood_group}</div> : <input className="input" value={form.blood_group || ''} onChange={e => handleChange('blood_group', e.target.value)} />}
          </div>
          <div>
            <label>ID Number</label>
            {viewMode ? <div className="text-xl font-bold text-gray-800">{form.id_number}</div> : <input className="input" value={form.id_number || ''} onChange={e => handleChange('id_number', e.target.value)} />}
          </div>
          <div>
            <label>Category</label>
            {viewMode ? <div className="text-xl font-bold text-gray-800">{form.category}</div> : <input className="input" value={form.category || ''} onChange={e => handleChange('category', e.target.value)} />}
          </div>
          <div>
            <label>Religion</label>
            {viewMode ? <div className="text-xl font-bold text-gray-800">{form.religion}</div> : <input className="input" value={form.religion || ''} onChange={e => handleChange('religion', e.target.value)} />}
          </div>
          <div>
            <label>Photo</label>
            {viewMode ? (form.photo && <img src={form.photo} alt="Student" className="h-24 w-24 rounded-full object-cover border-2 border-gray-200" />) : <input type="file" accept="image/*" onChange={e => handleFile('photo', e.target.files?.[0] || null)} className="input" />}
          </div>
        </div>
      ),
    },
    {
      label: 'Academic',
      icon: <Book size={28} />,
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label>Roll Number *</label>
            {viewMode ? <div className="text-xl font-bold text-gray-800">{form.roll_number}</div> : <input className={`input${errors.roll_number ? ' border-red-500' : ''}`} value={form.roll_number || ''} onChange={e => handleChange('roll_number', e.target.value)} />}
            {errors.roll_number && <div className="text-red-600 text-xs mt-1">{errors.roll_number}</div>}
          </div>
          <div>
            <label>Department *</label>
            {viewMode ? <div className="text-xl font-bold text-gray-800">{form.department}</div> : (
              <select className={`input${errors.department ? ' border-red-500' : ''}`} value={form.department || ''} onChange={e => handleChange('department', e.target.value)}>
                <option value="">Select Department</option>
                {departments.map(dept => <option key={dept} value={dept}>{dept}</option>)}
              </select>
            )}
            {errors.department && <div className="text-red-600 text-xs mt-1">{errors.department}</div>}
          </div>
          <div>
            <label>Year</label>
            {viewMode ? <div className="text-xl font-bold text-gray-800">{form.year}</div> : (
              <select className="input" value={form.year || ''} onChange={e => handleChange('year', e.target.value)}>
                <option value="">Select Year</option>
                {years.map(year => <option key={year} value={year}>{year}</option>)}
              </select>
            )}
          </div>
          <div>
            <label>CGPA (0-10)</label>
            {viewMode ? <div className="text-xl font-bold text-gray-800">{form.cgpa}</div> : <input type="number" step="0.01" min="0" max="10" className={`input${errors.cgpa ? ' border-red-500' : ''}`} value={form.cgpa || ''} onChange={e => handleChange('cgpa', e.target.value)} />}
            {errors.cgpa && <div className="text-red-600 text-xs mt-1">{errors.cgpa}</div>}
          </div>
          <div>
            <label>Admission Type</label>
            {viewMode ? <div className="text-xl font-bold text-gray-800">{form.admission_type}</div> : (
              <select className="input" value={form.admission_type || ''} onChange={e => handleChange('admission_type', e.target.value)}>
                <option value="">Select Type</option>
                <option value="Regular">Regular</option>
                <option value="Transfer">Transfer</option>
                <option value="International">International</option>
              </select>
            )}
          </div>
          <div>
            <label>Scholarship</label>
            {viewMode ? <div className="text-xl font-bold text-gray-800">{form.scholarship}</div> : <input className="input" value={form.scholarship || ''} onChange={e => handleChange('scholarship', e.target.value)} />}
          </div>
          <div>
            <label>Hostel Accommodation</label>
            {viewMode ? <input type="checkbox" checked={!!form.hostel} disabled /> : <input type="checkbox" checked={!!form.hostel} onChange={e => handleChange('hostel', e.target.checked)} />}
          </div>
          <div>
            <label>Transport Service</label>
            {viewMode ? <input type="checkbox" checked={!!form.transport} disabled /> : <input type="checkbox" checked={!!form.transport} onChange={e => handleChange('transport', e.target.checked)} />}
          </div>
        </div>
      ),
    },
    {
      label: 'Parent',
      icon: <Users size={28} />,
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label>Parent Name *</label>
            {viewMode ? <div className="text-xl font-bold text-gray-800">{form.parent_name}</div> : <input className={`input${errors.parent_name ? ' border-red-500' : ''}`} value={form.parent_name || ''} onChange={e => handleChange('parent_name', e.target.value)} />}
            {errors.parent_name && <div className="text-red-600 text-xs mt-1">{errors.parent_name}</div>}
          </div>
          <div>
            <label>Parent Contact *</label>
            {viewMode ? <div className="text-xl font-bold text-gray-800">{form.parent_contact}</div> : <input className={`input${errors.parent_contact ? ' border-red-500' : ''}`} value={form.parent_contact || ''} onChange={e => handleChange('parent_contact', e.target.value)} />}
            {errors.parent_contact && <div className="text-red-600 text-xs mt-1">{errors.parent_contact}</div>}
          </div>
          <div>
            <label>Parent Email *</label>
            {viewMode ? <div className="text-xl font-bold text-gray-800">{form.parent_email}</div> : <input type="email" className={`input${errors.parent_email ? ' border-red-500' : ''}`} value={form.parent_email || ''} onChange={e => handleChange('parent_email', e.target.value)} />}
            {errors.parent_email && <div className="text-red-600 text-xs mt-1">{errors.parent_email}</div>}
          </div>
          <div>
            <label>Occupation</label>
            {viewMode ? <div className="text-xl font-bold text-gray-800">{form.parent_occupation}</div> : <input className="input" value={form.parent_occupation || ''} onChange={e => handleChange('parent_occupation', e.target.value)} />}
          </div>
          <div>
            <label>Annual Income</label>
            {viewMode ? <div className="text-xl font-bold text-gray-800">{form.parent_income}</div> : <input className="input" value={form.parent_income || ''} onChange={e => handleChange('parent_income', e.target.value)} />}
          </div>
          <div>
            <label>Alternate Contact</label>
            {viewMode ? <div className="text-xl font-bold text-gray-800">{form.alt_parent_contact}</div> : <input className="input" value={form.alt_parent_contact || ''} onChange={e => handleChange('alt_parent_contact', e.target.value)} />}
          </div>
        </div>
      ),
    },
    {
      label: 'Fee',
      icon: <DollarSign size={28} />,
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label>Total Fee</label>
            {viewMode ? <div className="text-xl font-bold text-gray-800">{form.total_fee}</div> : <input className="input" value={form.total_fee || ''} onChange={e => handleChange('total_fee', e.target.value)} />}
          </div>
          <div>
            <label>Fee Paid</label>
            {viewMode ? <div className="text-xl font-bold text-gray-800">{form.fee_paid}</div> : <input className="input" value={form.fee_paid || ''} onChange={e => handleChange('fee_paid', e.target.value)} />}
          </div>
          <div>
            <label>Payment Mode</label>
            {viewMode ? <div className="text-xl font-bold text-gray-800">{form.payment_mode}</div> : (
              <select className="input" value={form.payment_mode || ''} onChange={e => handleChange('payment_mode', e.target.value)}>
                <option value="">Select Payment Mode</option>
                <option value="Cash">Cash</option>
                <option value="Card">Card</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Cheque">Cheque</option>
                <option value="Online Payment">Online Payment</option>
                <option value="UPI">UPI</option>
              </select>
            )}
          </div>
          <div>
            <label>Fee Concession</label>
            {viewMode ? <div className="text-xl font-bold text-gray-800">{form.fee_concession}</div> : <input className="input" value={form.fee_concession || ''} onChange={e => handleChange('fee_concession', e.target.value)} />}
          </div>
          <div>
            <label>Last Payment Date</label>
            {viewMode ? <div className="text-xl font-bold text-gray-800">{form.last_payment_date}</div> : <input type="date" className="input" value={form.last_payment_date || ''} onChange={e => handleChange('last_payment_date', e.target.value)} />}
          </div>
          <div>
            <label>Fee Status</label>
            {viewMode ? <div className="text-xl font-bold text-gray-800">{form.fee_status}</div> : (
              <select className="input" value={form.fee_status || ''} onChange={e => handleChange('fee_status', e.target.value)}>
                <option value="Unpaid">Unpaid</option>
                <option value="Partial">Partial</option>
                <option value="Paid">Paid</option>
              </select>
            )}
          </div>
        </div>
      ),
    },
    {
      label: 'Other',
      icon: <CheckCircle size={28} />,
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label>Medical History</label>
            {viewMode ? <div className="text-xl font-bold text-gray-800">{form.medical_history}</div> : <input className="input" value={form.medical_history || ''} onChange={e => handleChange('medical_history', e.target.value)} />}
          </div>
          <div>
            <label>Emergency Person</label>
            {viewMode ? <div className="text-xl font-bold text-gray-800">{form.emergency_person}</div> : <input className="input" value={form.emergency_person || ''} onChange={e => handleChange('emergency_person', e.target.value)} />}
          </div>
          <div>
            <label>Remarks</label>
            {viewMode ? <div className="text-xl font-bold text-gray-800">{form.remarks}</div> : <input className="input" value={form.remarks || ''} onChange={e => handleChange('remarks', e.target.value)} />}
          </div>
        </div>
      ),
    },
  ];

  useEffect(() => {
    if (student) {
      setForm({
        name: student.name || '',
        dob: student.dob || '',
        gender: student.gender || '',
        nationality: student.nationality || '',
        blood_group: student.blood_group || '',
        id_number: student.id_number || '',
        category: student.category || '',
        religion: student.religion || '',
        photo: student.photo || null,
        roll_number: student.rollNumber || '',
        department: student.department || '',
        year: student.year?.toString() || '',
        cgpa: student.cgpa?.toString() || '',
        previous_school: student.previous_school || '',
        admission_type: student.admission_type || '',
        scholarship: student.scholarship || '',
        hostel: student.hostel || false,
        transport: student.transport || false,
        parent_name: student.parent_name || '',
        parent_contact: student.parent_contact || '',
        parent_email: student.parent_email || '',
        parent_occupation: student.parent_occupation || '',
        parent_income: student.parent_income || '',
        alt_parent_contact: student.alt_parent_contact || '',
        total_fee: student.total_fee?.toString() || '',
        fee_paid: student.fee_paid?.toString() || '',
        payment_mode: student.payment_mode || '',
        fee_receipt: student.fee_receipt || null,
        fee_concession: student.fee_concession || '',
        last_payment_date: student.last_payment_date || '',
        fee_status: student.fee_status || 'Unpaid',
        medical_history: student.medical_history || '',
        emergency_person: student.emergency_person || '',
        remarks: student.remarks || '',
      });
    }
  }, [student]);

  const validateForm = (): boolean => {
    const newErrors: Partial<StudentFormData> = {};

    if (!form.roll_number.trim()) newErrors.roll_number = 'Roll number is required';
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.parent_email.trim()) newErrors.parent_email = 'Parent email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.parent_email)) {
      newErrors.parent_email = 'Please enter a valid email';
    }
    if (!form.parent_contact.trim()) newErrors.parent_contact = 'Parent contact is required';
    if (!form.department) newErrors.department = 'Department is required';
    const cgpaNum = parseFloat(form.cgpa);
    if (isNaN(cgpaNum) || cgpaNum < 0 || cgpaNum > 10) newErrors.cgpa = 'CGPA must be between 0 and 10';

    setErrors(newErrors);
    console.log('Validation errors:', JSON.stringify(newErrors));
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: string, value: any) => {
    const updatedForm = { ...form, [field]: value };
    
    // Auto-calculate fee adjustments when scholarship or total fee changes
    if (field === 'scholarship' || field === 'total_fee') {
      const totalFee = parseFloat(updatedForm.total_fee) || 0;
      const scholarship = parseFloat(updatedForm.scholarship) || 0;
      const adjustedFee = Math.max(0, totalFee - scholarship);
      updatedForm.total_fee = totalFee.toString();
      updatedForm.fee_paid = Math.min(parseFloat(updatedForm.fee_paid) || 0, adjustedFee).toString();
    }
    
    setForm(updatedForm);
  };
  const handleFile = (field: string, file: File | null) => setForm({ ...form, [field]: file ? URL.createObjectURL(file) : null });
  const handleSaveDraft = () => {
    localStorage.setItem('studentFormDraft', JSON.stringify(form));
    setToast('Draft saved!');
    console.log('Draft saved:', form);
    setForm(initialForm);
    setActiveTab(0);
    setTimeout(() => setToast(null), 2000);
  };
  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear all fields?')) {
      setForm(initialForm);
      setToast('Form cleared.');
      setTimeout(() => setToast(null), 2000);
    }
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting form', form);
    if (validateForm()) {
      onSave(form);
      setReceiptData({
        student: {
          name: form.name,
          roll_number: form.roll_number,
          department: form.department,
          year: form.year,
        },
        payment: {
          total_fee: form.total_fee,
          fee_paid: form.fee_paid,
          payment_mode: form.payment_mode,
          last_payment_date: form.last_payment_date,
          fee_status: form.fee_status,
          receipt_number: 'RCPT' + Date.now(),
          scholarship: form.scholarship,
        },
      });
      setShowReceipt(true);
      setToast('Student added and receipt generated!');
      setForm(initialForm);
      setActiveTab(0);
      setTimeout(() => setToast(null), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 overflow-y-auto">
      <div className="relative w-full max-w-screen-xl mx-auto my-12 bg-white rounded-3xl shadow-2xl p-10 flex flex-col gap-8 animate-fadeIn border-4 border-blue-200">
        {/* Close button */}
          <button
            onClick={onCancel}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-700 text-3xl font-bold transition-colors z-10"
          title="Close"
          >
          <X className="h-8 w-8" />
          </button>
        {/* Tab Navigation */}
        <div className="flex justify-center gap-8 mb-8">
          {tabSections.map((tab, idx) => (
            <button
              key={tab.label}
              className={`flex flex-col items-center px-4 py-2 rounded-xl transition-all duration-200 focus:outline-none ${activeTab === idx ? 'bg-blue-600 text-white scale-110 shadow-lg' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}
              onClick={() => setActiveTab(idx)}
              type="button"
              title={tab.label}
            >
              {tab.icon}
              <span className="text-xs mt-1 font-semibold">{tab.label}</span>
            </button>
          ))}
        </div>
        {/* Section Content */}
        <form onSubmit={handleSubmit} className="w-full">
          <div className="mb-8">
            {tabSections[activeTab].content}
            {/* Next/Previous Step Navigation and Print Receipt in Fee tab */}
            {!viewMode && (
              <div className="flex justify-between items-center mt-8">
                <button
                  type="button"
                  className="px-6 py-3 rounded-lg bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 disabled:opacity-50"
                  onClick={() => setActiveTab(activeTab - 1)}
                  disabled={activeTab === 0}
                >
                  Previous
                </button>
                {activeTab === 3 && (
                  <button
                    type="button"
                    className="px-6 py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 shadow"
                    onClick={() => {
                      setReceiptData({
                        student: {
                          name: form.name,
                          roll_number: form.roll_number,
                          department: form.department,
                          year: form.year,
                        },
                        payment: {
                          total_fee: form.total_fee,
                          fee_paid: form.fee_paid,
                          payment_mode: form.payment_mode,
                          last_payment_date: form.last_payment_date,
                          fee_status: form.fee_status,
                          receipt_number: 'RCPT' + Date.now(),
                          scholarship: form.scholarship,
                        },
                      });
                      setShowReceipt(true);
                    }}
                  >
                    Print Receipt
                  </button>
                )}
            <button
                  type="button"
                  className="px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 shadow disabled:opacity-50"
                  onClick={() => setActiveTab(activeTab + 1)}
                  disabled={activeTab === tabSections.length - 1}
                >
                  Next
            </button>
              </div>
            )}
          </div>
          {/* Sticky Action Buttons (hide in viewMode) */}
          {!viewMode && (
            <div className="sticky bottom-0 bg-white py-6 flex flex-wrap gap-4 justify-end border-t border-blue-100 z-20">
              <button type="button" onClick={handleSaveDraft} className="px-8 py-4 bg-yellow-500 text-white rounded-xl hover:bg-yellow-600 shadow transition-colors text-lg font-semibold">
                Save as Draft
              </button>
              <button type="button" onClick={handleClear} className="px-8 py-4 bg-gray-500 text-white rounded-xl hover:bg-gray-600 shadow transition-colors text-lg font-semibold">
                Clear All
              </button>
              <button type="submit" className="px-8 py-4 bg-blue-700 text-white rounded-xl hover:bg-blue-800 shadow transition-colors text-lg font-semibold">
                {student ? 'Update Student' : 'Submit Student'}
              </button>
            </div>
          )}
        </form>
      </div>
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-8 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-8 py-4 rounded-xl shadow-lg z-50 text-lg animate-fadeIn">
          {toast}
        </div>
      )}
      {/* Receipt Modal */}
      {showReceipt && receiptData && (
        <FeeReceipt
          student={receiptData.student}
          payment={receiptData.payment}
          onClose={() => setShowReceipt(false)}
        />
      )}
    </div>
  );
};