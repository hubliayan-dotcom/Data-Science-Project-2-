export type Category = 
  | 'Food' 
  | 'Rent' 
  | 'Transport' 
  | 'Entertainment' 
  | 'Bills' 
  | 'Shopping' 
  | 'Healthcare' 
  | 'Education' 
  | 'EMI' 
  | 'Salary';

export type TransactionType = 'Income' | 'Expense';

export interface Transaction {
  id: string;
  date: string;
  category: Category;
  description: string;
  amount: number;
  type: TransactionType;
  paymentMethod: string;
  // Feature Engineered Fields
  month: string;
  isWeekend: boolean;
  isHighSpend: boolean; // Flag if > 1.5x category average
  rolling7DayAvg?: number;
}

export interface Insight {
  type: 'info' | 'warning' | 'success';
  title: string;
  message: string;
  trend?: number;
}

export interface AnalyticsPanel {
  totalIncome: number;
  totalExpense: number;
  savingsRate: number;
  expenseToIncomeRatio: number;
  topCategory: string;
  anomaliesDetected: number;
}
