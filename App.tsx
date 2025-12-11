import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { CollectionView } from './components/CollectionView';
import { IssueBloodView } from './components/IssueBloodView';
import { UsersView } from './components/UsersView';
import { BloodUnit, BloodGroup } from './types';

// Mock Initial Data
const INITIAL_UNITS: BloodUnit[] = [
  { id: 'BU-1001', bloodGroup: BloodGroup.A_POS, collectionDate: '2023-10-25', expiryDate: '2023-12-06', volume: 450, status: 'Available' },
  { id: 'BU-1002', bloodGroup: BloodGroup.O_NEG, collectionDate: '2023-10-20', expiryDate: '2023-12-01', volume: 450, status: 'Available' },
  { id: 'BU-1003', bloodGroup: BloodGroup.B_POS, collectionDate: '2023-10-15', expiryDate: '2023-11-26', volume: 450, status: 'Reserved' },
  { id: 'BU-1004', bloodGroup: BloodGroup.AB_POS, collectionDate: '2023-10-28', expiryDate: '2023-12-09', volume: 450, status: 'Available' },
  { id: 'BU-1005', bloodGroup: BloodGroup.O_POS, collectionDate: '2023-10-26', expiryDate: '2023-12-07', volume: 450, status: 'Available' },
  { id: 'BU-1006', bloodGroup: BloodGroup.A_NEG, collectionDate: '2023-10-01', expiryDate: '2023-11-12', volume: 450, status: 'Expired' },
  { id: 'BU-1007', bloodGroup: BloodGroup.A_POS, collectionDate: '2023-10-25', expiryDate: '2023-12-06', volume: 450, status: 'Available' },
  { id: 'BU-1008', bloodGroup: BloodGroup.A_POS, collectionDate: '2023-10-25', expiryDate: '2023-12-06', volume: 450, status: 'Available' },
  { id: 'BU-1009', bloodGroup: BloodGroup.O_POS, collectionDate: '2023-10-25', expiryDate: '2023-12-06', volume: 450, status: 'Available' },
  { id: 'BU-1010', bloodGroup: BloodGroup.O_POS, collectionDate: '2023-10-25', expiryDate: '2023-12-06', volume: 450, status: 'Available' },
  { id: 'BU-1011', bloodGroup: BloodGroup.AB_NEG, collectionDate: '2023-10-25', expiryDate: '2023-12-06', volume: 450, status: 'Available' },
];

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [units] = useState<BloodUnit[]>(INITIAL_UNITS);

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard units={units} />;
      case 'collection':
        return <CollectionView />;
      case 'issue':
        return <IssueBloodView />;
      case 'users':
        return <UsersView />;
      default:
        return <Dashboard units={units} />;
    }
  };

  return (
    <div className="flex bg-slate-50 min-h-screen font-sans">
      <Sidebar currentView={currentView} onChangeView={setCurrentView} />
      
      <main className="ml-64 flex-1 p-8 h-screen overflow-y-auto">
        <div className="max-w-7xl mx-auto h-full">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;