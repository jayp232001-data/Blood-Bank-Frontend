import React, { useState } from 'react';
import { Donor, BloodGroup } from '../types';
import { Search, UserPlus, Phone, Calendar } from 'lucide-react';

interface DonorsViewProps {
  donors: Donor[];
  onAddDonor: (donor: Omit<Donor, 'id'>) => void;
}

export const DonorsView: React.FC<DonorsViewProps> = ({ donors, onAddDonor }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    age: 25,
    bloodGroup: BloodGroup.O_POS,
    contact: '',
    lastDonationDate: new Date().toISOString().split('T')[0],
  });

  const filteredDonors = donors.filter(d => 
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    d.bloodGroup.includes(searchTerm)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddDonor({
      ...formData,
      status: 'Active',
      bloodGroup: formData.bloodGroup as BloodGroup,
    });
    setShowModal(false);
    setFormData({
        name: '',
        age: 25,
        bloodGroup: BloodGroup.O_POS,
        contact: '',
        lastDonationDate: new Date().toISOString().split('T')[0],
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Donors Directory</h2>
          <p className="text-slate-500">Manage donor records and history</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-brand-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-brand-700 transition-colors shadow-lg shadow-brand-600/20"
        >
          <UserPlus className="w-5 h-5" />
          Register Donor
        </button>
      </div>

       <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search donors by name or blood group..." 
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDonors.map(donor => (
          <div key={donor.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-xl font-bold text-slate-600">
                  {donor.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">{donor.name}</h3>
                  <p className="text-sm text-slate-500">{donor.age} years old</p>
                </div>
              </div>
              <span className={`px-2 py-1 text-xs font-bold rounded bg-slate-100 text-slate-600`}>
                {donor.bloodGroup}
              </span>
            </div>
            
            <div className="space-y-2 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-slate-400" />
                {donor.contact}
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-400" />
                Last: {donor.lastDonationDate}
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-50 flex justify-between items-center">
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${donor.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {donor.status}
                </span>
                <button className="text-brand-600 text-sm font-medium hover:underline">View History</button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl">
            <h3 className="text-xl font-bold mb-4">Register New Donor</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                    <input 
                      type="text" required
                      className="w-full border border-slate-300 rounded-lg px-3 py-2"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Age</label>
                    <input 
                      type="number" required min="18" max="65"
                      className="w-full border border-slate-300 rounded-lg px-3 py-2"
                      value={formData.age}
                      onChange={(e) => setFormData({...formData, age: Number(e.target.value)})}
                    />
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Blood Group</label>
                  <select 
                    className="w-full border border-slate-300 rounded-lg px-3 py-2"
                    value={formData.bloodGroup}
                    onChange={(e) => setFormData({...formData, bloodGroup: e.target.value as BloodGroup})}
                  >
                    {Object.values(BloodGroup).map(g => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
                <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                    <input 
                      type="tel" required
                      className="w-full border border-slate-300 rounded-lg px-3 py-2"
                      value={formData.contact}
                      onChange={(e) => setFormData({...formData, contact: e.target.value})}
                    />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Last Donation Date</label>
                <input 
                  type="date"
                  className="w-full border border-slate-300 rounded-lg px-3 py-2"
                  value={formData.lastDonationDate}
                  onChange={(e) => setFormData({...formData, lastDonationDate: e.target.value})}
                />
              </div>

              <div className="flex gap-3 mt-6">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 font-medium"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 px-4 py-2 bg-brand-600 rounded-lg text-white hover:bg-brand-700 font-medium"
                >
                  Register
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};