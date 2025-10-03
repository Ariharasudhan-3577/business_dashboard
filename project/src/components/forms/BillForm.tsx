import React, { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';

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

interface BillFormProps {
  bill: Bill | null;
  onSave: (data: Omit<Bill, 'id'>) => void;
  onCancel: () => void;
}

const BillForm: React.FC<BillFormProps> = ({ bill, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    billNumber: '',
    customerName: '',
    customerAddress: '',
    customerGSTN: '',
    date: new Date().toISOString().split('T')[0],
    dueDate: '',
    gstRate: 18,
    status: 'Draft' as const
  });

  const [items, setItems] = useState<BillItem[]>([
    { id: '1', name: '', quantity: 1, unit: 'pieces', rate: 0, amount: 0 }
  ]);

  useEffect(() => {
    if (bill) {
      setFormData({
        billNumber: bill.billNumber,
        customerName: bill.customerName,
        customerAddress: bill.customerAddress,
        customerGSTN: bill.customerGSTN,
        date: bill.date,
        dueDate: bill.dueDate,
        gstRate: bill.gstRate,
        status: bill.status
      });
      setItems(bill.items);
    } else {
      // Generate bill number for new bills
      const billNumber = `INV-${Date.now().toString().slice(-6)}`;
      setFormData(prev => ({ ...prev, billNumber }));
    }
  }, [bill]);

  const updateItem = (index: number, field: keyof BillItem, value: string | number) => {
    const updatedItems = items.map((item, i) => {
      if (i === index) {
        const updated = { ...item, [field]: value };
        if (field === 'quantity' || field === 'rate') {
          updated.amount = updated.quantity * updated.rate;
        }
        return updated;
      }
      return item;
    });
    setItems(updatedItems);
  };

  const addItem = () => {
    const newItem: BillItem = {
      id: Date.now().toString(),
      name: '',
      quantity: 1,
      unit: 'pieces',
      rate: 0,
      amount: 0
    };
    setItems([...items, newItem]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
  const gstAmount = (subtotal * formData.gstRate) / 100;
  const totalAmount = subtotal + gstAmount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const billData = {
      ...formData,
      items,
      subtotal,
      gstAmount,
      totalAmount
    };
    
    onSave(billData);
  };

  const units = ['pieces', 'kg', 'meters', 'liters', 'boxes'];
  const statuses = ['Draft', 'Sent', 'Paid', 'Overdue'];

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-6">
      {/* Customer Information */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bill Number *
            </label>
            <input
              type="text"
              value={formData.billNumber}
              onChange={(e) => setFormData({ ...formData, billNumber: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Customer Name *
            </label>
            <input
              type="text"
              value={formData.customerName}
              onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Customer Address *
            </label>
            <textarea
              value={formData.customerAddress}
              onChange={(e) => setFormData({ ...formData, customerAddress: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Customer GSTN *
            </label>
            <input
              type="text"
              value={formData.customerGSTN}
              onChange={(e) => setFormData({ ...formData, customerGSTN: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="15 characters GSTIN"
              maxLength={15}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date *
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Due Date *
            </label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status *
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Items */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Items</h3>
          <button
            type="button"
            onClick={addItem}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Item</span>
          </button>
        </div>

        <div className="space-y-4">
          {items.map((item, index) => (
            <div key={item.id} className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Item Name *
                  </label>
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => updateItem(index, 'name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quantity *
                  </label>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateItem(index, 'quantity', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Unit *
                  </label>
                  <select
                    value={item.unit}
                    onChange={(e) => updateItem(index, 'unit', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    {units.map(unit => (
                      <option key={unit} value={unit}>{unit}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rate (₹) *
                  </label>
                  <input
                    type="number"
                    value={item.rate}
                    onChange={(e) => updateItem(index, 'rate', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>

                <div className="flex items-end">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Amount (₹)
                    </label>
                    <input
                      type="text"
                      value={item.amount.toLocaleString()}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
                    />
                  </div>
                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="ml-2 p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tax & Total */}
      <div className="bg-blue-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Tax & Total Calculation</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              GST Rate (%) *
            </label>
            <select
              value={formData.gstRate}
              onChange={(e) => setFormData({ ...formData, gstRate: Number(e.target.value) })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value={0}>0% (Exempt)</option>
              <option value={5}>5%</option>
              <option value={12}>12%</option>
              <option value={18}>18%</option>
              <option value={28}>28%</option>
            </select>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Subtotal:</span>
              <span className="text-sm font-bold text-gray-900">₹{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">GST ({formData.gstRate}%):</span>
              <span className="text-sm font-bold text-gray-900">₹{gstAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-gray-300">
              <span className="text-lg font-bold text-gray-900">Total Amount:</span>
              <span className="text-lg font-bold text-blue-600">₹{totalAmount.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {bill ? 'Update Bill' : 'Create Bill'}
        </button>
      </div>
    </form>
  );
};

export default BillForm;