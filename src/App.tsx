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
  ChevronRight,
  Database,
  Cpu,
  BarChart3,
  RefreshCcw
} from 'lucide-react';
import { cn } from './lib/utils';
import { Transaction } from './types';
import { getRawData, processRawData } from './lib/data';
import { StatCard } from './components/StatCard';
import { DashboardCharts } from './components/DashboardCharts';
import { TransactionList } from './components/TransactionList';
import { AddTransactionForm } from './components/AddTransactionForm';
import { InsightsPanel } from './components/InsightsPanel';

export default function App() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [pipelineStep, setPipelineStep] = useState<string>('');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Data Science Pipeline Execution
  const runPipeline = async () => {
    setIsProcessing(true);
    
    setPipelineStep('Acquiring Raw Data...');
    const raw = getRawData(400);
    await new Promise(r => setTimeout(r, 800));

    setPipelineStep('Cleaning & Standardizing...');
    await new Promise(r => setTimeout(r, 600));

    setPipelineStep('Executing Feature Engineering...');
    const processed = processRawData(raw);
    await new Promise(r => setTimeout(r, 600));

    setPipelineStep('Generating Decision Support Insights...');
    await new Promise(r => setTimeout(r, 400));

    setTransactions(processed);
    setIsProcessing(false);
  };

  useEffect(() => {
    runPipeline();
  }, []);

  // Calculate Metrics
  const metrics = useMemo(() => {
    if (transactions.length === 0) return { expenses: 0, income: 0, savings: 0, savingsRate: 0, anomalies: 0 };
    const expenses = transactions.filter(t => t.type === 'Expense').reduce((acc, t) => acc + t.amount, 0);
    const income = transactions.filter(t => t.type === 'Income').reduce((acc, t) => acc + t.amount, 0);
    const savings = income - expenses;
    const savingsRate = income > 0 ? (savings / income) * 100 : 0;
    const anomalies = transactions.filter(t => t.isHighSpend).length;

    return { expenses, income, savings, savingsRate, anomalies };
  }, [transactions]);

  const handleAddTransaction = (newTx: any) => {
    // Re-process list when new data added to maintain feature engineering accuracy
    const allRaw = [{ ...newTx, txn_date: newTx.date, cat_name: newTx.category, amt: newTx.amount.toString(), type_val: newTx.type.toUpperCase(), pay_mode: newTx.paymentMethod }, ...transactions.map(t => ({ ...t, txn_date: t.date, cat_name: t.category, amt: t.amount.toString(), type_val: t.type.toUpperCase(), pay_mode: t.paymentMethod }))];
    const reProcessed = processRawData(allRaw);
    setTransactions(reProcessed);
  };

  return (
    <div className="min-h-screen flex bg-[#fbfcfd]">
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
            { icon: Cpu, label: 'DS Pipeline', active: false },
            { icon: BarChart3, label: 'Analytics', active: false },
            { icon: Bell, label: 'Alert Center', active: false },
            { icon: Settings, label: 'Configuration', active: false },
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

        <div className="mt-auto p-4 bg-gray-900 rounded-2xl relative overflow-hidden">
          <div className="flex items-center gap-2 text-white/60 mb-2">
            <Database className="w-4 h-4" />
            <span className="text-[10px] uppercase font-black tracking-widest">DS Status</span>
          </div>
          <p className="text-white text-sm font-bold leading-tight">Pipeline Optimized</p>
          <div className="mt-2 h-1 w-full bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-400 w-full" />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 p-4 lg:p-10 max-w-7xl mx-auto w-full">
        {/* Pipeline Loader Overlay */}
        <AnimatePresence>
          {isProcessing && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-white/80 backdrop-blur-md z-[100] flex flex-col items-center justify-center"
            >
              <div className="flex flex-col items-center">
                <RefreshCcw className="w-12 h-12 text-indigo-600 animate-spin mb-6" />
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">{pipelineStep}</h2>
                <div className="mt-8 flex gap-3">
                  {[1, 2, 3, 4].map(i => (
                    <motion.div 
                      key={i}
                      animate={{ scale: [1, 1.2, 1], opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                      className="w-3 h-3 bg-indigo-600 rounded-full"
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase rounded tracking-widest">Analytics Online</span>
            </div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Financial Intelligence</h1>
            <p className="text-gray-500 font-medium mt-1">Data-driven insights for automated decision support.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={runPipeline}
              className="p-2.5 bg-white border border-gray-100 rounded-xl text-gray-500 hover:text-indigo-600 hover:border-indigo-100 shadow-sm transition-all"
              title="Re-run DS Pipeline"
            >
              <RefreshCcw className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-100 transition-all active:scale-95"
            >
              <Plus className="w-5 h-5" />
              Add Data Point
            </button>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            label="Total Revenue" 
            value={`₹${metrics.income.toLocaleString()}`} 
            icon={<ArrowUpRight className="w-6 h-6 text-emerald-500" />}
          />
          <StatCard 
            label="Total Expenses" 
            value={`₹${metrics.expenses.toLocaleString()}`} 
            icon={<TrendingUp className="w-6 h-6 text-rose-500" />}
          />
          <StatCard 
            label="Anomalies detected" 
            value={metrics.anomalies.toString()} 
            subValue="Outlier detection active"
            className={metrics.anomalies > 0 ? "border-rose-200 bg-rose-50/30" : ""}
            icon={<Database className={cn("w-6 h-6", metrics.anomalies > 0 ? "text-rose-500" : "text-gray-400")} />}
          />
          <StatCard 
            label="Savings Rate" 
            value={`${metrics.savingsRate.toFixed(1)}%`}
            subValue="Real-time computation"
            className="bg-gray-900 !text-white border-none"
            icon={<div className="text-indigo-400">⚡</div>}
          />
        </div>

        {/* Decision Support Insights Panel */}
        <InsightsPanel transactions={transactions} />

        {/* Charts */}
        <DashboardCharts transactions={transactions} />

        {/* Recent Transactions List with DS Flags */}
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

        <footer className="mt-20 pt-10 border-t border-gray-100 flex items-center justify-between text-gray-400 text-xs font-medium">
          <p>© 2026 SpendWise Analytics • DS Architecture v2.4.0</p>
          <div className="flex gap-6 uppercase tracking-widest font-black">
            <span className="text-emerald-500">Preprocessing: OK</span>
            <span className="text-emerald-500">Feature Eng: OK</span>
            <span className="text-indigo-400">Modeling: READY</span>
          </div>
        </footer>
      </main>
    </div>
  );
}
