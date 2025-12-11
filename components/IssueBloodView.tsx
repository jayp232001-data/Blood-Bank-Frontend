import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FileOutput, Plus, X } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

interface BloodRequest {
  id: number;
  userEmail: string;
  userName: string;
  userType: string;
  requiredBloodGroup: string;
  quantityRequired: number;
  totalAmount: number;
  urgencyLevel: string;
  hospitalName: string;
  referredBy: string;
  purposeOfIssue: string;
  status?: string;
}

interface BloodRequestForm {
  email: string;
  userName: string;
  userType: 'Receiver' | 'Donor';
  quantity: number;
  bloodGroup: string;
  urgency: 'Normal' | 'High' | 'Critical';
  purpose: string;
  referredBy: string;
  hospital: string;
  amount: number;
}

export const IssueBloodView: React.FC = () => {
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<BloodRequestForm>({
    email: '',
    userName: '',
    userType: 'Receiver',
    quantity: 1,
    bloodGroup: 'A+',
    urgency: 'Normal',
    purpose: '',
    referredBy: '',
    hospital: '',
    amount: 0,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await axios.get<BloodRequest[]>('http://localhost:8080/api/blood-requests');
        setRequests(res.data);
      } catch (err: any) {
        console.error(err);
        setRequests([]);
        toast.error('Failed to fetch blood requests');
      }
    };
    fetchRequests();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        userEmail: formData.email,
        userName: formData.userName,
        userType: formData.userType,
        requiredBloodGroup: formData.bloodGroup,
        quantityRequired: formData.quantity,
        totalAmount: formData.amount,
        urgencyLevel: formData.urgency,
        hospitalName: formData.hospital,
        referredBy: formData.referredBy,
        purposeOfIssue: formData.purpose,
      };

      const res = await axios.post('http://localhost:8080/api/blood-requests', payload);
      setRequests([res.data, ...requests]);
      toast.success('Blood request created successfully!');
      setIsModalOpen(false);

      setFormData({
        email: '',
        userName: '',
        userType: 'Receiver',
        quantity: 1,
        bloodGroup: 'A+',
        urgency: 'Normal',
        purpose: '',
        referredBy: '',
        hospital: '',
        amount: 0,
      });
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || 'Something went wrong';
      toast.error(errorMsg); // Show backend message as toast
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Toaster */}
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Issue Blood</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-slate-900 text-white px-5 py-2.5 rounded-xl font-medium shadow-lg flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Create Request
        </button>
      </div>

      {/* Blood Requests Grid */}
      {requests.length === 0 ? (
        <p className="text-center text-slate-500 mt-10">No data available</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {requests.map((req) => (
            <div
              key={req.id}
              className="bg-white shadow-md rounded-2xl p-6 flex flex-col justify-between gap-4 hover:shadow-xl transition-shadow duration-300"
            >
              {/* Blood Group */}
              <div className="flex items-center gap-4 mb-3">
                <div
                  className={`w-14 h-14 flex items-center justify-center rounded-full text-white font-bold text-lg
                    ${req.requiredBloodGroup.includes('+') ? 'bg-red-500' : 'bg-blue-500'}
                  `}
                >
                  {req.requiredBloodGroup}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">
                    {req.hospitalName}{' '}
                    <span className="text-xs font-medium uppercase text-slate-400">({req.userType})</span>
                  </h3>
                  <p className="text-sm text-slate-600">Name: {req.userName}</p>
                  <p className="text-sm text-slate-600">Email: {req.userEmail}</p>
                </div>
              </div>

              {/* Purpose & Referred By */}
              <p className="text-sm text-slate-500">Referred by: {req.referredBy}</p>
              <p className="text-sm text-slate-500">Purpose: {req.purposeOfIssue}</p>

              {/* Bottom Row: Amount, Quantity, Status & Urgency */}
              <div className="flex items-center justify-between mt-4 flex-wrap gap-2">
                <div className="flex flex-col">
                  <p className="text-lg font-semibold text-slate-900">${req.totalAmount}</p>
                  <p className="text-sm text-slate-500">{req.quantityRequired} Units</p>
                </div>

                <div className="flex gap-2 flex-wrap">
                  {req.status && (
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium
                        ${req.status === 'Pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : req.status === 'Approved'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {req.status}
                    </span>
                  )}
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium
                      ${req.urgencyLevel === 'Normal'
                        ? 'bg-green-100 text-green-800'
                        : req.urgencyLevel === 'High'
                        ? 'bg-orange-100 text-orange-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {req.urgencyLevel}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Request Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <div className="bg-slate-100 p-2 rounded-lg text-slate-700">
                  <FileOutput className="w-5 h-5" />
                </div>
                Create Blood Request
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-2 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleCreate} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Email */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-1">User Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border rounded-xl"
                />
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-semibold mb-1">User Name</label>
                <input
                  type="text"
                  required
                  value={formData.userName}
                  onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                  className="w-full px-4 py-2 border rounded-xl"
                />
              </div>

              {/* User Type */}
              <div>
                <label className="block text-sm font-semibold mb-1">User Type</label>
                <select
                  value={formData.userType}
                  onChange={(e) => setFormData({ ...formData, userType: e.target.value as any })}
                  className="w-full px-4 py-2 border rounded-xl"
                >
                  <option value="Receiver">Receiver</option>
                  <option value="Donor">Donor</option>
                </select>
              </div>

              {/* Blood Group */}
              <div>
                <label className="block text-sm font-semibold mb-1">Required Blood Group</label>
                <select
                  value={formData.bloodGroup}
                  onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                  className="w-full px-4 py-2 border rounded-xl"
                >
                  {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-sm font-semibold mb-1">Quantity</label>
                <input
                  type="number"
                  required
                  min={1}
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                  className="w-full px-4 py-2 border rounded-xl"
                />
              </div>

              {/* Conditional Receiver fields */}
              {formData.userType === 'Receiver' && (
                <>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Hospital</label>
                    <input
                      type="text"
                      required
                      value={formData.hospital}
                      onChange={(e) => setFormData({ ...formData, hospital: e.target.value })}
                      className="w-full px-4 py-2 border rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Referred By</label>
                    <input
                      type="text"
                      required
                      value={formData.referredBy}
                      onChange={(e) => setFormData({ ...formData, referredBy: e.target.value })}
                      className="w-full px-4 py-2 border rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Total Amount</label>
                    <input
                      type="number"
                      min={0}
                      step={0.01}
                      required
                      value={1100*formData.quantity}
                      disabled
                      onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                      className="w-full px-4 py-2 border rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Urgency</label>
                    <select
                      value={formData.urgency}
                      onChange={(e) => setFormData({ ...formData, urgency: e.target.value as any })}
                      className="w-full px-4 py-2 border rounded-xl"
                    >
                      <option value="Normal">Normal</option>
                      <option value="High">High</option>
                      <option value="Critical">Critical</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold mb-1">Purpose</label>
                    <textarea
                      rows={3}
                      required
                      value={formData.purpose}
                      onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                      className="w-full px-4 py-2 border rounded-xl resize-none"
                    />
                  </div>
                </>
              )}

              <div className="md:col-span-2 flex gap-4 mt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2 border rounded-xl">Cancel</button>
                <button type="submit" disabled={loading} className="flex-1 px-4 py-2 bg-slate-900 text-white rounded-xl">
                  {loading ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
