import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { Transaction } from '../types';
import { format, parseISO, startOfMonth } from 'date-fns';

const COLORS = [
  '#6366f1', '#10b981', '#f59e0b', '#ef4444', 
  '#8b5cf6', '#ec4899', '#06b6d4', '#f97316'
];

interface DashboardChartsProps {
  transactions: Transaction[];
}

export function DashboardCharts({ transactions }: DashboardChartsProps) {
  // Aggregate data for Line Chart (Monthly Income vs Expense)
  const monthlyDataMap = transactions.reduce((acc, tx) => {
    const month = format(parseISO(tx.date), 'MMM yyyy');
    if (!acc[month]) acc[month] = { month, income: 0, expense: 0 };
    if (tx.type === 'Income') acc[month].income += tx.amount;
    else acc[month].expense += tx.amount;
    return acc;
  }, {} as Record<string, { month: string; income: number; expense: number }>);

  const lineData = Object.values(monthlyDataMap).reverse();

  // Aggregate data for Pie Chart (Expense by Category)
  const categoryDataMap = transactions
    .filter(tx => tx.type === 'Expense')
    .reduce((acc, tx) => {
      acc[tx.category] = (acc[tx.category] || 0) + tx.amount;
      return acc;
    }, {} as Record<string, number>);

  const pieData = Object.entries(categoryDataMap)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <h4 className="text-lg font-bold mb-6 text-gray-900 font-sans">Monthly Cash Flow</h4>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis 
                dataKey="month" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: '#9ca3af' }}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: '#9ca3af' }}
                tickFormatter={(val) => `₹${(val / 1000).toFixed(0)}k`}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                formatter={(val: number) => `₹${val.toLocaleString()}`}
              />
              <Legend verticalAlign="top" height={36}/>
              <Line 
                type="monotone" 
                dataKey="income" 
                stroke="#10b981" 
                strokeWidth={3} 
                dot={{ r: 4, fill: '#10b981' }}
                activeDot={{ r: 6 }} 
              />
              <Line 
                type="monotone" 
                dataKey="expense" 
                stroke="#ef4444" 
                strokeWidth={3} 
                dot={{ r: 4, fill: '#ef4444' }}
                activeDot={{ r: 6 }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <h4 className="text-lg font-bold mb-6 text-gray-900 font-sans">Expenses by Category</h4>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(val: number) => `₹${val.toLocaleString()}`}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              />
              <Legend layout="vertical" align="right" verticalAlign="middle" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
