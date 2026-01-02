
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import TransactionForm from './components/TransactionForm';
import DailyReports from './components/DailyReports';
import SheetConfigModal from './components/SheetConfigModal';
import { Transaction, TransactionType } from './types';
import { SheetService } from './services/sheetService';
import { geminiService } from './services/geminiService';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [aiAdvice, setAiAdvice] = useState('Analyzing financial patterns...');
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success'>('idle');
  const [sheetUrl, setSheetUrl] = useState(SheetService.getSheetUrl());

  useEffect(() => {
    const loadedTransactions = SheetService.getTransactions();
    setTransactions(loadedTransactions);
    geminiService.getFinancialAdvice(loadedTransactions).then(setAiAdvice);
  }, []);

  const handleAddTransaction = async (transaction: Transaction) => {
    setSyncStatus('syncing');
    await SheetService.saveTransaction(transaction);
    setTransactions(prev => [transaction, ...prev]);
    setSyncStatus('success');
    setTimeout(() => setSyncStatus('idle'), 3000);
    geminiService.getFinancialAdvice([transaction, ...transactions]).then(setAiAdvice);
  };

  const handleSaveSheetUrl = (url: string) => {
    SheetService.setSheetUrl(url);
    setSheetUrl(url);
  };

  const handleExport = () => {
    SheetService.exportToCSV(transactions);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onOpenSettings={() => setIsConfigOpen(true)}
        isLinked={!!sheetUrl}
      />
      
      <main className="flex-1 ml-64 p-10 min-w-0">
        <div className="max-w-6xl mx-auto">
          {/* Top Bar with Sync Indicator */}
          <div className="flex justify-between items-center mb-10">
            <div>
              <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] mb-1">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </p>
              <h1 className="text-4xl font-black text-slate-800 tracking-tight">Financial Command Center</h1>
            </div>
            
            <div className="flex items-center gap-4">
              {syncStatus !== 'idle' && (
                <div className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  syncStatus === 'syncing' ? 'bg-amber-50 text-amber-600 border border-amber-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                }`}>
                  {syncStatus === 'syncing' ? (
                    <>
                      <div className="animate-spin h-3 w-3 border-2 border-amber-600 border-t-transparent rounded-full"></div>
                      Syncing...
                    </>
                  ) : (
                    <>
                      <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                      Success
                    </>
                  )}
                </div>
              )}
              
              {!sheetUrl && (
                <button 
                  onClick={() => setIsConfigOpen(true)}
                  className="px-5 py-2.5 bg-rose-50 text-rose-600 border border-rose-100 font-black rounded-2xl text-[10px] uppercase tracking-widest hover:bg-rose-100 transition-all flex items-center gap-2"
                >
                  <div className="h-2 w-2 rounded-full bg-rose-500 animate-pulse"></div>
                  Connect Google Sheet
                </button>
              )}
              
              <button 
                onClick={handleExport}
                className="p-3.5 bg-white border border-slate-200 text-slate-500 rounded-2xl hover:bg-slate-50 transition-all flex items-center gap-2 group shadow-sm"
                title="Backup Local Data"
              >
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              </button>
              
              <button 
                onClick={() => setIsFormOpen(true)}
                className="px-8 py-3.5 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 shadow-xl shadow-indigo-200 transition-all active:scale-95 flex items-center gap-2 tracking-tight"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                Record Entry
              </button>
            </div>
          </div>

          <div className="relative">
            {activeTab === 'dashboard' && (
              <Dashboard transactions={transactions} aiAdvice={aiAdvice} />
            )}

            {activeTab === 'reports' && (
              <DailyReports transactions={transactions} />
            )}

            {activeTab === 'transactions' && (
              <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden animate-in fade-in duration-700">
                <div className="px-10 py-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
                  <h3 className="text-2xl font-black text-slate-800 tracking-tight">Master Ledger</h3>
                  <div className="flex gap-2">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.15em] ${
                      sheetUrl ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'
                    }`}>
                      {sheetUrl ? 'Auto-Synced to Sheet' : 'Local Only'}
                    </span>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-50/50 text-slate-400 uppercase text-[10px] font-black tracking-[0.25em]">
                        <th className="px-10 py-6">Date</th>
                        <th className="px-10 py-6">Particulars</th>
                        <th className="px-10 py-6">Category</th>
                        <th className="px-10 py-6">Payment Mode</th>
                        <th className="px-10 py-6 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {transactions.map((t) => (
                        <tr key={t.id} className="hover:bg-slate-50/80 transition-all group">
                          <td className="px-10 py-6 text-xs font-bold text-slate-400">{t.date}</td>
                          <td className="px-10 py-6">
                            <p className="font-bold text-slate-700 text-lg leading-tight tracking-tight">{t.description}</p>
                            {t.reference && <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Ref: {t.reference}</p>}
                          </td>
                          <td className="px-10 py-6">
                            <span className="px-3.5 py-1 bg-slate-100 text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-widest">
                              {t.category}
                            </span>
                          </td>
                          <td className="px-10 py-6 text-xs font-bold text-slate-500">{t.paymentMethod}</td>
                          <td className={`px-10 py-6 font-black text-right text-xl tracking-tighter ${
                            t.type === TransactionType.RECEIPT ? 'text-indigo-600' : 
                            t.type === TransactionType.PAYMENT ? 'text-rose-600' : 'text-blue-600'
                          }`}>
                            {t.type === TransactionType.RECEIPT ? '+' : 
                             t.type === TransactionType.PAYMENT ? '-' : ''}
                            ${t.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {transactions.length === 0 && (
                    <div className="p-32 text-center">
                      <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                         <svg className="w-10 h-10 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      </div>
                      <p className="text-slate-300 font-black uppercase tracking-[0.2em] text-sm">Waiting for first entry</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <TransactionForm 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        onSubmit={handleAddTransaction}
      />

      <SheetConfigModal
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
        onSave={handleSaveSheetUrl}
        currentUrl={sheetUrl}
      />
    </div>
  );
};

export default App;
