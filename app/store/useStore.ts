import { create } from 'zustand';
import { persist, PersistStorage } from 'zustand/middleware';
import { Transaction, Category, AppSettings, Currency, Language } from '../types';

interface StoreState {
  transactions: Transaction[];
  categories: Category[];
  settings: AppSettings;
  addTransaction: (transaction: Transaction) => void;
  addCategory: (category: Category) => void;
  updateCategory: (category: Category) => void;
  deleteCategory: (id: string) => void;
  updateSettings: (settings: AppSettings) => void;
  importData: (data: { transactions: Transaction[], categories: Category[], settings: AppSettings }) => void;
}

const customStorage: PersistStorage<StoreState> = {
  getItem: (name) => {
    const item = localStorage.getItem(name);
    return item ? JSON.parse(item) : null;
  },
  setItem: (name, value) => {
    localStorage.setItem(name, JSON.stringify(value));
  },
  removeItem: (name) => {
    localStorage.removeItem(name);
  },
};

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      transactions: [],
      categories: [],
      settings: {
        currency: Currency.USD,
        userName: 'User',
        language: Language.EN,
      },
      addTransaction: (transaction) =>
        set((state) => ({
          transactions: [...state.transactions, transaction],
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
    }),
    {
      name: 'expense-tracker-storage', // unique name for localStorage key
      storage: customStorage, // specify customStorage as the storage medium
    }
  )
);
