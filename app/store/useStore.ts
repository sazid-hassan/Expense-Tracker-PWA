import { create } from 'zustand';
import { persist, PersistStorage } from 'zustand/middleware';
import { Transaction, Category, AppSettings, Currency, Language } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface LoadingState {
  isLoading: boolean;
  message?: string;
  variant?: 'spinner' | 'dots' | 'pulse' | 'skeleton' | 'overlay' | 'inline';
}

interface StoreState {
  transactions: Transaction[];
  categories: Category[];
  settings: AppSettings;
  loading: LoadingState;
  addTransaction: (transaction: Transaction) => void;
  updateTransaction: (transaction: Transaction) => void;
  deleteTransaction: (id: string) => void;
  addCategory: (category: Category) => void;
  updateCategory: (category: Category) => void;
  deleteCategory: (id: string) => void;
  updateSettings: (settings: AppSettings) => void;
  importData: (data: { transactions: Transaction[], categories: Category[], settings: AppSettings }) => void;
  clearAllData: () => void;
  setLoading: (loading: Partial<LoadingState>) => void;
  hideLoading: () => void;
}

const customStorage: PersistStorage<StoreState> = {
  getItem: (name) => {
    const item = typeof window !== 'undefined' ? localStorage.getItem(name) : null;
    return item ? JSON.parse(item) : null;
  },
  setItem: (name, value) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(name, JSON.stringify(value));
    }
  },
  removeItem: (name) => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(name);
    }
  },
};

const defaultCategories: Category[] = [
  {
    id: uuidv4(),
    name: 'Rent',
    description: 'Monthly rent payment',
    type: 'expense',
  },
  {
    id: uuidv4(),
    name: 'Electric Bill',
    description: 'Monthly electricity bill',
    type: 'expense',
  },
  {
    id: uuidv4(),
    name: 'Internet Bill',
    description: 'Monthly internet bill',
    type: 'expense',
  },
  {
    id: uuidv4(),
    name: 'Groceries',
    description: 'Daily food and household items',
    type: 'expense',
  },
  {
    id: uuidv4(),
    name: 'Salary',
    description: 'Monthly income from job',
    type: 'income',
  }
];

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      transactions: [],
      categories: defaultCategories,
      settings: {
        currency: Currency.USD,
        userName: 'User',
        language: Language.EN,
        backgroundImage: 'paper-desktop.jpg',
        backgroundOpacity: 0.75,
      },
      loading: {
        isLoading: false,
      },
      addTransaction: (transaction) =>
        set((state) => ({
          transactions: [...state.transactions, transaction],
        })),
      updateTransaction: (updatedTransaction) =>
        set((state) => ({
          transactions: state.transactions.map((transaction) =>
            transaction.id === updatedTransaction.id ? updatedTransaction : transaction
          ),
        })),
      deleteTransaction: (id) =>
        set((state) => ({
          transactions: state.transactions.filter(
            (transaction) => transaction.id !== id
          ),
        })),
      addCategory: (category) =>
        set((state) => ({
          categories: [...state.categories, category],
        })),
      updateCategory: (updatedCategory) =>
        set((state) => ({
          categories: state.categories.map((category) =>
            category.id === updatedCategory.id ? updatedCategory : category
          ),
        })),
      deleteCategory: (id) =>
        set((state) => ({
          categories: state.categories.filter((category) => category.id !== id),
        })),
      updateSettings: (settings) => set({ settings }),
      importData: (data) => set({ transactions: data.transactions, categories: data.categories, settings: data.settings }),
      clearAllData: () => set({ transactions: [], categories: [] }),
      setLoading: (loading) => 
        set((state) => ({
          loading: { ...state.loading, isLoading: true, ...loading },
        })),
      hideLoading: () => 
        set((state) => ({
          loading: { ...state.loading, isLoading: false },
        })),
    }),
    {
      name: 'expense-tracker-storage', // unique name for localStorage key
      storage: customStorage, // specify customStorage as the storage medium
    }
  )
);
