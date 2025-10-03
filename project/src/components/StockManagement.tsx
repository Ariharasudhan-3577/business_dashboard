import React, { useState } from 'react';
import { Plus, CreditCard as Edit, Search, Package } from 'lucide-react';
import Modal from './Modal';
import StockForm from './forms/StockForm';

interface StockItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  price: number;
  minStock: number;
  lastUpdated: string;
}

const StockManagement: React.FC = () => {
  const [stockItems, setStockItems] = useState<StockItem[]>([
    {
      id: '1',
      name: 'Raw Cotton',
      category: 'Materials',
      quantity: 500,
      unit: 'kg',
      price: 120,
      minStock: 100,
      lastUpdated: '2024-12-26'
    },
    {
      id: '2',
      name: 'Finished Shirts',
      category: 'Products',
      quantity: 200,
      unit: 'pieces',
      price: 450,
      minStock: 50,
      lastUpdated: '2024-12-25'
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<StockItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredItems = stockItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSave = (formData: Omit<StockItem, 'id' | 'lastUpdated'>) => {
    if (editingItem) {
      setStockItems(prev => prev.map(item => 
        item.id === editingItem.id 
          ? { ...formData, id: editingItem.id, lastUpdated: new Date().toISOString().split('T')[0] }
          : item
      ));
    } else {
      const newItem: StockItem = {
        ...formData,
        id: Date.now().toString(),
        lastUpdated: new Date().toISOString().split('T')[0]
      };
      setStockItems(prev => [...prev, newItem]);
    }
    setShowModal(false);
    setEditingItem(null);
  };

  const isLowStock = (item: StockItem) => item.quantity <= item.minStock;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Stock Management</h2>
          <p className="text-gray-600 mt-1">Manage your inventory and track stock levels</p>
        </div>
        <button
          onClick={() => {
            setEditingItem(null);
            setShowModal(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Add Stock Item</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search stock items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Stock Items Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Item Details</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Category</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Stock Level</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Price per Unit</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Total Value</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Package className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{item.name}</div>
                        <div className="text-sm text-gray-500">Updated: {item.lastUpdated}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{item.category}</td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <div className="font-medium text-gray-900">{item.quantity} {item.unit}</div>
                      <div className="text-gray-500">Min: {item.minStock} {item.unit}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">₹{item.price}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    ₹{(item.quantity * item.price).toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                      isLowStock(item)
                        ? 'bg-red-100 text-red-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {isLowStock(item) ? 'Low Stock' : 'In Stock'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => {
                        setEditingItem(item);
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
        title={editingItem ? 'Edit Stock Item' : 'Add Stock Item'}
      >
        <StockForm
          item={editingItem}
          onSave={handleSave}
          onCancel={() => setShowModal(false)}
        />
      </Modal>
    </div>
  );
};

export default StockManagement;