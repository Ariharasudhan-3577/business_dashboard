import React, { useState } from 'react';
import { Plus, CreditCard as Edit, Search, FileText, Download } from 'lucide-react';
import Modal from './Modal';
import BillForm from './forms/BillForm';
import BillPreview from './BillPreview';

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

const BillingSystem: React.FC = () => {
  const [bills, setBills] = useState<Bill[]>([
    {
      id: '1',
      billNumber: 'INV-001',
      customerName: 'ABC Garments Ltd',
      customerAddress: '123 Market Street, Mumbai, Maharashtra 400001',
      customerGSTN: '27ABCDE1234F1Z5',
      date: '2024-12-26',
      dueDate: '2025-01-25',
      items: [
        { id: '1', name: 'Cotton Shirts', quantity: 100, unit: 'pieces', rate: 450, amount: 45000 },
        { id: '2', name: 'Polyester Fabric', quantity: 50, unit: 'meters', rate: 200, amount: 10000 }
      ],
      subtotal: 55000,
      gstRate: 18,
      gstAmount: 9900,
      totalAmount: 64900,
      status: 'Sent'
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [editingBill, setEditingBill] = useState<Bill | null>(null);
  const [previewBill, setPreviewBill] = useState<Bill | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const statuses = ['Draft', 'Sent', 'Paid', 'Overdue'];

  const filteredBills = bills.filter(bill => {
    const matchesSearch = bill.billNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bill.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || bill.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleSave = (formData: Omit<Bill, 'id'>) => {
    if (editingBill) {
      setBills(prev => prev.map(bill => 
        bill.id === editingBill.id 
          ? { ...formData, id: editingBill.id }
          : bill
      ));
    } else {
      const newBill: Bill = {
        ...formData,
        id: Date.now().toString()
      };
      setBills(prev => [...prev, newBill]);
    }
    setShowModal(false);
    setEditingBill(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Draft': return 'bg-gray-100 text-gray-800';
      case 'Sent': return 'bg-blue-100 text-blue-800';
      case 'Paid': return 'bg-green-100 text-green-800';
      case 'Overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalBillValue = filteredBills.reduce((sum, bill) => sum + bill.totalAmount, 0);
  const paidAmount = bills.filter(bill => bill.status === 'Paid').reduce((sum, bill) => sum + bill.totalAmount, 0);
  const pendingAmount = bills.filter(bill => bill.status === 'Sent').reduce((sum, bill) => sum + bill.totalAmount, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Billing System</h2>
          <p className="text-gray-600 mt-1">Create and manage customer invoices with GST calculations</p>
        </div>
        <button
          onClick={() => {
            setEditingBill(null);
            setShowModal(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Create Bill</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Total Bill Value</h3>
          <p className="text-3xl font-bold text-gray-900">₹{totalBillValue.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Paid Amount</h3>
          <p className="text-3xl font-bold text-green-600">₹{paidAmount.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Pending Amount</h3>
          <p className="text-3xl font-bold text-orange-600">₹{pendingAmount.toLocaleString()}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search bills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Status</option>
            {statuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Bills Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Bill Details</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Customer</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Amount</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredBills.map((bill) => (
                <tr key={bill.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{bill.billNumber}</div>
                        <div className="text-sm text-gray-500">Due: {bill.dueDate}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900">{bill.customerName}</div>
                      <div className="text-sm text-gray-500">GSTN: {bill.customerGSTN}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{bill.date}</td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <div className="font-medium text-gray-900">₹{bill.totalAmount.toLocaleString()}</div>
                      <div className="text-gray-500">GST: ₹{bill.gstAmount.toLocaleString()}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(bill.status)}`}>
                      {bill.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => {
                          setPreviewBill(bill);
                          setShowPreview(true);
                        }}
                        className="text-green-600 hover:text-green-800 p-2 hover:bg-green-50 rounded-lg transition-colors"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setEditingBill(bill);
                          setShowModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bill Form Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingBill ? 'Edit Bill' : 'Create New Bill'}
        size="large"
      >
        <BillForm
          bill={editingBill}
          onSave={handleSave}
          onCancel={() => setShowModal(false)}
        />
      </Modal>

      {/* Bill Preview Modal */}
      <Modal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        title="Bill Preview"
        size="large"
      >
        {previewBill && (
          <BillPreview
            bill={previewBill}
            onClose={() => setShowPreview(false)}
          />
        )}
      </Modal>
    </div>
  );
};

export default BillingSystem;