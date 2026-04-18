import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Wallet, 
  TrendingUp, 
  PiggyBank, 
  ArrowUpRight, 
  Plus, 
  Settings, 
  LayoutDashboard,
  Bell,
  Search,
  ChevronRight
} from 'lucide-react';
import { cn } from './lib/utils';
import { Transaction } from './types';
import { generateSyntheticData } from './lib/data';
import { StatCard } from './components/StatCard';
import { DashboardCharts } from './components/DashboardCharts';
import { TransactionList } from './components/TransactionList';
import { AddTransactionForm } from './components/AddTransactionForm';

export default function App() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Load initial data
  useEffect(() => {
    const data = generateSyntheticData(200);
    setTransactions(data);
  }, []);

  // Calculate Metrics
  const metrics = useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'Expense').reduce((acc, t) => acc + t.amount, 0);
    const income = transactions.filter(t => t.type === 'Income').reduce((acc, t) => acc + t.amount, 0);
    const savings = income - expenses;
    const savingsRate = income > 0 ? (savings / income) * 100 : 0;

    return { expenses, income, savings, savingsRate };
  }, [transactions]);

  const handleAddTransaction = (newTx: Transaction) => {
    setTransactions(prev => [newTx, ...prev]);
  };

  return (
    <div className="min-h-screen flex bg-[#f8fafc]">
      {/* Sidebar */}
      <aside className="w-64 border-r border-gray-100 bg-white hidden lg:flex flex-col p-6 fixed h-full shrink-0">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-100">
            <Wallet className="w-6 h-6" />
          </div>
          <span className="text-xl font-black tracking-tight text-gray-900">SpendWise</span>
        </div>

        <nav className="flex-1 space-y-1">
          {[
            { icon: LayoutDashboard, label: 'Dashboard', active: true },
            { icon: TrendingUp, label: 'Analytics', active: false },
            { icon: PiggyBank, label: 'Savings', active: false },
            { icon: Bell, label: 'Alerts', active: false },
            { icon: Settings, label: 'Settings', active: false },
          ].map((item) => (
            <button
              key={item.label}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all",
                item.active 
                  ? "bg-indigo-50 text-indigo-700 shadow-sm" 
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
              {item.active && <ChevronRight className="w-4 h-4 ml-auto" />}
            </button>
          ))}
        </nav>

        <div className="mt-auto p-4 bg-indigo-600 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 -mr-4 -mt-4 w-16 h-16 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
          <p className="text-white/80 text-xs font-bold uppercase tracking-wider mb-1">Support Plan</p>
          <p className="text-white font-bold leading-tight">Get personalized financial tips</p>
          <button className="mt-3 w-full py-2 bg-white text-indigo-700 rounded-lg text-xs font-black uppercase tracking-widest shadow-lg">Upgrade</button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 p-4 lg:p-10 max-w-7xl mx-auto w-full">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Overview</h1>
            <p className="text-gray-500 font-medium mt-1">Track your growth and simplify your lifestyle.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-100 transition-all active:scale-95"
            >
              <Plus className="w-5 h-5" />
              Add Entry
            </button>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            label="Total Income" 
            value={`₹${metrics.income.toLocaleString()}`} 
            icon={<ArrowUpRight className="w-6 h-6 text-emerald-500" />}
            trend={{ value: 0.12, isUp: true }}
          />
          <StatCard 
            label="Total Expense" 
            value={`₹${metrics.expenses.toLocaleString()}`} 
            icon={<TrendingUp className="w-6 h-6 text-rose-500" />}
            trend={{ value: 0.05, isUp: false }}
          />
          <StatCard 
            label="Net Savings" 
            value={`₹${metrics.savings.toLocaleString()}`} 
            icon={<PiggyBank className="w-6 h-6 text-indigo-500" />}
          />
          <StatCard 
            label="Savings Rate" 
            value={`${metrics.savingsRate.toFixed(1)}%`}
            subValue="Target: 30.0%"
            className="bg-indigo-900 !text-white border-none"
            icon={<div className="text-indigo-200">📊</div>}
          />
        </div>

        {/* Charts */}
        <DashboardCharts transactions={transactions} />

        {/* Recent Transactions List */}
        <TransactionList transactions={transactions} />

        {/* Modal for adding transactions */}
        <AnimatePresence>
          {isAddModalOpen && (
            <AddTransactionForm 
              onAdd={handleAddTransaction}
              onClose={() => setIsAddModalOpen(false)}
            />
          )}
        </AnimatePresence>

        <footer className="mt-20 pt-10 border-t border-gray-100 text-center text-gray-400 text-sm">
          <p>© 2026 SpendWise Analytics • Built with Pulse Design System</p>
        </footer>
      </main>
    </div>
  );
}
