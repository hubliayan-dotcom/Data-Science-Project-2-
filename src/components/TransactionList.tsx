import { useState } from 'react';
import { Transaction, Category } from '../types';
import { format, parseISO } from 'date-fns';
import { Filter, Search, Download, ArrowUpDown } from 'lucide-react';
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
        <h4 className="text-lg font-bold text-gray-900">Recent Transactions</h4>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search..."
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

          <button className="p-2 text-gray-500 hover:bg-gray-50 rounded-lg transition-colors">
            <Download className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Method</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Amount</th>
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
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700">
                    {tx.category}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                  {tx.description}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {tx.paymentMethod}
                </td>
                <td className={cn(
                  "px-6 py-4 text-sm font-bold text-right",
                  tx.type === 'Income' ? 'text-emerald-600' : 'text-gray-900'
                )}>
                  {tx.type === 'Income' ? '+' : '-'}₹{tx.amount.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {filtered.length === 0 && (
        <div className="p-12 text-center text-gray-500">
          No transactions found matching your filters.
        </div>
      )}
    </div>
  );
}
