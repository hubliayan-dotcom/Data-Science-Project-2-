import { format, subDays, startOfYear, eachDayOfInterval } from 'date-fns';
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

export function generateSyntheticData(count: number = 200): Transaction[] {
  const transactions: Transaction[] = [];
  const today = new Date();
  const start = startOfYear(today);
  
  const categoryKeys = Object.keys(categories) as Category[];

  for (let i = 0; i < count; i++) {
    const randomDay = subDays(today, Math.floor(Math.random() * 365));
    const category = categoryKeys[Math.floor(Math.random() * categoryKeys.length)];
    const [min, max] = categories[category];
    const amount = Number((Math.random() * (max - min) + min).toFixed(2));
    const type: TransactionType = category === 'Salary' ? 'Income' : 'Expense';

    transactions.push({
      id: crypto.randomUUID(),
      date: format(randomDay, 'yyyy-MM-dd'),
      category,
      description: `${category} transaction ${i + 1}`,
      amount,
      type,
      paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)]
    });
  }

  return transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
