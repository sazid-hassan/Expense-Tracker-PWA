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


export default function CategoriesPage() {
  const { categories, addCategory, updateCategory, deleteCategory } = useStore();
  const [newCategory, setNewCategory] = useState<Omit<Category, 'id'> | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
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

  const handleDeleteCategory = (id: string) => {
    if (window.confirm(t.are_you_sure_delete_category)) {
      deleteCategory(id);
      showSnackbar(t.category_deleted_successfully, 'success');
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

      <Button variant="contained" onClick={handleOpenAddModal} sx={{ mb: 2 }}>
        {t.add_new_category}
      </Button>

      <Paper elevation={3} sx={{ mb: 4 }}>
        <List>
          {categories.map(category => (
            <ListItem
              key={category.id}
              divider
              secondaryAction={
                <Box>
                  <Button variant="outlined" size="small" onClick={() => handleEditClick(category)} sx={{ mr: 1 }}>
                    ✏️
                  </Button>
                  <Button variant="outlined" size="small" color="error" onClick={() => handleDeleteCategory(category.id)}>
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
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '90%', sm: 400 },
          bgcolor: 'background.paper',
          border: '2px solid #000',
          boxShadow: 24,
          p: 4,
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
                <Button variant="contained" onClick={handleUpdateCategory}>
                  {t.save_changes}
                </Button>
                <Button variant="outlined" onClick={handleCloseAddModal}>
                  {t.cancel}
                </Button>
              </Box>
            ) : (
              <Button fullWidth variant="contained" onClick={handleAddCategory}>
              {t.add_category}
            </Button>
            )}
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