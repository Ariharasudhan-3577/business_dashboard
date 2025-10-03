import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import StockManagement from './components/StockManagement';
import WorkerManagement from './components/WorkerManagement';
import RawMaterialManagement from './components/RawMaterialManagement';
import ExpensesManagement from './components/ExpensesManagement';
import BillingSystem from './components/BillingSystem';

function App() {
  const [activeSection, setActiveSection] = useState('stock');

  const renderSection = () => {
    switch (activeSection) {
      case 'stock':
        return <StockManagement />;
      case 'workers':
        return <WorkerManagement />;
      case 'materials':
        return <RawMaterialManagement />;
      case 'expenses':
        return <ExpensesManagement />;
      case 'billing':
        return <BillingSystem />;
      default:
        return <StockManagement />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-6 py-4">
            <h1 className="text-2xl font-bold text-gray-900">Business Management Dashboard</h1>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          {renderSection()}
        </main>
      </div>
    </div>
  );
}

export default App;