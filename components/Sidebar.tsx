import React from 'react';
import { LayoutDashboard, Wallet, Users, HeartPulse, LogOut, FileOutput } from 'lucide-react';

interface SidebarProps {
  currentView: string;
  onChangeView: (view: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    // { id: 'collection', label: 'Collection', icon: Wallet },
    { id: 'issue', label: 'Issue Blood', icon: FileOutput },
    { id: 'users', label: 'Users', icon: Users },
  ];

  return (
    <div className="h-screen w-64 bg-slate-900 text-white flex flex-col fixed left-0 top-0 shadow-2xl z-20 transition-all duration-300">
      <div className="p-6 flex items-center gap-3 border-b border-slate-800">
        <div className="bg-brand-600 p-2 rounded-lg shadow-lg shadow-brand-600/30">
          <HeartPulse className="w-6 h-6 text-white" />
        </div>
        <div>
            <h1 className="text-xl font-bold tracking-wide">HemoLife</h1>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Blood Bank OS</p>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onChangeView(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive
                  ? 'bg-brand-600 text-white shadow-lg shadow-brand-900/40 translate-x-1'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-white transition-colors'}`} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-red-400 rounded-xl transition-colors">
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </div>
  );
};