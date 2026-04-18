import { format, subDays, startOfYear, isWeekend, parseISO } from 'date-fns';
import { Transaction, Category, TransactionType } from '../types';

const categories: Record<Category, [number, number]> = {
  'Food': [200, 800],
  'Rent': [8000, 15000],
  'Transport': [100, 600],
  'Entertainment': [300, 2000],
  'Bills': [500, 3000],
  'Shopping': [500, 5000],
  'Healthcare': [200, 5000],
  'Education': [1000, 8000],
  'EMI': [3000, 12000],
  'Salary': [30000, 70000]
};

const paymentMethods = ['UPI', 'Credit Card', 'Debit Card', 'Cash', 'Net Banking'];

/**
 * PHASE 1: Data Acquisition
 * Generates "Dirty" raw data (simulation)
 */
export function getRawData(count: number = 300) {
  const raw = [];
  const today = new Date();
  const categoryKeys = Object.keys(categories) as Category[];

  for (let i = 0; i < count; i++) {
    const randomDay = subDays(today, Math.floor(Math.random() * 365));
    const category = categoryKeys[Math.floor(Math.random() * categoryKeys.length)];
    const [min, max] = categories[category];
    
    // Sometimes inject anomalies
    const isAnomaly = Math.random() > 0.95;
    const amount = isAnomaly 
      ? (max * (2 + Math.random())) 
      : (Math.random() * (max - min) + min);

    raw.push({
      id: crypto.randomUUID(),
      txn_date: format(randomDay, 'yyyy-MM-dd'),
      cat_name: `  ${category.toUpperCase()}  `, // Messy names
      desc: `${category} transaction recorded on systems`,
      amt: amount.toString(), // String type instead of number
      type_val: category === 'Salary' ? 'INCOME' : 'EXPENSE',
      pay_mode: paymentMethods[Math.floor(Math.random() * paymentMethods.length)]
    });
  }
  return raw;
}

/**
 * PHASE 2 & 3: Cleaning & Feature Engineering
 * The Data Science Pipeline
 */
export function processRawData(rawData: any[]): Transaction[] {
  // 1. Data Cleaning
  const cleaned: Transaction[] = rawData.map(item => {
    const category = item.cat_name.trim().charAt(0) + item.cat_name.trim().toLowerCase().slice(1) as Category;
    const type = item.type_val.charAt(0) + item.type_val.toLowerCase().slice(1) as TransactionType;
    
    return {
      id: item.id,
      date: item.txn_date,
      category: category,
      description: item.desc,
      amount: parseFloat(item.amt),
      type: type,
      paymentMethod: item.pay_mode,
      month: format(parseISO(item.txn_date), 'MMMM'),
      isWeekend: isWeekend(parseISO(item.txn_date)),
      isHighSpend: false, // Will calculate in feature engineering step
    };
  });

  // 2. Feature Engineering: Category Statistics
  const categoryStats = cleaned
    .filter(t => t.type === 'Expense')
    .reduce((acc, t) => {
      if (!acc[t.category]) acc[t.category] = { sum: 0, count: 0 };
      acc[t.category].sum += t.amount;
      acc[t.category].count += 1;
      return acc;
    }, {} as Record<string, { sum: number, count: number }>);

  const categoryAverages = Object.entries(categoryStats).reduce((acc, [cat, stats]) => {
    acc[cat] = stats.sum / stats.count;
    return acc;
  }, {} as Record<string, number>);

  // 3. Feature Engineering: Flags and Rolling Averages
  const sorted = cleaned.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  return sorted.map((tx, index) => {
    // Flag anomalous/high spending (>1.5x category average)
    const avg = categoryAverages[tx.category] || 0;
    const isHighSpend = tx.type === 'Expense' && tx.amount > (avg * 1.5);

    // Calculate rolling 7-transaction average
    const window = sorted.slice(Math.max(0, index - 6), index + 1);
    const rollingSum = window.reduce((sum, t) => sum + t.amount, 0);
    const rolling7DayAvg = Number((rollingSum / window.length).toFixed(2));

    return {
      ...tx,
      isHighSpend,
      rolling7DayAvg
    };
  }).reverse(); // Most recent first for display
}
