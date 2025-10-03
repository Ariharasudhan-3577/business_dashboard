import React, { useState, useEffect } from 'react';

interface Worker {
  id: string;
  name: string;
  position: string;
  dailyWage: number;
  totalDaysWorked: number;
  totalSalaryEarned: number;
  salaryPaid: number;
  remainingSalary: number;
  advance: number;
  phoneNumber: string;
  joinDate: string;
}

interface WorkerFormProps {
  worker: Worker | null;
  onSave: (data: Omit<Worker, 'id'>) => void;
  onCancel: () => void;
}

const WorkerForm: React.FC<WorkerFormProps> = ({ worker, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    dailyWage: 0,
    totalDaysWorked: 0,
    totalSalaryEarned: 0,
    salaryPaid: 0,
    remainingSalary: 0,
    advance: 0,
    phoneNumber: '',
    joinDate: ''
  });

  useEffect(() => {
    if (worker) {
      setFormData(worker);
    }
  }, [worker]);

  useEffect(() => {
    const totalEarned = formData.totalDaysWorked * formData.dailyWage;
    const remaining = totalEarned - formData.salaryPaid;
    setFormData(prev => ({
      ...prev,
      totalSalaryEarned: totalEarned,
      remainingSalary: remaining
    }));
  }, [formData.totalDaysWorked, formData.dailyWage, formData.salaryPaid]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const positions = ['Machine Operator', 'Quality Inspector', 'Supervisor', 'Helper', 'Packer', 'Others'];

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Worker Name *
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
            Position *
          </label>
          <select
            value={formData.position}
            onChange={(e) => setFormData({ ...formData, position: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="">Select Position</option>
            {positions.map(position => (
              <option key={position} value={position}>{position}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Daily Wage (₹) *
          </label>
          <input
            type="number"
            value={formData.dailyWage}
            onChange={(e) => setFormData({ ...formData, dailyWage: Number(e.target.value) })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            min="0"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number *
          </label>
          <input
            type="tel"
            value={formData.phoneNumber}
            onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Join Date *
          </label>
          <input
            type="date"
            value={formData.joinDate}
            onChange={(e) => setFormData({ ...formData, joinDate: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Total Days Worked
          </label>
          <input
            type="number"
            value={formData.totalDaysWorked}
            onChange={(e) => setFormData({ ...formData, totalDaysWorked: Number(e.target.value) })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            min="0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Salary Paid (₹)
          </label>
          <input
            type="number"
            value={formData.salaryPaid}
            onChange={(e) => setFormData({ ...formData, salaryPaid: Number(e.target.value) })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            min="0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Advance Given (₹)
          </label>
          <input
            type="number"
            value={formData.advance}
            onChange={(e) => setFormData({ ...formData, advance: Number(e.target.value) })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            min="0"
          />
        </div>
      </div>

      {/* Auto-calculated fields display */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Auto-calculated Values</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Total Salary Earned:</span>
            <span className="ml-2 font-medium">₹{formData.totalSalaryEarned.toLocaleString()}</span>
          </div>
          <div>
            <span className="text-gray-600">Remaining Salary:</span>
            <span className={`ml-2 font-medium ${formData.remainingSalary > 0 ? 'text-red-600' : 'text-green-600'}`}>
              ₹{formData.remainingSalary.toLocaleString()}
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
          {worker ? 'Update Worker' : 'Add Worker'}
        </button>
      </div>
    </form>
  );
};

export default WorkerForm;