'use client';

import Link from 'next/link';
import { AppBar, Toolbar, Button, Typography, Container, IconButton, Menu, MenuItem, useMediaQuery, useTheme, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useState } from 'react';
import { useTranslation } from '../hooks/useTranslation';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const { t } = useTranslation();

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component={Link} href="/" sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}>            {t.expense_tracker}          </Typography>
          {isMobile ? (
            <Box>
              <IconButton
                size="large"
                edge="end"
                color="inherit"
                aria-label="menu"
                onClick={handleMenu}
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={open}
                onClose={handleClose}
              >
                
                <MenuItem onClick={handleClose} component={Link} href="/categories">{t.categories}</MenuItem>
                <MenuItem onClick={handleClose} component={Link} href="/transactions">{t.transactions}</MenuItem>
                <MenuItem onClick={handleClose} component={Link} href="/settings">{t.settings}</MenuItem>
              </Menu>
            </Box>
          ) : (
            <Box>
              
              <Button color="inherit" component={Link} href="/categories">{t.categories}</Button>
              <Button color="inherit" component={Link} href="/transactions">{t.transactions}</Button>
              <Button color="inherit" component={Link} href="/settings">{t.settings}</Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>
      <Container>
        {children}
      </Container>
    </>
  );
}