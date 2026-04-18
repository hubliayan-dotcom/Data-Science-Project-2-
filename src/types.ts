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
}

export interface MonthlyStats {
  month: string;
  income: number;
  expense: number;
}
