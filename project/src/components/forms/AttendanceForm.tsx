import React, { useState } from 'react';

interface Worker {
  id: string;
  name: string;
  position: string;
  dailyWage: number;
}

interface AttendanceFormProps {
  workers: Worker[];
  onSave: (workerId: string, attendanceData: any) => void;
  onCancel: () => void;
}

const AttendanceForm: React.FC<AttendanceFormProps> = ({ workers, onSave, onCancel }) => {
  const [selectedWorker, setSelectedWorker] = useState('');
  const [formData, setFormData] = useState({
    daysWorked: 0,
    salaryPaid: 0,
    advance: 0
  });

  const selectedWorkerData = workers.find(w => w.id === selectedWorker);
  const totalEarned = selectedWorkerData ? formData.daysWorked * selectedWorkerData.dailyWage : 0;
  const remainingSalary = totalEarned - formData.salaryPaid;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedWorker) {
      onSave(selectedWorker, formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Worker *
        </label>
        <select
          value={selectedWorker}
          onChange={(e) => setSelectedWorker(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        >
          <option value="">Select a worker</option>
          {workers.map(worker => (
            <option key={worker.id} value={worker.id}>
              {worker.name} - {worker.position} (₹{worker.dailyWage}/day)
            </option>
          ))}
        </select>
      </div>

      {selectedWorkerData && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Days Worked *
              </label>
              <input
                type="number"
                value={formData.daysWorked}
                onChange={(e) => setFormData({ ...formData, daysWorked: Number(e.target.value) })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="0"
                required
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

          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Salary Calculation Summary</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Daily Wage:</span>
                <span className="ml-2 font-medium">₹{selectedWorkerData.dailyWage}</span>
              </div>
              <div>
                <span className="text-gray-600">Total Earned:</span>
                <span className="ml-2 font-medium">₹{totalEarned.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-gray-600">Remaining:</span>
                <span className={`ml-2 font-medium ${remainingSalary > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  ₹{remainingSalary.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </>
      )}

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
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          disabled={!selectedWorker}
        >
          Update Attendance
        </button>
      </div>
    </form>
  );
};

export default AttendanceForm;