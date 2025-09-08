export type TransactionType = 'income' | 'expense';

export interface Category {
  id: string;
  name: string;
  description?: string;
  type: TransactionType;
}

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  type: TransactionType;
  category: Category;
  notes?: string;
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

export enum BackgroundImage {
  PAPER_DESKTOP = 'paper-desktop',
  GREEN_BG = 'green-bg',
  DARK_STUDIO = 'dark-studio',
}

export interface BackgroundImageInfo {
  id: string;
  name: string;
  path: string;
  imagePath: string;
}

export interface AppSettings {
  currency: Currency;
  userName: string;
  language: Language;
  backgroundImage: string; // Changed to string to support dynamic background images
}
