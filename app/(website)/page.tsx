'use client';

import { useStore } from '../store/useStore';

  import {
  Paper,
  Typography,
  Box,
} from '@mui/material';

import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

import { useTranslation } from '../hooks/useTranslation';

export default function HomePage() {
  const { transactions, settings } = useStore();

  const getCurrencySymbol = (currencyString: string) => {
    const parts = currencyString.split(' ');
    return parts[parts.length - 1];
  };

  const { t, loading } = useTranslation();

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
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
    return <Typography>Loading translations...</Typography>;
  }

  return (
    <>
      <Box sx={{ pt: 1 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {t.expense_tracker}
        </Typography>

        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 4 }}>
          <Paper elevation={3} sx={{ p: 2, bgcolor: 'success.light', color: 'success.contrastText' }}>
            <Typography variant="h6">{t.total_income}</Typography>
            <Typography variant="h5">{getCurrencySymbol(settings.currency)} {totalIncome.toFixed(2)}</Typography>
          </Paper>
          <Paper elevation={3} sx={{ p: 2, bgcolor: 'error.light', color: 'error.contrastText' }}>
            <Typography variant="h6">{t.total_expenses}</Typography>
            <Typography variant="h5">{getCurrencySymbol(settings.currency)} {totalExpenses.toFixed(2)}</Typography>
          </Paper>
        </Box>

        <Paper elevation={3} sx={{ p: 2, bgcolor: 'info.light', color: 'info.contrastText', mb: 4 }}>
          <Typography variant="h6">Balance</Typography>
          <Typography variant="h5">{getCurrencySymbol(settings.currency)} {(totalIncome - totalExpenses).toFixed(2)}</Typography>
        </Paper>

        <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4 }}>
          Yearly Overview
        </Typography>
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

        <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4 }}>
          Monthly Overview
        </Typography>
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

        <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4 }}>
          Category Spending
        </Typography>
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
      </Box>

    </>
  );
}