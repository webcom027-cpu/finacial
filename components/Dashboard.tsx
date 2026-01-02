
import React from 'react';
import { Transaction, FinancialSummary, TransactionType } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface DashboardProps {
  transactions: Transaction[];
  aiAdvice: string;
}

const Dashboard: React.FC<DashboardProps> = ({ transactions, aiAdvice }) => {
  const summary: FinancialSummary = transactions.reduce((acc, curr) => {
    if (curr.type === TransactionType.RECEIPT) acc.totalReceipts += curr.amount;
    else if (curr.type === TransactionType.PAYMENT) acc.totalPayments += curr.amount;
    else if (curr.type === TransactionType.BANK_ENTRY) acc.bankBalance += curr.amount; // Simplified bank entry logic
    
    acc.netCashFlow = acc.totalReceipts - acc.totalPayments;
    return acc;
  }, { totalReceipts: 0, totalPayments: 0, bankBalance: 0, netCashFlow: 0 });

  const chartData = [
    { name: 'Income', value: summary.totalReceipts },
    { name: 'Expenses', value: summary.totalPayments },
  ];

  const COLORS = ['#4f46e5', '#f43f5e'];

  const recentTransactions = transactions.slice(0, 5);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h2 className="text-3xl font-extrabold text-slate-800">Financial Overview</h2>
        <p className="text-slate-500">Track your performance and gain AI insights.</p>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm transition-all hover:shadow-md">
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-4">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
          </div>
          <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Total Receipts</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">${summary.totalReceipts.toLocaleString()}</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm transition-all hover:shadow-md">
          <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mb-4">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" /></svg>
          </div>
          <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Total Payments</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">${summary.totalPayments.toLocaleString()}</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm transition-all hover:shadow-md">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-4">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Net Cash Flow</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">${summary.netCashFlow.toLocaleString()}</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm transition-all hover:shadow-md">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 14v20M12 10v14m4-18v18" /></svg>
          </div>
          <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Projected Bank</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">${summary.bankBalance.toLocaleString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Cash Flow Trends</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                <Tooltip 
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}}
                />
                <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Insight Card */}
        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-8 rounded-3xl text-white shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
              </span>
              <h3 className="text-lg font-bold">AI Financial Insights</h3>
            </div>
            <div className="space-y-4">
              {aiAdvice.split('\n').map((line, i) => (
                <p key={i} className="text-indigo-100 text-sm leading-relaxed">
                  {line}
                </p>
              ))}
            </div>
          </div>
          <button className="mt-8 py-3 w-full bg-white/10 hover:bg-white/20 rounded-xl font-semibold transition-all border border-white/20">
            Generate New Report
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-slate-800">Recent Activity</h3>
          <button className="text-indigo-600 font-semibold text-sm hover:underline">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-widest">
                <th className="px-8 py-4">Transaction</th>
                <th className="px-8 py-4">Category</th>
                <th className="px-8 py-4">Amount</th>
                <th className="px-8 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentTransactions.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-8 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        t.type === TransactionType.RECEIPT ? 'bg-indigo-50 text-indigo-600' : 'bg-rose-50 text-rose-600'
                      }`}>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={t.type === TransactionType.RECEIPT ? "M7 11l5-5m0 0l5 5m-5-5v12" : "M17 13l-5 5m0 0l-5-5m5 5V6"} />
                        </svg>
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">{t.description}</p>
                        <p className="text-xs text-slate-400">{t.date}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-4">
                    <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-semibold">
                      {t.category}
                    </span>
                  </td>
                  <td className={`px-8 py-4 font-bold ${
                    t.type === TransactionType.RECEIPT ? 'text-indigo-600' : 'text-rose-600'
                  }`}>
                    {t.type === TransactionType.RECEIPT ? '+' : '-'}${t.amount.toLocaleString()}
                  </td>
                  <td className="px-8 py-4">
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
                      <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                      Completed
                    </span>
                  </td>
                </tr>
              ))}
              {recentTransactions.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-8 py-12 text-center text-slate-400">
                    No transactions recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
