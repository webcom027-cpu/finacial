
import React, { useState, useEffect } from 'react';
import { Transaction, TransactionType } from '../types';
import { geminiService } from '../services/geminiService';

interface TransactionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (transaction: Transaction) => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    type: TransactionType.RECEIPT,
    amount: '',
    description: '',
    category: '',
    paymentMethod: 'Cash',
    reference: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [isSuggesting, setIsSuggesting] = useState(false);

  useEffect(() => {
    if (formData.description.length > 5) {
      const timer = setTimeout(async () => {
        setIsSuggesting(true);
        const suggestion = await geminiService.suggestCategory(formData.description);
        setFormData(prev => ({ ...prev, category: suggestion }));
        setIsSuggesting(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [formData.description]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const transaction: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      ...formData,
      amount: parseFloat(formData.amount) || 0
    };
    onSubmit(transaction);
    onClose();
    setFormData({
      type: TransactionType.RECEIPT,
      amount: '',
      description: '',
      category: '',
      paymentMethod: 'Cash',
      reference: '',
      date: new Date().toISOString().split('T')[0]
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-800">New Transaction</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="flex bg-slate-100 p-1 rounded-xl">
            {Object.values(TransactionType).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, type }))}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                  formData.type === type 
                    ? 'bg-white text-indigo-600 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {type.replace('_', ' ')}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Amount</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">$</span>
                <input
                  type="number"
                  required
                  value={formData.amount}
                  onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                  className="w-full pl-8 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  placeholder="0.00"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Date</label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase">Description</label>
            <input
              type="text"
              required
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              placeholder="e.g., Client Retainer, Office Rent..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Category</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  placeholder="Food, Rent, Salary..."
                />
                {isSuggesting && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-indigo-500 border-t-transparent"></div>
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Method</label>
              <select
                value={formData.paymentMethod}
                onChange={(e) => setFormData(prev => ({ ...prev, paymentMethod: e.target.value }))}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              >
                <option>Cash</option>
                <option>Bank Transfer</option>
                <option>Credit Card</option>
                <option>UPI</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase">Reference (Optional)</label>
            <input
              type="text"
              value={formData.reference}
              onChange={(e) => setFormData(prev => ({ ...prev, reference: e.target.value }))}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              placeholder="Cheque #, Invoice #..."
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 transition-all transform active:scale-[0.98] mt-4"
          >
            Add Transaction
          </button>
        </form>
      </div>
    </div>
  );
};

export default TransactionForm;
