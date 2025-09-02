'use client';

import { useStore } from '../store/useStore';

import {
  Paper,
  Typography,
  Box,
} from '@mui/material';

import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

import { useTranslation } from '../hooks/useTranslation';
import { SkeletonLoader } from '../components/Loader';

export default function HomePage() {
  const { transactions, settings } = useStore();

  const getCurrencySymbol = (currencyString: string) => {
    const parts = currencyString.split(' ');
    return parts[parts.length - 1];
  };

  const { t, loading } = useTranslation();

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const thisMonthIncome = transactions
    .filter(t => new Date(t.date).getMonth() === currentMonth && new Date(t.date).getFullYear() === currentYear && t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0);

  const thisMonthExpenses = transactions
    .filter(t => new Date(t.date).getMonth() === currentMonth && new Date(t.date).getFullYear() === currentYear && t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);

  const thisMonthSaving = thisMonthIncome - thisMonthExpenses;

  const thisYearIncome = transactions
    .filter(t => new Date(t.date).getFullYear() === currentYear && t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0);

  const thisYearExpenses = transactions
    .filter(t => new Date(t.date).getFullYear() === currentYear && t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);

  const thisYearSaving = thisYearIncome - thisYearExpenses;
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

  const yearlyData = years.map(year => {
    const income = transactions
      .filter(t => new Date(t.date).getFullYear().toString() === year && t.type === 'income')
      .reduce((acc, t) => acc + t.amount, 0);
    const expense = transactions
      .filter(t => new Date(t.date).getFullYear().toString() === year && t.type === 'expense')
      .reduce((acc, t) => acc + t.amount, 0);
    return { year, income, expense };
  });



  const monthlyData = months.map(month => {
    const income = transactions
      .filter(t => new Date(t.date).getMonth() === (parseInt(month.value, 10) - 1) && t.type === 'income')
      .reduce((acc, t) => acc + t.amount, 0);
    const expense = transactions
      .filter(t => new Date(t.date).getMonth() === (parseInt(month.value, 10) - 1) && t.type === 'expense')
      .reduce((acc, t) => acc + t.amount, 0);
    return { month: month.label, income, expense };
  });

  const categorySpending = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc: Record<string, number>, t) => {
      acc[t.category.name] = (acc[t.category.name] || 0) + t.amount;
      return acc;
    }, {});

  const categoryChartData = Object.keys(categorySpending).map(category => ({
    name: category,
    value: categorySpending[category],
  }));

  if (loading) {
    return (
      <Box sx={{ pt: 1 }}>
        <SkeletonLoader />
      </Box>
    );
  }

  return (
    <>
      <Box sx={{ pt: 1 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {t.expense_tracker}
        </Typography>


        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 4 }}>
          <Paper 
            elevation={0}
            sx={{ 
              p: 2, 
              bgcolor: 'rgba(76, 175, 80, 0.15)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              color: 'success.main',
              fontWeight: 'bold',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
                pointerEvents: 'none',
                zIndex: -1,
              },
            }}
          >
            <Typography variant="h6">{t.total_income}</Typography>
            <Typography variant="h5">{getCurrencySymbol(settings.currency)} {totalIncome.toFixed(2)}</Typography>
          </Paper>
          <Paper 
            elevation={0}
            sx={{ 
              p: 2, 
              bgcolor: 'rgba(211, 47, 47, 0.15)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              color: 'error.main',
              fontWeight: 'bold',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
                pointerEvents: 'none',
                zIndex: -1,
              },
            }}
          >
            <Typography variant="h6">{t.total_expenses}</Typography>
            <Typography variant="h5">{getCurrencySymbol(settings.currency)} {totalExpenses.toFixed(2)}</Typography>
          </Paper>
          <Paper 
            elevation={0}
            sx={{ 
              p: 2, 
              bgcolor: 'rgba(2, 136, 209, 0.15)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              color: 'info.main',
              fontWeight: 'bold',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
                pointerEvents: 'none',
                zIndex: -1,
              },
            }}
          >
            <Typography variant="h6">{t.this_month_income}</Typography>
            <Typography variant="h5">{getCurrencySymbol(settings.currency)} {thisMonthIncome.toFixed(2)}</Typography>
          </Paper>
          <Paper 
            elevation={0}
            sx={{ 
              p: 2, 
              bgcolor: 'rgba(239, 83, 80, 0.15)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              color: 'error.main',
              fontWeight: 'bold',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
                pointerEvents: 'none',
                zIndex: -1,
              },
            }}
          >
            <Typography variant="h6">{t.this_month_expenses}</Typography>
            <Typography variant="h5">{getCurrencySymbol(settings.currency)} {thisMonthExpenses.toFixed(2)}</Typography>
          </Paper>
          <Paper 
            elevation={0}
            sx={{ 
              p: 2, 
              bgcolor: 'rgba(129, 199, 132, 0.15)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              color: 'success.main',
              fontWeight: 'bold',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
                pointerEvents: 'none',
                zIndex: -1,
              },
            }}
          >
            <Typography variant="h6">{t.this_month_saving}</Typography>
            <Typography variant="h5">{getCurrencySymbol(settings.currency)} {thisMonthSaving.toFixed(2)}</Typography>
          </Paper>
          <Paper 
            elevation={0}
            sx={{ 
              p: 2, 
              bgcolor: 'rgba(56, 142, 60, 0.15)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              color: 'success.dark',
              fontWeight: 'bold',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
                pointerEvents: 'none',
                zIndex: -1,
              },
            }}
          >
            <Typography variant="h6">{t.this_year_saving}</Typography>
            <Typography variant="h5">{getCurrencySymbol(settings.currency)} {thisYearSaving.toFixed(2)}</Typography>
          </Paper>

          <Paper 
            elevation={0}
            sx={{ 
              p: 2, 
              bgcolor: 'rgba(79, 195, 247, 0.15)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              color: 'info.main',
              fontWeight: 'bold',
              mb: 4,
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
                pointerEvents: 'none',
                zIndex: -1,
              },
            }}
          >
            <Typography variant="h6">Balance</Typography>
            <Typography variant="h5">{getCurrencySymbol(settings.currency)} {(totalIncome - totalExpenses).toFixed(2)}</Typography>
          </Paper>
        </Box>

        <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4 }}>
          Yearly Overview
        </Typography>
        <Paper 
          elevation={0}
          sx={{
            p: 3,
            mb: 4,
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            borderRadius: 2,
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
              pointerEvents: 'none',
              zIndex: -1,
            },
          }}
        >
          <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={yearlyData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip formatter={(value: number) => `${getCurrencySymbol(settings.currency)} ${value.toFixed(2)}`} />
            <Legend />
            <Line type="monotone" dataKey="income" stroke="#82ca9d" activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="expense" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
        </Paper>

        <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4 }}>
          Monthly Overview
        </Typography>
        <Paper 
          elevation={0}
          sx={{
            p: 3,
            mb: 4,
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            borderRadius: 2,
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
              pointerEvents: 'none',
              zIndex: -1,
            },
          }}
        >
          <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={monthlyData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value: number) => `${getCurrencySymbol(settings.currency)} ${value.toFixed(2)}`} />
            <Legend />
            <Line type="monotone" dataKey="income" stroke="#82ca9d" activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="expense" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
        </Paper>

        <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4 }}>
          Category Spending
        </Typography>
        <Paper 
          elevation={0}
          sx={{
            p: 3,
            mb: 4,
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            borderRadius: 2,
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
              pointerEvents: 'none',
              zIndex: -1,
            },
          }}
        >
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={categoryChartData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value: number) => `${getCurrencySymbol(settings.currency)} ${value.toFixed(2)}`} />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </Paper>
      </Box>

    </>
  );
}