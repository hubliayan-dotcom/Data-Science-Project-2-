import { useState } from 'react';
import { Transaction } from '../types';
import { format, parseISO } from 'date-fns';
import { Search, Download, AlertCircle, Info } from 'lucide-react';
import { cn } from '../lib/utils';

interface TransactionListProps {
  transactions: Transaction[];
}

export function TransactionList({ transactions }: TransactionListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('All');

  const categories = ['All', ...Array.from(new Set(transactions.map(t => t.category)))];

  const filtered = transactions.filter(t => {
    const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          t.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'All' || t.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm mt-8 overflow-hidden">
      <div className="p-6 border-bottom border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h4 className="text-lg font-bold text-gray-900">Engineered Transaction Feed</h4>
          <p className="text-xs text-gray-400 font-medium">Outlier detection and feature mapping applied</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search features..."
              className="pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 w-full md:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <select 
            className="px-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <button className="p-2 text-gray-500 hover:bg-gray-50 rounded-lg transition-colors border border-gray-100">
            <Download className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Temporal Index</th>
              <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Class / Category</th>
              <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Metadata</th>
              <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Analysis Flag</th>
              <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Scaled Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.slice(0, 50).map((tx) => (
              <tr key={tx.id} className="hover:bg-gray-50/50 transition-colors group">
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-600 font-mono italic">
                    {format(parseISO(tx.date), 'dd MMM yyyy')}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700">
                    {tx.category}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                  {tx.description}
                  <div className="text-[10px] text-gray-400 uppercase mt-0.5 font-bold">
                    Mode: {tx.paymentMethod} • Weekend: {tx.isWeekend ? 'Y' : 'N'}
                  </div>
                </td>
                <td className="px-6 py-4">
                  {tx.isHighSpend ? (
                    <div className="flex items-center gap-1.5 text-rose-600 font-black text-[10px] uppercase bg-rose-50 px-2 py-1 rounded inline-flex">
                      <AlertCircle className="w-3 h-3" />
                      Anomaly Detected
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-gray-400 font-bold text-[10px] uppercase px-2 py-1 rounded inline-flex">
                      <Info className="w-3 h-3" />
                      Normal Range
                    </div>
                  )}
                </td>
                <td className={cn(
                  "px-6 py-4 text-sm font-black text-right",
                  tx.type === 'Income' ? 'text-emerald-600' : 'text-gray-900'
                )}>
                  <div className="text-xs text-gray-400 font-normal mb-0.5">MA(7): ₹{tx.rolling7DayAvg?.toLocaleString()}</div>
                  {tx.type === 'Income' ? '+' : '-'}₹{tx.amount.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {filtered.length === 0 && (
        <div className="p-12 text-center text-gray-500 font-medium italic">
          Zero variance found matching specified filters.
        </div>
      )}
    </div>
  );
}
