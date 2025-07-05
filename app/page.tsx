'use client';

import { useState } from 'react';
import { useStore } from './store/useStore';
import { Transaction, TransactionType } from './types';
import { v4 as uuidv4 } from 'uuid';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Typography,
  Box,
  SelectChangeEvent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useTranslation } from './hooks/useTranslation';

export default function HomePage() {
  const { transactions, addTransaction, categories, settings } = useStore();
  const [newTransaction, setNewTransaction] = useState<Omit<Transaction, 'id'> | null>(null);
  const [filterStartDate, setFilterStartDate] = useState<string>('');
  const [filterEndDate, setFilterEndDate] = useState<string>('');
  const [filterMonth, setFilterMonth] = useState<string>('');
  const [filterYear, setFilterYear] = useState<string>('');

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { t } = useTranslation();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewTransaction(prev => {
      const currentTransaction = prev || {
        date: new Date().toISOString().split('T')[0],
        amount: 0,
        type: 'expense',
        category: categories[0] || { id: 'default', name: 'Uncategorized', description: 'Default category', type: 'expense' },
      };

      if (name === 'amount') {
        return { ...currentTransaction, amount: parseFloat(value) };
      } else if (name === 'date') {
        return { ...currentTransaction, date: value };
      }
      return currentTransaction;
    });
  };

  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    const { name, value } = event.target;
    setNewTransaction(prev => {
      const currentTransaction = prev || {
        date: new Date().toISOString().split('T')[0],
        amount: 0,
        type: 'expense',
        category: categories[0] || { id: 'default', name: 'Uncategorized', description: 'Default category', type: 'expense' },
      };

      if (name === 'category') {
        return { ...currentTransaction, category: categories.find(c => c.id === value) || currentTransaction.category };
      } else if (name === 'type') {
        return { ...currentTransaction, type: value as TransactionType };
      }
      return currentTransaction;
    });
  };

  const handleAddTransaction = () => {
    if (newTransaction && newTransaction.category) {
      addTransaction({ ...newTransaction, id: uuidv4() });
      setNewTransaction(null);
    } else {
      alert(t.please_select_category_for_transaction);
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    const transactionDate = new Date(transaction.date);

    // Date Range Filter
    if (filterStartDate && filterEndDate) {
      const start = new Date(filterStartDate);
      const end = new Date(filterEndDate);
      if (transactionDate < start || transactionDate > end) {
        return false;
      }
    }

    // Month Filter
    if (filterMonth) {
      const monthIndex = parseInt(filterMonth, 10) - 1; // Month is 0-indexed in Date object
      if (transactionDate.getMonth() !== monthIndex) {
        return false;
      }
    }

    // Year Filter
    if (filterYear) {
      if (transactionDate.getFullYear().toString() !== filterYear) {
        return false;
      }
    }

    return true;
  });

  const totalIncome = filteredTransactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
  const totalExpenses = filteredTransactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);

  const years = Array.from(new Set(transactions.map(t => new Date(t.date).getFullYear().toString()))).sort();
  const months = [
    { value: '1', label: 'January' },
    { value: '2', label: 'February' },
    { value: '3', label: 'March' },
    { value: '4', label: 'April' },
    { value: '5', label: 'May' },
    { value: '6', label: 'June' },
    { value: '7', label: 'July' },
    { value: '8', label: 'August' },
    { value: '9', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
  ];

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {t.expense_tracker}
      </Typography>

      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 2, bgcolor: 'success.light', color: 'white' }}>
          <Typography variant="h6">{t.total_income}</Typography>
          <Typography variant="h5">{settings.currency} {totalIncome.toFixed(2)}</Typography>
        </Paper>
        <Paper elevation={3} sx={{ p: 2, bgcolor: 'error.light', color: 'white' }}>
          <Typography variant="h6">{t.total_expenses}</Typography>
          <Typography variant="h5">{settings.currency} {totalExpenses.toFixed(2)}</Typography>
        </Paper>
      </Box>

      <Accordion sx={{ mt: 4, mb: 4 }} elevation={3}>
        <AccordionSummary
          expandIcon={<span>&#9660;</span>}
          aria-controls="filter-content" id="filter-header"
        >
          <Typography variant="h5" component="h2">{t.filter_transactions}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              type="date"
              label={t.start_date}
              value={filterStartDate}
              onChange={(e) => setFilterStartDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              type="date"
              label={t.end_date}
              value={filterEndDate}
              onChange={(e) => setFilterEndDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
            <FormControl fullWidth>
              <InputLabel>{t.month}</InputLabel>
            <Select
              value={filterMonth}
              onChange={(e) => setFilterMonth(e.target.value)}
              label={t.month}
            >
              <MenuItem value="">{t.all}</MenuItem>
              {months.map(month => (
                <MenuItem key={month.value} value={month.value}>{t[month.label.toLowerCase() as keyof typeof t]}</MenuItem>
              ))}
            </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>{t.year}</InputLabel>
            <Select
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value)}
              label={t.year}
            >
              <MenuItem value="">{t.all}</MenuItem>
              {years.map(year => (
                  <MenuItem key={year} value={year}>{year}</MenuItem>
                ))}
            </Select>
            </FormControl>
            <Button variant="outlined" onClick={() => {
              setFilterStartDate('');
              setFilterEndDate('');
              setFilterMonth('');
              setFilterYear('');
            }}>
              {t.clear_filters}
            </Button>
          </Box>
        </AccordionDetails>
      </Accordion>

      <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4 }}>
        {t.transactions}
      </Typography>

      {isMobile ? (
        <Box>
          {filteredTransactions.map((transaction) => (
            <Accordion key={transaction.id}>
              <AccordionSummary
                expandIcon={<span>&#9660;</span>}
                aria-controls={`panel-${transaction.id}-content`}
                id={`panel-${transaction.id}-header`}
              >
                <Typography sx={{ width: '33%', flexShrink: 0 }}>
                  {transaction.category.name}
                </Typography>
                <Typography sx={{ color: transaction.type === 'income' ? 'green' : 'red' }}>
                  {transaction.type === 'income' ? '+' : '-'} {settings.currency} {transaction.amount.toFixed(2)}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  Date: {new Date(transaction.date).toLocaleDateString()}
                </Typography>
                <Typography sx={{ textTransform: 'capitalize' }}>
                  Type: {transaction.type}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>{t.date}</TableCell>
                <TableCell>{t.category}</TableCell>
                <TableCell align="right">{t.amount}</TableCell>
                <TableCell>{t.type}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTransactions.map((transaction) => (
                <TableRow
                  key={transaction.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {new Date(transaction.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{transaction.category.name}</TableCell>
                  <TableCell align="right" sx={{ color: transaction.type === 'income' ? 'green' : 'red' }}>
                    {transaction.type === 'income' ? '+' : '-'} {settings.currency} {transaction.amount.toFixed(2)}
                  </TableCell>
                  <TableCell sx={{ textTransform: 'capitalize' }}>{transaction.type}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4 }}>
        {t.add_new_transaction}
      </Typography>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            fullWidth
            type="date"
            label={t.date}
            name="date"
            value={newTransaction?.date || new Date().toISOString().split('T')[0]}
            onChange={handleInputChange}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            fullWidth
            type="number"
            label={t.amount}
            name="amount"
            placeholder={t.amount}
            value={newTransaction?.amount || ''}
            onChange={handleInputChange}
          />
          <FormControl fullWidth>
            <InputLabel id="category-label">{t.category}</InputLabel>
            <Select
              labelId="category-label"
              id="category"
              name="category"
              value={newTransaction?.category?.id || ''}
              onChange={handleSelectChange}
              label={t.category}
            >
              {categories.map(category => (
                <MenuItem key={category.id} value={category.id}>{category.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel id="type-label">{t.type}</InputLabel>
            <Select
              labelId="type-label"
              id="type"
              name="type"
              value={newTransaction?.type || 'expense'}
              onChange={handleSelectChange}
              label={t.type}
            >
              <MenuItem value="expense">{t.expense}</MenuItem>
              <MenuItem value="income">{t.income}</MenuItem>
            </Select>
          </FormControl>
          <Button variant="contained" onClick={handleAddTransaction}>
            {t.add_transaction}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}