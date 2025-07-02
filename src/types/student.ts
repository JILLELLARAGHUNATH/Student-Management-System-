export interface Student {
  id: string;
  rollNumber: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  year: number;
  cgpa: number;
  address: string;
  enrollmentDate: string;
  status: 'Active' | 'Inactive' | 'Graduated';
  parent_name?: string;
  parent_contact?: string;
  parent_email?: string;
  dob?: string;
  gender?: string;
  emergency_contact?: string;
  admission_date?: string;
  notes?: string;
  total_fee?: number;
  fee_paid?: number;
  last_payment_date?: string;
  fee_status?: string;
  pending_fee?: number;
  photo?: string | null;
  nationality?: string;
  blood_group?: string;
  id_number?: string;
  category?: string;
  religion?: string;
  previous_school?: string;
  admission_type?: string;
  scholarship?: string;
  hostel?: boolean;
  transport?: boolean;
  alt_parent_contact?: string;
  parent_occupation?: string;
  parent_income?: string;
  payment_mode?: string;
  fee_receipt?: string | null;
  fee_concession?: string;
  medical_history?: string;
  emergency_person?: string;
  remarks?: string;
}

export interface StudentFormData {
  // Personal
  name: string;
  dob: string;
  gender: string;
  nationality: string;
  blood_group: string;
  id_number: string;
  category: string;
  religion: string;
  photo: string | null;
  // Academic
  roll_number: string;
  department: string;
  year: string;
  cgpa: string;
  previous_school: string;
  admission_type: string;
  scholarship: string;
  hostel: boolean;
  transport: boolean;
  // Parent
  parent_name: string;
  parent_contact: string;
  parent_email: string;
  parent_occupation: string;
  parent_income: string;
  alt_parent_contact: string;
  // Fee
  total_fee: string;
  fee_paid: string;
  payment_mode: string;
  fee_receipt: string | null;
  fee_concession: string;
  last_payment_date: string;
  fee_status: string;
  // Other
  medical_history: string;
  emergency_person: string;
  remarks: string;
}