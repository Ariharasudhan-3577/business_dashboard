import React from 'react';
import { Download, X } from 'lucide-react';

interface BillItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  rate: number;
  amount: number;
}

interface Bill {
  id: string;
  billNumber: string;
  customerName: string;
  customerAddress: string;
  customerGSTN: string;
  date: string;
  dueDate: string;
  items: BillItem[];
  subtotal: number;
  gstRate: number;
  gstAmount: number;
  totalAmount: number;
  status: 'Draft' | 'Sent' | 'Paid' | 'Overdue';
}

interface BillPreviewProps {
  bill: Bill;
  onClose: () => void;
}

const BillPreview: React.FC<BillPreviewProps> = ({ bill, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Bill Preview</h3>
        <div className="flex space-x-3">
          <button
            onClick={handlePrint}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Print/Download</span>
          </button>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Bill Content */}
      <div className="bg-white border-2 border-gray-200 rounded-lg p-8 max-w-4xl mx-auto print:border-0 print:shadow-none">
        {/* Header */}
        <div className="text-center mb-8 border-b border-gray-200 pb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">INVOICE</h1>
          <p className="text-lg font-semibold text-blue-600">{bill.billNumber}</p>
        </div>

        {/* Company & Customer Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">From:</h3>
            <div className="text-gray-700">
              <p className="font-medium text-lg">Your Company Name</p>
              <p>123 Business Street</p>
              <p>City, State - 123456</p>
              <p>GSTIN: 12ABCDE3456F7G8</p>
              <p>Phone: +91 98765 43210</p>
              <p>Email: info@company.com</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Bill To:</h3>
            <div className="text-gray-700">
              <p className="font-medium text-lg">{bill.customerName}</p>
              <p className="whitespace-pre-line">{bill.customerAddress}</p>
              <p className="mt-2">GSTIN: {bill.customerGSTN}</p>
            </div>
          </div>
        </div>

        {/* Bill Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div>
            <p className="text-sm font-medium text-gray-500">Invoice Date</p>
            <p className="text-lg font-semibold text-gray-900">{bill.date}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Due Date</p>
            <p className="text-lg font-semibold text-gray-900">{bill.dueDate}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Status</p>
            <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
              bill.status === 'Paid' ? 'bg-green-100 text-green-800' :
              bill.status === 'Sent' ? 'bg-blue-100 text-blue-800' :
              bill.status === 'Overdue' ? 'bg-red-100 text-red-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {bill.status}
            </span>
          </div>
        </div>

        {/* Items Table */}
        <div className="mb-8">
          <table className="w-full border border-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b border-gray-300">Item Description</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900 border-b border-gray-300">Qty</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900 border-b border-gray-300">Unit</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900 border-b border-gray-300">Rate (₹)</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900 border-b border-gray-300">Amount (₹)</th>
              </tr>
            </thead>
            <tbody>
              {bill.items.map((item, index) => (
                <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-4 py-3 text-sm text-gray-900 border-b border-gray-200">{item.name}</td>
                  <td className="px-4 py-3 text-sm text-center text-gray-900 border-b border-gray-200">{item.quantity}</td>
                  <td className="px-4 py-3 text-sm text-center text-gray-900 border-b border-gray-200">{item.unit}</td>
                  <td className="px-4 py-3 text-sm text-right text-gray-900 border-b border-gray-200">{item.rate.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-right text-gray-900 border-b border-gray-200">{item.amount.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="flex justify-end mb-8">
          <div className="w-full md:w-1/2">
            <div className="bg-gray-50 border border-gray-300 p-4 rounded-lg">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-700">Subtotal:</span>
                  <span className="text-sm font-bold text-gray-900">₹{bill.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-700">GST ({bill.gstRate}%):</span>
                  <span className="text-sm font-bold text-gray-900">₹{bill.gstAmount.toLocaleString()}</span>
                </div>
                <div className="border-t border-gray-300 pt-2 flex justify-between">
                  <span className="text-lg font-bold text-gray-900">Total Amount:</span>
                  <span className="text-lg font-bold text-blue-600">₹{bill.totalAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 pt-6 text-center">
          <p className="text-sm text-gray-600 mb-2">Thank you for your business!</p>
          <p className="text-xs text-gray-500">This is a computer-generated invoice and does not require a signature.</p>
        </div>
      </div>
    </div>
  );
};

export default BillPreview;