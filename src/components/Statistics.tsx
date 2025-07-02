import React from 'react';
import { Users, GraduationCap, TrendingUp, Award, DollarSign } from 'lucide-react';
import { Student } from '../types/student';

interface StatisticsProps {
  students: Student[];
}

export const Statistics: React.FC<StatisticsProps> = ({ students }) => {
  const totalStudents = students.length;
  const activeStudents = students.filter(s => s.status === 'Active').length;
  const graduatedStudents = students.filter(s => s.status === 'Graduated').length;
  const averageCgpa = students.length > 0 
    ? students.reduce((sum, s) => sum + s.cgpa, 0) / students.length 
    : 0;
  const totalPendingFee = students.reduce((sum, s) => sum + ((s.total_fee ?? 0) - (s.fee_paid ?? 0)), 0);

  const stats = [
    {
      title: 'Total Students',
      value: totalStudents,
      icon: Users,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'Active Students',
      value: activeStudents,
      icon: TrendingUp,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      title: 'Graduated',
      value: graduatedStudents,
      icon: GraduationCap,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    {
      title: 'Average CGPA',
      value: averageCgpa.toFixed(2),
      icon: Award,
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600'
    },
    {
      title: 'Total Pending Fee',
      value: totalPendingFee.toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
      icon: DollarSign,
      color: 'bg-red-500',
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
      {stats.map((stat, idx) => (
        <div key={stat.title} className={`p-6 rounded-lg shadow-md text-white ${stat.color} transform transition-transform duration-300 hover:scale-105 animate-fadeIn`} style={{ animationDelay: `${idx * 100}ms` }}>
          <div className="flex items-center mb-2">
            <stat.icon className="h-6 w-6 mr-2" />
            <span className="font-semibold text-lg">{stat.title}</span>
          </div>
          <div className="text-2xl font-bold">{stat.value}</div>
        </div>
      ))}
    </div>
  );
};