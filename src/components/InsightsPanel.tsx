import { motion } from 'motion/react';
import { Lightbulb, AlertTriangle, CheckCircle2, TrendingDown } from 'lucide-react';
import { Transaction, Insight } from '../types';
import { cn } from '../lib/utils';

interface InsightsPanelProps {
  transactions: Transaction[];
}

export function InsightsPanel({ transactions }: InsightsPanelProps) {
  const insights = useMemo(() => {
    const list: Insight[] = [];
    
    // 1. Savings Rate Insight
    const income = transactions.filter(t => t.type === 'Income').reduce((s, t) => s + t.amount, 0);
    const expense = transactions.filter(t => t.type === 'Expense').reduce((s, t) => s + t.amount, 0);
    const rate = income > 0 ? (income - expense) / income : 0;
    
    if (rate < 0.2) {
      list.push({
        type: 'warning',
        title: 'Critical Savings Rate',
        message: `Your savings rate is ${ (rate * 100).toFixed(1) }%, which is below the 20% healthy threshold. Consider reviewing non-essential expenses.`
      });
    } else {
      list.push({
        type: 'success',
        title: 'Healthy Savings',
        message: `Excellent! You are saving ${ (rate * 100).toFixed(1) }% of your income this period.`
      });
    }

    // 2. High Spend Alerts
    const anomalies = transactions.filter(t => t.isHighSpend);
    if (anomalies.length > 0) {
      const topAnomaly = anomalies[0];
      list.push({
        type: 'warning',
        title: 'Overspending Detection',
        message: `High spend detected in ${topAnomaly.category}: ₹${topAnomaly.amount.toLocaleString()} is significantly above category average.`
      });
    }

    // 3. Category Trend
    const categoryTotals = transactions.filter(t => t.type === 'Expense').reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

    const topCategory = Object.entries(categoryTotals).sort((a,b) => b[1] - a[1])[0];
    if (topCategory) {
      list.push({
        type: 'info',
        title: 'Primary Cost Driver',
        message: `${topCategory[0]} is your highest spending area, accounting for ₹${topCategory[1].toLocaleString()}.`
      });
    }

    return list;
  }, [transactions]);

  function useMemo(factory: () => Insight[], deps: any[]) {
    // Simulating React.useMemo inside component if not imported
    return factory();
  }

  return (
    <div className="mt-8 space-y-4">
      <h4 className="text-lg font-bold text-gray-900 flex items-center gap-2">
        <Lightbulb className="w-5 h-5 text-indigo-500" />
        AI-Generated Insights
      </h4>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {insights.map((insight, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={cn(
              "p-4 rounded-xl border flex gap-4",
              insight.type === 'warning' ? "bg-rose-50 border-rose-100" :
              insight.type === 'success' ? "bg-emerald-50 border-emerald-100" :
              "bg-indigo-50 border-indigo-100"
            )}
          >
            <div className="shrink-0 mt-1">
              {insight.type === 'warning' && <AlertTriangle className="w-5 h-5 text-rose-500" />}
              {insight.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
              {insight.type === 'info' && <TrendingDown className="w-5 h-5 text-indigo-500" />}
            </div>
            <div>
              <p className={cn(
                "text-sm font-bold",
                insight.type === 'warning' ? "text-rose-900" :
                insight.type === 'success' ? "text-emerald-900" :
                "text-indigo-900"
              )}>
                {insight.title}
              </p>
              <p className={cn(
                "text-sm mt-1 leading-relaxed",
                insight.type === 'warning' ? "text-rose-700" :
                insight.type === 'success' ? "text-emerald-700" :
                "text-indigo-700"
              )}>
                {insight.message}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
