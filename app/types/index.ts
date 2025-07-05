export type TransactionType = 'income' | 'expense';

export interface Category {
  id: string;
  name: string;
  description: string;
  type: TransactionType;
}

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  type: TransactionType;
  category: Category;
}

export enum Currency {
  BDT = 'BDT ৳',
  USD = 'USD $',
  EUR = 'EUR €',
  GBP = 'GBP £',
  JPY = 'JPY ¥',
}

export enum Language {
  EN = 'English',
  BN = 'Bangla',
  NL = 'Dutch',
  ES = 'Spanish',
  PT = 'Portuguese',
  AR = 'Arabic',
}

export interface AppSettings {
  currency: Currency;
  userName: string;
  language: Language;
}
