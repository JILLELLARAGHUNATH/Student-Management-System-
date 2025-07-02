import React from 'react';
import { Printer, Download, X } from 'lucide-react';

interface FeeReceiptProps {
  student: {
    name: string;
    roll_number: string;
    department: string;
    year: string;
  };
  payment: {
    total_fee: string;
    fee_paid: string;
    payment_mode: string;
    last_payment_date: string;
    fee_status: string;
    receipt_number: string;
    scholarship?: string;
  };
  onClose: () => void;
}

export const FeeReceipt: React.FC<FeeReceiptProps> = ({ student, payment, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Create a PDF or download the receipt
    const receiptContent = document.getElementById('receipt-content');
    if (receiptContent) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Fee Receipt - ${student.name}</title>
              <style>
                body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
                .receipt { max-width: 800px; margin: 0 auto; border: 2px solid #333; padding: 30px; }
                .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
                .school-name { font-size: 28px; font-weight: bold; color: #1f2937; margin-bottom: 5px; }
                .school-tagline { font-size: 14px; color: #6b7280; margin-bottom: 10px; }
                .receipt-title { font-size: 24px; font-weight: bold; color: #dc2626; }
                .receipt-number { font-size: 16px; color: #374151; margin-top: 10px; }
                .student-info, .payment-info { margin-bottom: 30px; }
                .section-title { font-size: 18px; font-weight: bold; color: #1f2937; margin-bottom: 15px; border-bottom: 1px solid #d1d5db; padding-bottom: 5px; }
                .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
                .info-item { margin-bottom: 10px; }
                .label { font-weight: bold; color: #374151; }
                .value { color: #1f2937; }
                .amount { font-size: 20px; font-weight: bold; color: #dc2626; }
                .footer { margin-top: 40px; text-align: center; border-top: 1px solid #d1d5db; padding-top: 20px; }
                .signature-line { border-top: 1px solid #000; width: 200px; margin: 0 auto; margin-top: 50px; }
                .signature-label { text-align: center; margin-top: 5px; font-size: 12px; }
                @media print {
                  .no-print { display: none; }
                  body { margin: 0; }
                  .receipt { border: none; }
                }
              </style>
            </head>
            <body>
              ${receiptContent.innerHTML}
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
      }
    }
  };

  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const originalFee = parseFloat(payment.total_fee || '0');
  const scholarship = parseFloat(payment.scholarship || '0');
  const finalFee = Math.max(0, originalFee - scholarship);
  const pendingAmount = finalFee - parseFloat(payment.fee_paid || '0');

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 animate-fadeIn p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex-shrink-0 p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Fee Receipt</h2>
            <div className="flex items-center space-x-3">
              <button
                onClick={handlePrint}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Printer className="h-4 w-4 mr-2" />
                Print
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </button>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Receipt Content */}
        <div className="p-8">
          <div id="receipt-content" className="receipt bg-white border-2 border-gray-300 rounded-lg p-8">
            {/* School Header */}
            <div className="header">
              <div className="school-name">EXCELLENCE ACADEMY</div>
              <div className="school-tagline">Empowering Minds, Building Futures</div>
              <div className="receipt-title">FEE RECEIPT</div>
              <div className="receipt-number">Receipt #: {payment.receipt_number}</div>
              <div className="text-sm text-gray-600 mt-2">Date: {currentDate}</div>
            </div>

            {/* Student Information */}
            <div className="student-info">
              <div className="section-title">Student Information</div>
              <div className="info-grid">
                <div className="info-item">
                  <span className="label">Student Name:</span>
                  <span className="value ml-2">{student.name}</span>
                </div>
                <div className="info-item">
                  <span className="label">Roll Number:</span>
                  <span className="value ml-2">{student.roll_number}</span>
                </div>
                <div className="info-item">
                  <span className="label">Department:</span>
                  <span className="value ml-2">{student.department}</span>
                </div>
                <div className="info-item">
                  <span className="label">Year:</span>
                  <span className="value ml-2">{student.year}</span>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="payment-info">
              <div className="section-title">Payment Details</div>
              
              {/* Fee Breakdown */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h5 className="font-semibold text-gray-800 mb-3">Fee Breakdown</h5>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Original Fee:</span>
                    <span className="font-medium">₹{originalFee.toFixed(2)}</span>
                  </div>
                  {scholarship > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Scholarship:</span>
                      <span className="font-medium text-green-600">- ₹{scholarship.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="border-t pt-2 flex justify-between">
                    <span className="font-semibold text-gray-800">Final Fee:</span>
                    <span className="font-bold text-blue-600">₹{finalFee.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              <div className="info-grid">
                <div className="info-item">
                  <span className="label">Amount Paid:</span>
                  <span className="amount ml-2 text-green-600">₹{payment.fee_paid || '0'}</span>
                </div>
                <div className="info-item">
                  <span className="label">Pending Amount:</span>
                  <span className="amount ml-2 text-red-600">₹{pendingAmount.toFixed(2)}</span>
                </div>
                <div className="info-item">
                  <span className="label">Payment Mode:</span>
                  <span className="value ml-2">{payment.payment_mode || 'Not specified'}</span>
                </div>
                <div className="info-item">
                  <span className="label">Payment Date:</span>
                  <span className="value ml-2">{payment.last_payment_date || currentDate}</span>
                </div>
                <div className="info-item">
                  <span className="label">Status:</span>
                  <span className={`value ml-2 px-2 py-1 rounded text-sm ${
                    payment.fee_status === 'Paid' ? 'bg-green-100 text-green-800' :
                    payment.fee_status === 'Partial' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {payment.fee_status || 'Unpaid'}
                  </span>
                </div>
                {scholarship > 0 && (
                  <div className="info-item">
                    <span className="label">Scholarship Applied:</span>
                    <span className="value ml-2 text-green-600 font-medium">
                      {((scholarship / originalFee) * 100).toFixed(1)}% (₹{scholarship.toFixed(2)})
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <div className="section-title">Terms & Conditions</div>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• This receipt is valid for the current academic year only</li>
                <li>• Please keep this receipt for future reference</li>
                <li>• Payment of remaining fees should be completed before the due date</li>
                <li>• No refunds will be processed after 30 days of payment</li>
                <li>• For any queries, please contact the accounts department</li>
              </ul>
            </div>

            {/* Footer */}
            <div className="footer">
              <div className="signature-line"></div>
              <div className="signature-label">Authorized Signature</div>
              <div className="mt-8 text-sm text-gray-600">
                <p>Thank you for choosing Excellence Academy</p>
                <p>Contact: +91 98765 43210 | Email: info@excellenceacademy.edu</p>
                <p>Address: 123 Education Street, Knowledge City, India - 123456</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 