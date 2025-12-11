import React from 'react';
import { DollarSign, Calendar, Clock, AlertCircle } from 'lucide-react';

export const CollectionView: React.FC = () => {
  // Mock Data for payment history
  const payments = [
    { id: 'INV-2023-001', payer: 'City General Hospital', service: 'Blood Units (5x A+)', amount: 1250.00, date: '2023-10-25', status: 'Paid', method: 'Bank Transfer' },
    { id: 'INV-2023-002', payer: 'John Doe', service: 'Screening Fee', amount: 45.00, date: '2023-10-25', status: 'Pending', method: 'Card' },
    { id: 'INV-2023-003', payer: 'St. Mary Medical', service: 'Emergency Supply', amount: 3400.00, date: '2023-10-24', status: 'Paid', method: 'Insurance' },
    { id: 'INV-2023-004', payer: 'Community Clinic', service: 'Plasma Units (2x)', amount: 600.00, date: '2023-10-24', status: 'Overdue', method: 'Check' },
    { id: 'INV-2023-005', payer: 'Sarah Connor', service: 'Processing Fee', amount: 45.00, date: '2023-10-23', status: 'Paid', method: 'Cash' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Payment History</h2>
          <p className="text-slate-500">Manage financial transactions and invoices</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="bg-green-100 p-3 rounded-full text-green-600">
                <DollarSign className="w-6 h-6" />
            </div>
            <div>
                <p className="text-slate-500 text-sm font-medium">Total Revenue</p>
                <h3 className="text-2xl font-bold text-slate-800">$45,230</h3>
            </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                <Clock className="w-6 h-6" />
            </div>
            <div>
                <p className="text-slate-500 text-sm font-medium">Pending</p>
                <h3 className="text-2xl font-bold text-slate-800">$1,250</h3>
            </div>
        </div>
         <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="bg-red-100 p-3 rounded-full text-red-600">
                <AlertCircle className="w-6 h-6" />
            </div>
            <div>
                <p className="text-slate-500 text-sm font-medium">Overdue</p>
                <h3 className="text-2xl font-bold text-slate-800">$600</h3>
            </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                    <th className="p-4 text-sm font-semibold text-slate-500">Invoice ID</th>
                    <th className="p-4 text-sm font-semibold text-slate-500">Payer / Hospital</th>
                    <th className="p-4 text-sm font-semibold text-slate-500">Service</th>
                    <th className="p-4 text-sm font-semibold text-slate-500">Amount</th>
                    <th className="p-4 text-sm font-semibold text-slate-500">Date</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
                {payments.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-4 font-mono text-sm text-slate-600">{item.id}</td>
                        <td className="p-4 font-medium text-slate-800">{item.payer}</td>
                        <td className="p-4 text-slate-600">{item.service}</td>
                        <td className="p-4 font-bold text-slate-800">${item.amount.toLocaleString()}</td>
                        <td className="p-4 text-slate-600">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-3 h-3 text-slate-400" />
                                {item.date}
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>
    </div>
  );
};