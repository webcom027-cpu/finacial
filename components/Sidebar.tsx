
import React from 'react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenSettings: () => void;
  isLinked: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, onOpenSettings, isLinked }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { id: 'transactions', label: 'Transactions', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' },
    { id: 'reports', label: 'Reports', icon: 'M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z' },
  ];

  return (
    <div className="w-64 bg-white border-r border-slate-200 h-screen fixed left-0 top-0 flex flex-col">
      <div className="p-6">
        <h1 className="text-2xl font-black text-indigo-600 flex items-center gap-2">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          FinDash
        </h1>
      </div>
      
      <nav className="flex-1 px-4 py-4">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 mb-2 rounded-2xl transition-all ${
              activeTab === item.id 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
            </svg>
            <span className="font-bold text-sm tracking-tight">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 mt-auto border-t border-slate-100">
        <button 
          onClick={onOpenSettings}
          className={`w-full p-4 rounded-2xl text-left transition-all overflow-hidden relative group ${
            isLinked ? 'bg-gradient-to-br from-indigo-500 to-indigo-700 text-white' : 'bg-slate-100 text-slate-600'
          }`}
        >
          <div className="relative z-10">
            <p className="text-[10px] font-black opacity-80 uppercase tracking-widest mb-1">Sheet Status</p>
            <p className="text-sm font-black mb-2">{isLinked ? 'Connected' : 'Disconnected'}</p>
            <div className="flex items-center gap-2">
              <div className={`h-2 w-2 rounded-full ${isLinked ? 'bg-emerald-400 animate-pulse' : 'bg-slate-400'}`}></div>
              <span className="text-[10px] font-bold opacity-80 uppercase">{isLinked ? 'Live Sync Active' : 'Offline Mode'}</span>
            </div>
          </div>
          <div className="absolute right-[-10px] bottom-[-10px] opacity-10 group-hover:scale-110 transition-transform">
             <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-2h2v2zm0-4H7v-2h2v2zm0-4H7V7h2v2zm4 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V7h2v2zm4 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V7h2v2z"/></svg>
          </div>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
