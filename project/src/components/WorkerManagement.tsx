import React, { useState } from 'react';
import { Plus, CreditCard as Edit, Search, User, Calendar } from 'lucide-react';
import Modal from './Modal';
import WorkerForm from './forms/WorkerForm';
import AttendanceForm from './forms/AttendanceForm';

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

const WorkerManagement: React.FC = () => {
  const [workers, setWorkers] = useState<Worker[]>([
    {
      id: '1',
      name: 'Rajesh Kumar',
      position: 'Machine Operator',
      dailyWage: 500,
      totalDaysWorked: 22,
      totalSalaryEarned: 11000,
      salaryPaid: 8000,
      remainingSalary: 3000,
      advance: 2000,
      phoneNumber: '9876543210',
      joinDate: '2024-01-15'
    },
    {
      id: '2',
      name: 'Priya Sharma',
      position: 'Quality Inspector',
      dailyWage: 600,
      totalDaysWorked: 20,
      totalSalaryEarned: 12000,
      salaryPaid: 12000,
      remainingSalary: 0,
      advance: 1500,
      phoneNumber: '9876543211',
      joinDate: '2024-02-01'
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [editingWorker, setEditingWorker] = useState<Worker | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalType, setModalType] = useState<'worker' | 'attendance'>('worker');

  const filteredWorkers = workers.filter(worker =>
    worker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    worker.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleWorkerSave = (formData: Omit<Worker, 'id'>) => {
    if (editingWorker) {
      setWorkers(prev => prev.map(worker => 
        worker.id === editingWorker.id 
          ? { ...formData, id: editingWorker.id }
          : worker
      ));
    } else {
      const newWorker: Worker = {
        ...formData,
        id: Date.now().toString()
      };
      setWorkers(prev => [...prev, newWorker]);
    }
    setShowModal(false);
    setEditingWorker(null);
  };

  const handleAttendanceUpdate = (workerId: string, attendanceData: any) => {
    setWorkers(prev => prev.map(worker => 
      worker.id === workerId
        ? {
            ...worker,
            totalDaysWorked: attendanceData.daysWorked,
            totalSalaryEarned: attendanceData.daysWorked * worker.dailyWage,
            salaryPaid: attendanceData.salaryPaid,
            remainingSalary: (attendanceData.daysWorked * worker.dailyWage) - attendanceData.salaryPaid,
            advance: attendanceData.advance
          }
        : worker
    ));
    setShowAttendanceModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Worker Management</h2>
          <p className="text-gray-600 mt-1">Manage worker details, attendance, and salary payments</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => {
              setModalType('attendance');
              setShowAttendanceModal(true);
            }}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Calendar className="w-5 h-5" />
            <span>Update Attendance</span>
          </button>
          <button
            onClick={() => {
              setEditingWorker(null);
              setModalType('worker');
              setShowModal(true);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Add Worker</span>
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search workers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Workers Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Worker Details</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Position</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Daily Wage</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Days Worked</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Salary Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Advance</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredWorkers.map((worker) => (
                <tr key={worker.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <User className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{worker.name}</div>
                        <div className="text-sm text-gray-500">{worker.phoneNumber}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{worker.position}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">₹{worker.dailyWage}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{worker.totalDaysWorked} days</td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <div className="text-gray-900">Earned: ₹{worker.totalSalaryEarned}</div>
                      <div className="text-green-600">Paid: ₹{worker.salaryPaid}</div>
                      <div className={`${worker.remainingSalary > 0 ? 'text-red-600' : 'text-gray-500'}`}>
                        Remaining: ₹{worker.remainingSalary}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-orange-600 font-medium">₹{worker.advance}</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => {
                        setEditingWorker(worker);
                        setModalType('worker');
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

      {/* Worker Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingWorker ? 'Edit Worker' : 'Add Worker'}
      >
        <WorkerForm
          worker={editingWorker}
          onSave={handleWorkerSave}
          onCancel={() => setShowModal(false)}
        />
      </Modal>

      {/* Attendance Modal */}
      <Modal
        isOpen={showAttendanceModal}
        onClose={() => setShowAttendanceModal(false)}
        title="Update Attendance & Salary"
      >
        <AttendanceForm
          workers={workers}
          onSave={handleAttendanceUpdate}
          onCancel={() => setShowAttendanceModal(false)}
        />
      </Modal>
    </div>
  );
};

export default WorkerManagement;