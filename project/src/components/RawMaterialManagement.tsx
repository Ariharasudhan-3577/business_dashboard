import React, { useState } from 'react';
import { Plus, CreditCard as Edit, Search, ShoppingCart } from 'lucide-react';
import Modal from './Modal';
import MaterialForm from './forms/MaterialForm';

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

const RawMaterialManagement: React.FC = () => {
  const [materials, setMaterials] = useState<RawMaterial[]>([
    {
      id: '1',
      name: 'Cotton Fabric',
      supplier: 'ABC Textiles',
      purchaseDate: '2024-12-20',
      quantity: 1000,
      unit: 'meters',
      totalAmount: 50000,
      amountPaid: 30000,
      remainingAmount: 20000,
      category: 'Fabric'
    },
    {
      id: '2',
      name: 'Polyester Thread',
      supplier: 'XYZ Suppliers',
      purchaseDate: '2024-12-22',
      quantity: 500,
      unit: 'spools',
      totalAmount: 15000,
      amountPaid: 15000,
      remainingAmount: 0,
      category: 'Thread'
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<RawMaterial | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMaterials = materials.filter(material =>
    material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    material.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
    material.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSave = (formData: Omit<RawMaterial, 'id'>) => {
    if (editingMaterial) {
      setMaterials(prev => prev.map(material => 
        material.id === editingMaterial.id 
          ? { ...formData, id: editingMaterial.id }
          : material
      ));
    } else {
      const newMaterial: RawMaterial = {
        ...formData,
        id: Date.now().toString()
      };
      setMaterials(prev => [...prev, newMaterial]);
    }
    setShowModal(false);
    setEditingMaterial(null);
  };

  const totalPurchaseValue = materials.reduce((sum, material) => sum + material.totalAmount, 0);
  const totalPaid = materials.reduce((sum, material) => sum + material.amountPaid, 0);
  const totalPending = materials.reduce((sum, material) => sum + material.remainingAmount, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Raw Material Management</h2>
          <p className="text-gray-600 mt-1">Track material purchases and payment status</p>
        </div>
        <button
          onClick={() => {
            setEditingMaterial(null);
            setShowModal(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Add Material Purchase</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Total Purchase Value</h3>
          <p className="text-3xl font-bold text-gray-900">₹{totalPurchaseValue.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Amount Paid</h3>
          <p className="text-3xl font-bold text-green-600">₹{totalPaid.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Amount Pending</h3>
          <p className="text-3xl font-bold text-red-600">₹{totalPending.toLocaleString()}</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search materials..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Materials Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Material Details</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Supplier</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Purchase Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Quantity</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Payment Status</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredMaterials.map((material) => (
                <tr key={material.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                        <ShoppingCart className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{material.name}</div>
                        <div className="text-sm text-gray-500">{material.category}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{material.supplier}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{material.purchaseDate}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {material.quantity} {material.unit}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <div className="text-gray-900 font-medium">Total: ₹{material.totalAmount.toLocaleString()}</div>
                      <div className="text-green-600">Paid: ₹{material.amountPaid.toLocaleString()}</div>
                      {material.remainingAmount > 0 && (
                        <div className="text-red-600">Pending: ₹{material.remainingAmount.toLocaleString()}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => {
                        setEditingMaterial(material);
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
        title={editingMaterial ? 'Edit Material Purchase' : 'Add Material Purchase'}
      >
        <MaterialForm
          material={editingMaterial}
          onSave={handleSave}
          onCancel={() => setShowModal(false)}
        />
      </Modal>
    </div>
  );
};

export default RawMaterialManagement;