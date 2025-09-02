'use client';

import Link from 'next/link';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  Divider,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import CategoryIcon from '@mui/icons-material/Category';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import SettingsIcon from '@mui/icons-material/Settings';
import { usePathname } from 'next/navigation';
import { useTranslation } from '../hooks/useTranslation';

const DRAWER_WIDTH = 240;

export default function Sidebar() {
  const { t } = useTranslation();
  const pathname = usePathname();

  const menuItems = [
    {
      text: t.home || 'Dashboard',
      icon: <HomeIcon />,
      href: '/',
    },
    {
      text: t.categories,
      icon: <CategoryIcon />,
      href: '/categories',
    },
    {
      text: t.transactions,
      icon: <AccountBalanceWalletIcon />,
      href: '/transactions',
    },
    {
      text: t.settings,
      icon: <SettingsIcon />,
      href: '/settings',
    },
  ];

  const drawer = (
    <Box sx={{ overflow: 'auto' }}>
      {/* App Title */}
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', color: '#a51a1a' }}>
          {t.expense_tracker}
        </Typography>
      </Box>
      <Divider />
      
      {/* Navigation Menu */}
      <List>
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <ListItem key={item.href} disablePadding>
              <ListItemButton
                component={Link}
                href={item.href}
                selected={isActive}
                sx={{
                  mx: 1,
                  borderRadius: 2,
                  transition: 'all 0.2s ease-in-out',
                  '&.Mui-selected': {
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    color: 'text.primary',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.25)',
                      transform: 'translateY(-1px)',
                      boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)',
                    },
                    '& .MuiListItemIcon-root': {
                      color: 'text.primary',
                    },
                  },
                  '&:hover:not(.Mui-selected)': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    transform: 'translateY(-0.5px)',
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: isActive ? 'text.primary' : 'inherit',
                    transition: 'color 0.2s ease-in-out',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
          position: 'fixed',
          top: 0,
          left: 0,
          height: '100vh',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
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
          },
        },
      }}
    >
      {drawer}
    </Drawer>
  );
}

export { DRAWER_WIDTH };
