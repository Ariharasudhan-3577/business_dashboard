import React, { useState } from 'react';
import { Plus, CreditCard as Edit, Search, DollarSign, Calendar } from 'lucide-react';
import Modal from './Modal';
import ExpenseForm from './forms/ExpenseForm';

interface Expense {
  id: string;
  date: string;
  category: string;
  description: string;
  amount: number;
  paymentMethod: string;
  billNumber?: string;
}

const ExpensesManagement: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([
    {
      id: '1',
      date: '2024-12-26',
      category: 'Utilities',
      description: 'Electricity Bill',
      amount: 5500,
      paymentMethod: 'Bank Transfer',
      billNumber: 'EB12345'
    },
    {
      id: '2',
      date: '2024-12-25',
      category: 'Transportation',
      description: 'Material Transportation',
      amount: 2500,
      paymentMethod: 'Cash',
      billNumber: 'TR001'
    },
    {
      id: '3',
      date: '2024-12-24',
      category: 'Maintenance',
      description: 'Machine Repair',
      amount: 8000,
      paymentMethod: 'UPI',
      billNumber: 'MR456'
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const categories = ['Utilities', 'Transportation', 'Maintenance', 'Office Supplies', 'Marketing', 'Others'];
  const paymentMethods = ['Cash', 'Bank Transfer', 'UPI', 'Credit Card', 'Cheque'];

  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expense.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = !selectedDate || expense.date === selectedDate;
    const matchesCategory = !selectedCategory || expense.category === selectedCategory;
    
    return matchesSearch && matchesDate && matchesCategory;
  });

  const handleSave = (formData: Omit<Expense, 'id'>) => {
    if (editingExpense) {
      setExpenses(prev => prev.map(expense => 
        expense.id === editingExpense.id 
          ? { ...formData, id: editingExpense.id }
          : expense
      ));
    } else {
      const newExpense: Expense = {
        ...formData,
        id: Date.now().toString()
      };
      setExpenses(prev => [...prev, newExpense]);
    }
    setShowModal(false);
    setEditingExpense(null);
  };

  const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const todaysExpenses = expenses
    .filter(expense => expense.date === new Date().toISOString().split('T')[0])
    .reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Daily Expenses</h2>
          <p className="text-gray-600 mt-1">Track and manage your daily business expenses</p>
        </div>
        <button
          onClick={() => {
            setEditingExpense(null);
            setShowModal(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Add Expense</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Today's Expenses</h3>
          <p className="text-3xl font-bold text-red-600">₹{todaysExpenses.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Total Filtered Expenses</h3>
          <p className="text-3xl font-bold text-gray-900">₹{totalExpenses.toLocaleString()}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search expenses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Expenses Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Expense Details</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Category</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Amount</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Payment Method</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Bill Number</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredExpenses.map((expense) => (
                <tr key={expense.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{expense.date}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                        <DollarSign className="w-5 h-5 text-red-600" />
                      </div>
                      <div className="font-medium text-gray-900">{expense.description}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {expense.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    ₹{expense.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{expense.paymentMethod}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {expense.billNumber || '-'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => {
                        setEditingExpense(expense);
                        setShowModal(true);
                      }}
                      className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingExpense ? 'Edit Expense' : 'Add Expense'}
      >
        <ExpenseForm
          expense={editingExpense}
          categories={categories}
          paymentMethods={paymentMethods}
          onSave={handleSave}
          onCancel={() => setShowModal(false)}
        />
      </Modal>
    </div>
  );
};

export default ExpensesManagement;