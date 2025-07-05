'use client';

import { useState } from 'react';
import { useStore } from '../store/useStore';
import { Category, TransactionType } from '../types';
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
  IconButton,
} from '@mui/material';
import { useTranslation } from '../hooks/useTranslation';


export default function CategoriesPage() {
  const { categories, addCategory, updateCategory, deleteCategory } = useStore();
  const [newCategory, setNewCategory] = useState<Omit<Category, 'id'> | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const { t } = useTranslation();

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
    } else {
      alert(t.please_fill_all_fields_for_new_category);
    }
  };

  const handleUpdateCategory = () => {
    if (editingCategory && editingCategory.name && editingCategory.description) {
      updateCategory(editingCategory);
      setEditingCategory(null);
    } else {
      alert(t.please_fill_all_fields_for_category);
    }
  };

  const handleDeleteCategory = (id: string) => {
    if (window.confirm(t.are_you_sure_delete_category)) {
      deleteCategory(id);
    }
  };

  const handleEditClick = (category: Category) => {
    setEditingCategory(category);
    setNewCategory(null); // Clear new category form when editing
  };

  const handleCancelEdit = () => {
    setEditingCategory(null);
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {t.categories}
      </Typography>

      <Paper elevation={3} sx={{ mb: 4 }}>
        <List>
          {categories.map(category => (
            <ListItem
              key={category.id}
              divider
              secondaryAction={
                <Box>
                  <IconButton edge="end" aria-label="edit" onClick={() => handleEditClick(category)}>
                    {t.edit}
                  </IconButton>
                  <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteCategory(category.id)}>
                    {t.delete}
                  </IconButton>
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

      <Typography variant="h5" component="h2" gutterBottom>
        {editingCategory ? t.edit_category : t.add_new_category}
      </Typography>
      <Paper elevation={3} sx={{ p: 4 }}>
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
              <Button variant="outlined" onClick={handleCancelEdit}>
                {t.cancel}
              </Button>
            </Box>
          ) : (
            <Button variant="contained" onClick={handleAddCategory}>
              {t.add_category}
            </Button>
          )}
        </Box>
      </Paper>
    </Box>
  );
}