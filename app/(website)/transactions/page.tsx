'use client';

import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { Transaction } from '../../types';

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
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useMediaQuery,
  useTheme,
  Modal,
  TablePagination,
} from '@mui/material';

import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useTranslation } from '../../hooks/useTranslation';
import TransactionModal from '../../components/TransactionModal';
import TransactionDetailsModal from '../../components/TransactionDetailsModal';

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

const iosButtonStyleSmall = {
  ...iosButtonStyle,
  py: 0.5,
  px: 1.5,
  fontSize: '14px',
  minWidth: 'auto',
};

const iosButtonStyleError = {
  ...iosButtonStyle,
  background: 'linear-gradient(135deg, rgba(255, 59, 48, 0.3) 0%, rgba(255, 59, 48, 0.1) 100%)',
  border: '1px solid rgba(255, 59, 48, 0.3)',
  color: 'rgba(255, 59, 48, 0.9)',
  '&:hover': {
    background: 'linear-gradient(135deg, rgba(255, 59, 48, 0.4) 0%, rgba(255, 59, 48, 0.2) 100%)',
    boxShadow: '0 12px 40px rgba(255, 59, 48, 0.15), 0 4px 12px rgba(255, 59, 48, 0.1)',
    transform: 'translateY(-1px)',
  },
};

const iosButtonStyleSecondary = {
  ...iosButtonStyle,
  background: 'linear-gradient(135deg, rgba(0, 122, 255, 0.3) 0%, rgba(0, 122, 255, 0.1) 100%)',
  border: '1px solid rgba(0, 122, 255, 0.3)',
  color: 'rgba(0, 122, 255, 0.9)',
  '&:hover': {
    background: 'linear-gradient(135deg, rgba(0, 122, 255, 0.4) 0%, rgba(0, 122, 255, 0.2) 100%)',
    boxShadow: '0 12px 40px rgba(0, 122, 255, 0.15), 0 4px 12px rgba(0, 122, 255, 0.1)',
    transform: 'translateY(-1px)',
  },
};

