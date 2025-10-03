import React, { useState, useEffect } from 'react';

interface RawMaterial {
  id: string;
  name: string;
  supplier: string;
  purchaseDate: string;
  quantity: number;
  unit: string;
  totalAmount: number;
  amountPaid: number;
  remainingAmount: number;
  category: string;
}

interface MaterialFormProps {
  material: RawMaterial | null;
  onSave: (data: Omit<RawMaterial, 'id'>) => void;
  onCancel: () => void;
}

const MaterialForm: React.FC<MaterialFormProps> = ({ material, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    supplier: '',
    purchaseDate: '',
    quantity: 0,
    unit: '',
    totalAmount: 0,
    amountPaid: 0,
    remainingAmount: 0,
    category: ''
  });

  useEffect(() => {
    if (material) {
      setFormData(material);
    }
  }, [material]);

  useEffect(() => {
    const remaining = formData.totalAmount - formData.amountPaid;
    setFormData(prev => ({
      ...prev,
      remainingAmount: remaining
    }));
  }, [formData.totalAmount, formData.amountPaid]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const categories = ['Fabric', 'Thread', 'Buttons', 'Zippers', 'Accessories', 'Chemicals', 'Others'];
  const units = ['meters', 'kg', 'pieces', 'liters', 'boxes', 'rolls', 'spools'];

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Material Name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Supplier *
          </label>
          <input
            type="text"
            value={formData.supplier}
            onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Purchase Date *
          </label>
          <input
            type="date"
            value={formData.purchaseDate}
            onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category *
          </label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="">Select Category</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quantity *
          </label>
          <input
            type="number"
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            min="0"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Unit *
          </label>
          <select
            value={formData.unit}
            onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="">Select Unit</option>
            {units.map(unit => (
              <option key={unit} value={unit}>{unit}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Total Amount (₹) *
          </label>
          <input
            type="number"
            value={formData.totalAmount}
            onChange={(e) => setFormData({ ...formData, totalAmount: Number(e.target.value) })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            min="0"
            step="0.01"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Amount Paid (₹)
          </label>
          <input
            type="number"
            value={formData.amountPaid}
            onChange={(e) => setFormData({ ...formData, amountPaid: Number(e.target.value) })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            min="0"
            step="0.01"
            max={formData.totalAmount}
          />
        </div>
      </div>

      {/* Auto-calculated field display */}
      <div className="bg-orange-50 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Payment Summary</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Total Amount:</span>
            <span className="ml-2 font-medium">₹{formData.totalAmount.toLocaleString()}</span>
          </div>
          <div>
            <span className="text-gray-600">Amount Paid:</span>
            <span className="ml-2 font-medium text-green-600">₹{formData.amountPaid.toLocaleString()}</span>
          </div>
          <div>
            <span className="text-gray-600">Remaining:</span>
            <span className={`ml-2 font-medium ${formData.remainingAmount > 0 ? 'text-red-600' : 'text-green-600'}`}>
              ₹{formData.remainingAmount.toLocaleString()}
            </span>
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
          {material ? 'Update Purchase' : 'Add Purchase'}
        </button>
      </div>
    </form>
  );
};

export default MaterialForm;