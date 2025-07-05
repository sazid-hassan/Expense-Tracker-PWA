'use client';

import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { Transaction, TransactionType } from '../../types';
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
  Modal,
} from '@mui/material';

import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useTranslation } from '../../hooks/useTranslation';

export default function TransactionsPage() {
  const { transactions, addTransaction, categories, settings } = useStore();
  const [newTransaction, setNewTransaction] = useState<Omit<Transaction, 'id'> | null>(null);
  const [filterStartDate, setFilterStartDate] = useState<string>('');
  const [filterEndDate, setFilterEndDate] = useState<string>('');
  const [filterMonth, setFilterMonth] = useState<string>('');
  const [filterYear, setFilterYear] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setNewTransaction(null);
  };

  const handleOpenFilterModal = () => setIsFilterModalOpen(true);
  const handleCloseFilterModal = () => setIsFilterModalOpen(false);

  const getCurrencySymbol = (currencyString: string) => {
    const parts = currencyString.split(' ');
    return parts[parts.length - 1];
  };

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { t, loading } = useTranslation();

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info' | 'warning'>('success');

  const showSnackbar = (message: string, severity: 'success' | 'error' | 'info' | 'warning') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

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
      showSnackbar(t.transaction_added_successfully, 'success');
    } else {
      showSnackbar(t.please_select_category_for_transaction, 'error');
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

  if (loading) {
    return <Typography>Loading translations...</Typography>;
  }

  return (
    <>
    <Box sx={{ pt: 1 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {t.transactions}
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, gap: 2 }}>
        <Button variant="outlined" color="secondary" onClick={handleOpenFilterModal}>
          {t.filter_transactions}
        </Button>
        <Button variant="contained" onClick={handleOpenModal}>
          {t.add_new_transaction}
        </Button>
      </Box>

      <Modal
        open={isFilterModalOpen}
        onClose={handleCloseFilterModal}
        aria-labelledby="filter-modal-title"
        aria-describedby="filter-modal-description"
      >
        <Box sx={{
          position: 'absolute' ,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: isMobile ? '90%' : 400,
          bgcolor: 'background.paper',
          border: '2px solid #000',
          boxShadow: 24,
          p: 4,
        }}>
          <Typography id="filter-modal-title" variant="h6" component="h2" gutterBottom>
            {t.filter_transactions}
          </Typography>
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
            <Button variant="contained" onClick={handleCloseFilterModal}>
              {t.apply_filters}
            </Button>
          </Box>
        </Box>
      </Modal>

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
                  {transaction.type === 'income' ? '+' : '-'} {getCurrencySymbol(settings.currency)} {transaction.amount.toFixed(2)}
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
                    {transaction.type === 'income' ? '+' : '-'} {getCurrencySymbol(settings.currency)} {transaction.amount.toFixed(2)}
                  </TableCell>
                  <TableCell sx={{ textTransform: 'capitalize' }}>{transaction.type}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Modal
        open={isModalOpen}
        onClose={handleCloseModal}
        aria-labelledby="add-transaction-modal-title"
        aria-describedby="add-transaction-modal-description"
      >
        <Box sx={{
          position: 'absolute' ,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: isMobile ? '90%' : 400,
          bgcolor: 'background.paper',
          border: '2px solid #000',
          boxShadow: 24,
          p: 4,
        }}>
          <Typography id="add-transaction-modal-title" variant="h6" component="h2" gutterBottom>
            {t.add_new_transaction}
          </Typography>
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
            <Button variant="outlined" onClick={handleCloseModal}>
              {t.cancel}
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
    <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
      <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
        {snackbarMessage}
      </Alert>
    </Snackbar>
    </>
  );
}
