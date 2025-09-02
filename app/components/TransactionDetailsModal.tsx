'use client';

import {
  Modal,
  Box,
  Typography,
  Button,
  Divider,
  Chip,
} from '@mui/material';
import { Transaction } from '../types';
import { useTranslation } from '../hooks/useTranslation';
import { useStore } from '../store/useStore';

interface TransactionDetailsModalProps {
  open: boolean;
  onClose: () => void;
  transaction: Transaction | null;
}

export default function TransactionDetailsModal({ open, onClose, transaction }: TransactionDetailsModalProps) {
  const { t } = useTranslation();
  const { settings } = useStore();

  const getCurrencySymbol = (currencyString: string) => {
    const parts = currencyString.split(' ');
    return parts[parts.length - 1];
  };

  if (!transaction) {
    return null;
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="transaction-details-modal-title"
      aria-describedby="transaction-details-modal-description"
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
        width: { xs: '90%', sm: 450 },
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
        <Typography id="transaction-details-modal-title" variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
          {t.transaction_details}
        </Typography>
        
        <Divider sx={{ mb: 3, borderColor: 'rgba(255, 255, 255, 0.2)' }} />
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Amount */}
          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              {t.amount}
            </Typography>
            <Typography 
              variant="h4" 
              sx={{ 
                color: transaction.type === 'income' ? 'success.main' : 'error.main',
                fontWeight: 'bold'
              }}
            >
              {transaction.type === 'income' ? '+' : '-'} {getCurrencySymbol(settings.currency)} {transaction.amount.toFixed(2)}
            </Typography>
          </Box>

          {/* Type */}
          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              {t.type}
            </Typography>
            <Chip 
              label={transaction.type} 
              color={transaction.type === 'income' ? 'success' : 'error'}
              sx={{ 
                textTransform: 'capitalize',
                fontWeight: 'bold',
                backgroundColor: transaction.type === 'income' 
                  ? 'rgba(76, 175, 80, 0.2)' 
                  : 'rgba(244, 67, 54, 0.2)',
                backdropFilter: 'blur(10px)',
              }}
            />
          </Box>

          {/* Category */}
          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              {t.category}
            </Typography>
            <Box sx={{ 
              p: 2, 
              backgroundColor: 'rgba(255, 255, 255, 0.1)', 
              borderRadius: 1,
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                {transaction.category.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {transaction.category.description}
              </Typography>
            </Box>
          </Box>

          {/* Date */}
          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              {t.date}
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
              {new Date(transaction.date).toLocaleDateString()}
            </Typography>
          </Box>

          {/* Notes */}
          {transaction.notes && (
            <Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                {t.notes}
              </Typography>
              <Box sx={{ 
                p: 2, 
                backgroundColor: 'rgba(255, 255, 255, 0.1)', 
                borderRadius: 1,
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                  {transaction.notes}
                </Typography>
              </Box>
            </Box>
          )}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
          <Button 
            variant="outlined" 
            onClick={onClose}
            sx={{
              borderColor: 'rgba(255, 255, 255, 0.3)',
              color: 'text.primary',
              '&:hover': {
                borderColor: 'rgba(255, 255, 255, 0.5)',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              }
            }}
          >
            {t.cancel}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
