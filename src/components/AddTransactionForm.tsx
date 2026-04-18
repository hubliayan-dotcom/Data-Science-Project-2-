import React, { useState } from 'react';
import { Transaction, Category, TransactionType } from '../types';
import { Plus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const CATEGORIES: Category[] = [
  'Food', 'Rent', 'Transport', 'Entertainment', 'Bills', 
  'Shopping', 'Healthcare', 'Education', 'EMI', 'Salary'
];

interface AddTransactionFormProps {
  onAdd: (tx: Transaction) => void;
  onClose: () => void;
}

export function AddTransactionForm({ onAdd, onClose }: AddTransactionFormProps) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    category: 'Food' as Category,
    description: '',
    amount: '',
    type: 'Expense' as TransactionType,
    paymentMethod: 'UPI'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.description || !formData.amount) return;

    onAdd({
      id: crypto.randomUUID(),
      ...formData,
      amount: parseFloat(formData.amount),
    });
    onClose();
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-8 overflow-hidden relative"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-xl font-bold text-gray-900 mb-6">Add Transaction</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">Type</label>
              <select 
                className="w-full px-4 py-2 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as TransactionType })}
              >
                <option value="Expense">Expense</option>
                <option value="Income">Income</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">Date</label>
              <input 
                type="date"
                required
                className="w-full px-4 py-2 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase">Category</label>
            <select 
              className="w-full px-4 py-2 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as Category })}
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase">Description</label>
            <input 
              type="text"
              required
              placeholder="e.g. Starbucks Coffee"
              className="w-full px-4 py-2 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase">Amount (₹)</label>
            <input 
              type="number"
              required
              min="0"
              step="0.01"
              className="w-full px-4 py-2 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            />
          </div>

          <button 
            type="submit"
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-100 transition-all flex items-center justify-center gap-2 mt-4"
          >
            <Plus className="w-5 h-5" />
            Add Transaction
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}
