'use client';

import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { Category, TransactionType } from '../../types';
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
  Paper,
  List,
  ListItem,
  ListItemText,
  SelectChangeEvent,
  Modal,
} from '@mui/material';

import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useTranslation } from '../../hooks/useTranslation';

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


export default function CategoriesPage() {
  const { categories, addCategory, updateCategory, deleteCategory } = useStore();
  const [newCategory, setNewCategory] = useState<Omit<Category, 'id'> | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const { t, loading } = useTranslation();

  const handleOpenAddModal = () => {
    setNewCategory(null); // Clear form when opening for new category
    setEditingCategory(null); // Ensure not in editing mode
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
    setNewCategory(null);
    setEditingCategory(null);
  };

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
    if (editingCategory) {
      setEditingCategory(prev => ({
        ...(prev as Category),
        [name]: value,
      }));
    } else {
      setNewCategory(prev => {
        const currentCategory = prev || {
          name: '',
          description: '',
          type: 'expense',
        };
        return { ...currentCategory, [name]: value };
      });
    }
  };

  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    const { name, value } = event.target;
    if (editingCategory) {
      setEditingCategory(prev => ({
        ...(prev as Category),
        [name]: value as TransactionType,
      }));
    } else {
      setNewCategory(prev => {
        const currentCategory = prev || {
          name: '',
          description: '',
          type: 'expense',
        };
        return { ...currentCategory, [name]: value as TransactionType };
      });
    }
  };

  const handleAddCategory = () => {
    if (newCategory && newCategory.name && newCategory.description) {
      addCategory({ ...newCategory, id: uuidv4() });
      setNewCategory(null);
      showSnackbar(t.category_added_successfully, 'success');
    } else {
      showSnackbar(t.please_fill_all_fields_for_new_category, 'error');
    }
  };

  const handleUpdateCategory = () => {
    if (editingCategory && editingCategory.name && editingCategory.description) {
      updateCategory(editingCategory);
      setEditingCategory(null);
      showSnackbar(t.category_updated_successfully, 'success');
    } else {
      showSnackbar(t.please_fill_all_fields_for_category, 'error');
    }
  };

  const handleDeleteClick = (category: Category) => {
    setCategoryToDelete(category);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setCategoryToDelete(null);
  };

  const handleConfirmDelete = () => {
    if (categoryToDelete) {
      deleteCategory(categoryToDelete.id);
      showSnackbar(t.category_deleted_successfully, 'success');
      setIsDeleteModalOpen(false);
      setCategoryToDelete(null);
    }
  };

  const handleEditClick = (category: Category) => {
    setEditingCategory(category);
    setNewCategory(null); // Clear new category form when editing
  };



  if (loading) {
    return <Typography>Loading translations...</Typography>;
  }

  return (
    <>
    <Box sx={{ pt: 1 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {t.categories}
      </Typography>

      <Button 
        variant="contained" 
        onClick={handleOpenAddModal} 
        sx={{ 
          ...iosButtonStyle,
          mb: 2,
          fontSize: '16px',
          py: 1.5,
          px: 3,
        }}
      >
        + {t.add_new_category}
      </Button>

      <Paper elevation={3} sx={{ mb: 4 }}>
        <List>
          {categories.map(category => (
            <ListItem
              key={category.id}
              divider
              secondaryAction={
                <Box>
                  <Button 
                    variant="contained" 
                    size="small" 
                    onClick={() => handleEditClick(category)} 
                    sx={{ ...iosButtonStyleSmall, mr: 1 }}
                  >
                    ✏️
                  </Button>
                  <Button 
                    variant="contained" 
                    size="small" 
                    onClick={() => handleDeleteClick(category)}
                    sx={iosButtonStyleError}
                  >
                    🗑️
                  </Button>
                </Box>
              }
            >
              <ListItemText
                primary={category.name}
                secondary={
                  <>
                    <Typography component="span" variant="body2" color="text.primary">
                      {category.description}
                    </Typography>
                    <br />
                    <Typography
                      component="span"
                      variant="body2"
                      sx={{ color: category.type === 'income' ? 'green' : 'red', textTransform: 'capitalize' }}
                    >
                      {category.type}
                    </Typography>
                  </>
                }
              />
            </ListItem>
          ))}
        </List>
      </Paper>

      <Modal
        open={isAddModalOpen || Boolean(editingCategory)}
        onClose={handleCloseAddModal}
        aria-labelledby="add-edit-category-modal-title"
        aria-describedby="add-edit-category-modal-description"
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
          width: { xs: '90%', sm: 400 },
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
          <Typography id="add-edit-category-modal-title" variant="h6" component="h2" gutterBottom>
            {editingCategory ? t.edit_category : t.add_new_category}
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label={t.name}
              name="name"
              value={editingCategory ? editingCategory.name : (newCategory?.name || '')}
              onChange={handleInputChange}
              variant="outlined"
            />
            <TextField
              fullWidth
              label={t.description}
              name="description"
              value={editingCategory ? editingCategory.description : (newCategory?.description || '')}
              onChange={handleInputChange}
              variant="outlined"
            />
            <FormControl fullWidth variant="outlined">
              <InputLabel id="type-label">{t.type}</InputLabel>
              <Select
                labelId="type-label"
                id="type"
                name="type"
                value={editingCategory ? editingCategory.type : (newCategory?.type || 'expense')}
                onChange={handleSelectChange}
                label={t.type}
              >
                <MenuItem value="expense">{t.expense}</MenuItem>
                <MenuItem value="income">{t.income}</MenuItem>
              </Select>
            </FormControl>
            {editingCategory ? (
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button 
                  variant="contained" 
                  onClick={handleUpdateCategory}
                  sx={iosButtonStyle}
                >
                  {t.save_changes}
                </Button>
                <Button 
                  variant="outlined" 
                  onClick={handleCloseAddModal}
                  sx={iosButtonStyle}
                >
                  {t.cancel}
                </Button>
              </Box>
            ) : (
              <Button 
                fullWidth 
                variant="contained" 
                onClick={handleAddCategory}
                sx={iosButtonStyle}
              >
                {t.add_new_category}
              </Button>
            )}
          </Box>
        </Box>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        open={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        aria-labelledby="delete-category-modal-title"
        aria-describedby="delete-category-modal-description"
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
          width: { xs: '90%', sm: 400 },
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
          <Typography id="delete-category-modal-title" variant="h6" component="h2" gutterBottom>
            {t.delete_category}
          </Typography>
          <Typography id="delete-category-modal-description" sx={{ mb: 2 }}>
            {t.are_you_sure_delete_category}
          </Typography>
          {categoryToDelete && (
            <Typography variant="body2" sx={{ mb: 3, p: 2, bgcolor: 'rgba(255, 255, 255, 0.1)', borderRadius: 1 }}>
              <strong>{categoryToDelete.name}</strong><br />
              {categoryToDelete.description}
            </Typography>
          )}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button 
              variant="outlined" 
              onClick={handleCloseDeleteModal}
              sx={iosButtonStyle}
            >
              {t.cancel}
            </Button>
            <Button 
              variant="contained" 
              onClick={handleConfirmDelete}
              sx={iosButtonStyleError}
            >
              {t.delete}
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