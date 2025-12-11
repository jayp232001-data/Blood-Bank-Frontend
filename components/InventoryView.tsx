import React, { useState } from 'react';
import { BloodUnit, BloodGroup } from '../types';
import { Droplet, Filter, Plus, Search, Trash2 } from 'lucide-react';

interface InventoryViewProps {
  units: BloodUnit[];
  onAddUnit: (unit: Omit<BloodUnit, 'id'>) => void;
  onDeleteUnit: (id: string) => void;
}

export const InventoryView: React.FC<InventoryViewProps> = ({ units, onAddUnit, onDeleteUnit }) => {
  const [filterGroup, setFilterGroup] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  
  // New Unit Form State
  const [newGroup, setNewGroup] = useState<BloodGroup>(BloodGroup.A_POS);
  const [newVolume, setNewVolume] = useState(450);
  const [newStatus, setNewStatus] = useState<'Available' | 'Reserved'>('Available');

  const filteredUnits = units.filter(unit => {
    const matchesGroup = filterGroup === 'All' || unit.bloodGroup === filterGroup;
    const matchesSearch = unit.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesGroup && matchesSearch;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const today = new Date();
    const expiry = new Date();
    expiry.setDate(today.getDate() + 42); // Approx 42 days for shelf life

    onAddUnit({
      bloodGroup: newGroup,
      volume: newVolume,
      status: newStatus as any,
      collectionDate: today.toISOString().split('T')[0],
      expiryDate: expiry.toISOString().split('T')[0],
    });
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Blood Inventory</h2>
          <p className="text-slate-500">Manage blood units and stock levels</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-brand-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-brand-700 transition-colors shadow-lg shadow-brand-600/20"
        >
          <Plus className="w-5 h-5" />
          Add Blood Unit
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by Unit ID..." 
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
          <Filter className="w-5 h-5 text-slate-400" />
          <select 
            className="border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
            value={filterGroup}
            onChange={(e) => setFilterGroup(e.target.value)}
          >
            <option value="All">All Groups</option>
            {Object.values(BloodGroup).map(g => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-sm font-semibold uppercase tracking-wider">
                <th className="p-4">Unit ID</th>
                <th className="p-4">Blood Group</th>
                <th className="p-4">Volume</th>
                <th className="p-4">Collection Date</th>
                <th className="p-4">Expiry Date</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredUnits.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    No blood units found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredUnits.map((unit) => (
                  <tr key={unit.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-mono text-slate-600">#{unit.id}</td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 text-brand-700 font-bold text-sm border border-brand-100">
                        <Droplet className="w-3 h-3 fill-current" />
                        {unit.bloodGroup}
                      </span>
                    </td>
                    <td className="p-4 text-slate-600">{unit.volume} ml</td>
                    <td className="p-4 text-slate-600">{unit.collectionDate}</td>
                    <td className="p-4 text-slate-600">{unit.expiryDate}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-md text-xs font-semibold ${
                        unit.status === 'Available' ? 'bg-green-100 text-green-700' :
                        unit.status === 'Reserved' ? 'bg-amber-100 text-amber-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {unit.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => onDeleteUnit(unit.id)}
                        className="text-slate-400 hover:text-red-600 transition-colors p-2 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl animate-fade-in">
            <h3 className="text-xl font-bold mb-4">Add New Unit</h3>
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Blood Group</label>
                <select 
                  className="w-full border border-slate-300 rounded-lg px-3 py-2"
                  value={newGroup}
                  onChange={(e) => setNewGroup(e.target.value as BloodGroup)}
                >
                  {Object.values(BloodGroup).map(g => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Volume (ml)</label>
                <input 
                  type="number" 
                  required
                  className="w-full border border-slate-300 rounded-lg px-3 py-2"
                  value={newVolume}
                  onChange={(e) => setNewVolume(Number(e.target.value))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                <select 
                  className="w-full border border-slate-300 rounded-lg px-3 py-2"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as any)}
                >
                  <option value="Available">Available</option>
                  <option value="Reserved">Reserved</option>
                </select>
              </div>
              <div className="flex gap-3 mt-6">
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 font-medium"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 px-4 py-2 bg-brand-600 rounded-lg text-white hover:bg-brand-700 font-medium"
                >
                  Add Unit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};