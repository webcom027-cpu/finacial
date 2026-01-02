
import React from 'react';
import { Transaction, TransactionType } from '../types';
import { SheetService } from '../services/sheetService';

interface DailyReportsProps {
  transactions: Transaction[];
}

const DailyReports: React.FC<DailyReportsProps> = ({ transactions }) => {
  const dailyData = SheetService.getDailyReports(transactions);

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Daily Wise Reports</h2>
          <p className="text-slate-500 font-medium">Consolidated daily receipt and payment summaries.</p>
        </div>
        <div className="bg-indigo-50 px-4 py-2 rounded-xl border border-indigo-100 flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></div>
          <span className="text-xs font-bold text-indigo-700 uppercase">Live from Sheets</span>
        </div>
      </header>

      <div className="space-y-4">
        {dailyData.map((day: any) => (
          <div key={day.date} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden transition-all hover:shadow-md">
            <div className="px-8 py-5 bg-slate-50/50 border-b border-slate-100 flex justify-between items-center">
              <div>
                <span className="text-sm font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Date</span>
                <h3 className="text-lg font-bold text-slate-800">
                  {new Date(day.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </h3>
              </div>
              <div className="flex gap-8">
                <div className="text-right">
                  <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider block">Day Receipts</span>
                  <span className="text-xl font-black text-indigo-600">+${day.receipts.toLocaleString()}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-rose-500 uppercase tracking-wider block">Day Payments</span>
                  <span className="text-xl font-black text-rose-600">-${day.payments.toLocaleString()}</span>
                </div>
                <div className="text-right border-l border-slate-200 pl-8">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Daily Net</span>
                  <span className={`text-xl font-black ${day.receipts - day.payments >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    ${(day.receipts - day.payments).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="p-4">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50">
                    <th className="px-4 py-3">Description</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Method</th>
                    <th className="px-4 py-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {day.transactions.map((t: Transaction) => (
                    <tr key={t.id} className="text-sm group hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-3 font-medium text-slate-700">{t.description}</td>
                      <td className="px-4 py-3">
                        <span className="px-2.5 py-0.5 bg-slate-100 text-slate-500 rounded-lg text-xs font-bold uppercase">
                          {t.category}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-500">{t.paymentMethod}</td>
                      <td className={`px-4 py-3 text-right font-bold ${
                        t.type === TransactionType.RECEIPT ? 'text-indigo-600' : 'text-rose-600'
                      }`}>
                        {t.type === TransactionType.RECEIPT ? '+' : '-'}${t.amount.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}

        {dailyData.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
            <p className="text-slate-400 font-medium">No daily records found. Start by adding a transaction.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DailyReports;
