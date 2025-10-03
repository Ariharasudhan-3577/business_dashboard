import React from 'react';
import { 
  Package, 
  Users, 
  ShoppingCart, 
  DollarSign, 
  FileText,
  BarChart3 
} from 'lucide-react';

interface SidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeSection, setActiveSection }) => {
  const menuItems = [
    { id: 'stock', label: 'Stock Management', icon: Package },
    { id: 'workers', label: 'Worker Management', icon: Users },
    { id: 'materials', label: 'Raw Materials', icon: ShoppingCart },
    { id: 'expenses', label: 'Daily Expenses', icon: DollarSign },
    { id: 'billing', label: 'Billing System', icon: FileText },
  ];

  return (
    <div className="w-64 bg-slate-900 text-white">
      <div className="p-6">
        <div className="flex items-center space-x-2">
          <BarChart3 className="w-8 h-8 text-blue-400" />
          <h2 className="text-xl font-bold">BizManager</h2>
        </div>
      </div>
      
      <nav className="mt-6">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center px-6 py-3 text-left transition-all duration-200 hover:bg-slate-800 ${
                activeSection === item.id
                  ? 'bg-blue-600 border-r-4 border-blue-400'
                  : ''
              }`}
            >
              <Icon className="w-5 h-5 mr-3" />
              {item.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;