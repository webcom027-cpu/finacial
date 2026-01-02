
import React, { useState } from 'react';

interface SheetConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (url: string) => void;
  currentUrl: string;
}

const SheetConfigModal: React.FC<SheetConfigModalProps> = ({ isOpen, onClose, onSave, currentUrl }) => {
  const [url, setUrl] = useState(currentUrl);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white rounded-[2.5rem] w-full max-w-md shadow-2xl overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-indigo-50/50">
          <div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">Sheet Connector</h2>
            <p className="text-xs font-bold text-indigo-500 uppercase tracking-widest mt-1">Live Google Sync</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors p-2 bg-white rounded-xl shadow-sm">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="p-8 space-y-6">
          <div className="space-y-4">
            <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl">
              <p className="text-xs text-amber-700 leading-relaxed font-medium">
                <strong>Instruction:</strong> Paste your Google Apps Script "Web App URL" below to enable automatic real-time storage in your sheet.
              </p>
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Web App API URL</label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://script.google.com/macros/s/.../exec"
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-mono text-xs"
              />
            </div>
          </div>

          <div className="flex gap-3">
             <button
              onClick={() => {
                setUrl('');
                onSave('');
                onClose();
              }}
              className="flex-1 py-4 bg-slate-100 text-slate-600 font-black rounded-2xl hover:bg-slate-200 transition-all active:scale-95"
            >
              Reset
            </button>
            <button
              onClick={() => {
                onSave(url);
                onClose();
              }}
              className="flex-[2] py-4 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 shadow-xl shadow-indigo-200 transition-all active:scale-95"
            >
              Link Sheet
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SheetConfigModal;
