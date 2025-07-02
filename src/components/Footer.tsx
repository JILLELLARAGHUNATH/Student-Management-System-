import React from 'react';
import Clock from './Clock';

const Footer: React.FC = () => (
  <footer className="w-full bg-blue-900 text-white py-3 flex items-center justify-between px-8 mt-8 animate-fadeIn">
    <span>© {new Date().getFullYear()} Student Management System Pro</span>
    <Clock />
  </footer>
);

export default Footer; 