export default function TransactionsPage() {
  const { transactions, settings,  deleteTransaction } = useStore();
  const [transactionToEdit, setTransactionToEdit] = useState<Transaction | null>(null);
  const [transactionToDelete, setTransactionToDelete] = useState<Transaction | null>(null);
  const [transactionToView, setTransactionToView] = useState<Transaction | null>(null);
  const [filterStartDate, setFilterStartDate] = useState<string>('');
  const [filterEndDate, setFilterEndDate] = useState<string>('');
  const [filterMonth, setFilterMonth] = useState<string>('');
  const [filterYear, setFilterYear] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  const handleOpenModal = (transaction?: Transaction) => {
    setTransactionToEdit(transaction || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTransactionToEdit(null);
  };

  const handleOpenDeleteModal = (transaction: Transaction) => {
    setTransactionToDelete(transaction);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setTransactionToDelete(null);
    setIsDeleteModalOpen(false);
  };

  const handleOpenViewModal = (transaction: Transaction) => {
    setTransactionToView(transaction);
    setIsViewModalOpen(true);
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setTransactionToView(null);
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

  const handleDeleteTransaction = () => {
    if (transactionToDelete) {
      deleteTransaction(transactionToDelete.id);
      handleCloseDeleteModal();
      showSnackbar(t.transaction_deleted_successfully, 'success');
    }
  };

  const sortedTransactions = transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const filteredTransactions = sortedTransactions.filter(transaction => {
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

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedTransactions = filteredTransactions.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

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
    return <Typography>{t.loading_translations}</Typography>;
  }

  return (
    <>
    <Box sx={{ pt: 1 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {t.transactions}
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, gap: 2 }}>
        <Button 
          variant="contained" 
          onClick={handleOpenFilterModal}
          sx={iosButtonStyleSecondary}
        >
          {t.filter_transactions}
        </Button>
        <Button 
          variant="contained" 
          onClick={() => handleOpenModal()}
          sx={iosButtonStyle}
        >
          + {t.add_new_transaction}
        </Button>
      </Box>

      <Modal
        open={isFilterModalOpen}
        onClose={handleCloseFilterModal}
        aria-labelledby="filter-modal-title"
        aria-describedby="filter-modal-description"
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
          width: isMobile ? '90%' : 400,
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
            <Button 
              variant="outlined" 
              onClick={() => {
                setFilterStartDate('');
                setFilterEndDate('');
                setFilterMonth('');
                setFilterYear('');
              }}
              sx={iosButtonStyleSecondary}
            >
              {t.clear_filters}
            </Button>
            <Button 
              variant="contained" 
              onClick={handleCloseFilterModal}
              sx={iosButtonStyle}
            >
              {t.apply_filters}
            </Button>
          </Box>
        </Box>
      </Modal>

      {isMobile ? (
        <Box>
          {paginatedTransactions.map((transaction) => (
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
                  {t.date}: {new Date(transaction.date).toLocaleDateString()}
                </Typography>
                <Typography sx={{ textTransform: 'capitalize' }}>
                  {t.type}: {transaction.type}
                </Typography>
                {transaction.notes && (
                  <Typography sx={{ mt: 1, fontStyle: 'italic', color: 'text.secondary' }}>
                    {t.notes}: {transaction.notes}
                  </Typography>
                )}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 1 }}>
                  <Button 
                    size="small" 
                    variant="contained" 
                    startIcon={<VisibilityIcon />}
                    onClick={() => handleOpenViewModal(transaction)}
                    sx={{ ...iosButtonStyleSecondary, mr: 1 }}
                  >
                    {t.view}
                  </Button>
                  <Button 
                    size="small" 
                    variant="contained" 
                    onClick={() => handleOpenModal(transaction)}
                    sx={{ ...iosButtonStyleSmall, mr: 1 }}
                  >
                    {t.edit}
                  </Button>
                  <Button 
                    size="small" 
                    variant="contained" 
                    onClick={() => handleOpenDeleteModal(transaction)}
                    sx={iosButtonStyleError}
                  >
                    {t.delete}
                  </Button>
                </Box>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      ) : (
        <Paper>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>{t.date}</TableCell>
                  <TableCell>{t.category}</TableCell>
                  <TableCell align="right">{t.amount}</TableCell>
                  <TableCell>{t.type}</TableCell>
                  <TableCell>{t.notes}</TableCell>
                  <TableCell>{t.actions}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedTransactions.map((transaction) => (
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
                    <TableCell sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {transaction.notes || '-'}
                    </TableCell>
                    <TableCell>
                      <Button 
                        size="small" 
                        variant="contained" 
                        startIcon={<VisibilityIcon />}
                        onClick={() => handleOpenViewModal(transaction)} 
                        sx={{ ...iosButtonStyleSecondary, mr: 1 }}
                      >
                        {t.view}
                      </Button>
                      <Button 
                        size="small" 
                        variant="contained" 
                        onClick={() => handleOpenModal(transaction)} 
                        sx={{ ...iosButtonStyleSmall, mr: 1 }}
                      >
                        {t.edit}
                      </Button>
                      <Button 
                        size="small" 
                        variant="contained" 
                        onClick={() => handleOpenDeleteModal(transaction)}
                        sx={iosButtonStyleError}
                      >
                        {t.delete}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[20, 50, 100, 200]}
            component="div"
            count={filteredTransactions.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      )}

      {isModalOpen && (
        <TransactionModal
          open={isModalOpen}
          onClose={handleCloseModal}
          transaction={transactionToEdit}
          showSnackbar={showSnackbar}
        />
      )}

      <Modal
        open={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        aria-labelledby="delete-transaction-modal-title"
        aria-describedby="delete-transaction-modal-description"
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
          width: isMobile ? '90%' : 400,
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
          <Typography id="delete-transaction-modal-title" variant="h6" component="h2" gutterBottom>
            {t.delete_transaction}
          </Typography>
          <Typography id="delete-transaction-modal-description" sx={{ mb: 2 }}>
            {t.are_you_sure_you_want_to_delete_this_transaction}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <Button 
              variant="outlined" 
              onClick={handleCloseDeleteModal}
              sx={iosButtonStyle}
            >
              {t.cancel}
            </Button>
            <Button 
              variant="contained" 
              onClick={handleDeleteTransaction}
              sx={iosButtonStyleError}
            >
              {t.delete}
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Transaction Details Modal */}
      <TransactionDetailsModal
        open={isViewModalOpen}
        onClose={handleCloseViewModal}
        transaction={transactionToView}
      />
    </Box>
    <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
      <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
        {snackbarMessage}
      </Alert>
    </Snackbar>
    </>
  );
}
