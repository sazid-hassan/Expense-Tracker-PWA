'use client';

import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

import {
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Typography,
  Box,
  SelectChangeEvent,
  Modal,
} from '@mui/material';
import { useTranslation } from '../hooks/useTranslation';

// iOS-style button configurations
const iosButtonStyle = {
  borderRadius: 3,
  textTransform: 'none' as const,
  fontWeight: 600,
  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.1) 100%)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255, 255, 255, 0.3)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1), 0 2px 8px rgba(0, 0, 0, 0.1)',
  color: 'rgba(0, 0, 0, 0.8)',
  '&:hover': {
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.2) 100%)',
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15), 0 4px 12px rgba(0, 0, 0, 0.1)',
    transform: 'translateY(-1px)',
  },
  '&:active': {
    transform: 'translateY(0px)',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1), 0 1px 4px rgba(0, 0, 0, 0.1)',
  },
};
import { Transaction, TransactionType, Category } from '../types';
import { useStore } from '../store/useStore';
import { InlineLoader } from './Loader';

interface ModalTransactionState {
  id?: string;
  date: string;
  amount: string;
  type: TransactionType;
  category: Category | null;
  notes?: string;
}

interface TransactionModalProps {
  open: boolean;
  onClose: () => void;
  transaction: Omit<Transaction, 'id'> | Transaction | null;
  showSnackbar: (message: string, severity: 'success' | 'error' | 'info' | 'warning') => void;
}

export default function TransactionModal({ open, onClose, transaction: initialTransaction, showSnackbar }: TransactionModalProps) {
  const { addTransaction, categories, updateTransaction } = useStore();
  const [transaction, setTransaction] = useState<ModalTransactionState | null>(null);

  const { t } = useTranslation();

  useEffect(() => {
    if (open) {
      if (initialTransaction) {
        setTransaction({
          ...initialTransaction,
          amount: String(initialTransaction.amount),
          category: 'category' in initialTransaction ? initialTransaction.category : null,
          notes: initialTransaction.notes || '',
        });
      } else if (categories.length > 0) {
        setTransaction({
          date: new Date().toISOString().split('T')[0],
          amount: '0',
          type: categories[0].type,
          category: categories[0],
          notes: '',
        });
      } else {
        // Fallback when categories haven't loaded yet
        setTransaction({
          date: new Date().toISOString().split('T')[0],
          amount: '0',
          type: 'expense',
          category: null,
          notes: '',
        });
      }
    }
  }, [open, initialTransaction, categories]);

  // Auto-select first category when categories load and no category is selected
  useEffect(() => {
    if (transaction && !transaction.category && categories.length > 0) {
      setTransaction(prev => {
        if (!prev) return null;
        return {
          ...prev,
          category: categories[0],
          type: categories[0].type,
        };
      });
    }
  }, [categories, transaction]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTransaction(prev => {
      if (!prev) return null;
      if (name === 'amount') {
        if (value === '' || /^[0-9]*\.?[0-9]*$/.test(value)) {
          return { ...prev, amount: value };
        }
        return prev;
      }
      return { ...prev, [name]: value };
    });
  };

  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    const { name, value } = event.target;
    setTransaction(prev => {
      if (!prev) return null;

      if (name === 'category') {
        const category = categories.find(c => c.id === value);
        if (category) {
          return { ...prev, category, type: category.type };
        }
      }
      return prev;
    });
  };

  const handleSave = () => {
    if (transaction && transaction.category) {
      const amountAsNumber = parseFloat(transaction.amount);
      if (isNaN(amountAsNumber)) {
        showSnackbar('Invalid amount', 'error');
        return;
      }

      const transactionToSave = {
        ...transaction,
        amount: amountAsNumber,
        category: transaction.category,
      };

      if (transactionToSave.id) {
        updateTransaction(transactionToSave as Transaction);
        showSnackbar(t.transaction_updated_successfully, 'success');
      } else {
        addTransaction({ ...(transactionToSave as Omit<Transaction, 'id'>), id: uuidv4() });
        showSnackbar(t.transaction_added_successfully, 'success');
      }
      onClose();
    } else {
      if (categories.length === 0) {
        showSnackbar('Please wait for categories to load', 'info');
      } else {
        showSnackbar(t.please_select_category_for_transaction, 'error');
      }
    }
  };

  if (!transaction) {
    return null;
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="transaction-modal-title"
      aria-describedby="transaction-modal-description"
      BackdropProps={{
        sx: {
          backgroundColor: 'rgba(0, 0, 0, 0.2)',
          backdropFilter: 'blur(4px)',
        }
      }}
    >
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        boxShadow: '0 16px 48px rgba(0, 0, 0, 0.4)',
        borderRadius: 2,
        p: 4,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.05) 100%)',
          pointerEvents: 'none',
          zIndex: -1,
          borderRadius: 'inherit',
        },
      }}>
        <Typography id="transaction-modal-title" variant="h6" component="h2" gutterBottom>
          {transaction.id ? t.edit_transaction : t.add_new_transaction}
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            fullWidth
            type="date"
            label={t.date}
            name="date"
            value={transaction.date}
            onChange={handleInputChange}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            fullWidth
            type="text" // Changed to text to allow empty string and better control
            label={t.amount}
            name="amount"
            placeholder={t.amount}
            value={transaction.amount}
            onChange={handleInputChange}
          />
          <FormControl fullWidth>
            <InputLabel id="category-label">{t.category}</InputLabel>
            <Select
              labelId="category-label"
              id="category"
              name="category"
              value={transaction.category?.id || ''}
              onChange={handleSelectChange}
              label={t.category}
            >
              {categories.length === 0 && (
                <MenuItem value="" disabled>
                  <InlineLoader message="Loading categories..." size="small" />
                </MenuItem>
              )}
              {categories.map(category => (
                <MenuItem key={category.id} value={category.id}>{category.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            multiline
            rows={3}
            label={t.notes}
            name="notes"
            placeholder={t.notes}
            value={transaction.notes || ''}
            onChange={handleInputChange}
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
                '&.Mui-focused': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
              },
            }}
          />
          <Button 
            variant="contained" 
            onClick={handleSave}
            sx={iosButtonStyle}
          >
            {transaction.id ? t.update_transaction : t.add_transaction}
          </Button>
          <Button 
            variant="outlined" 
            onClick={onClose}
            sx={iosButtonStyle}
          >
            {t.cancel}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}


